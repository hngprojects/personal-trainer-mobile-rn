import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
  endConnection,
  fetchProducts,
  finishTransaction,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  type Product,
  type Purchase,
} from 'react-native-iap';

import { ApiError } from '@/shared/api/types';
import { toast } from '@/shared/components';

import { createSubscription } from '../api/subscription.api';
import { productIdForPlan, SUBSCRIPTION_SKUS } from '../constants/products';

const USER_CANCELLED = 'user-cancelled';
const isIOS = Platform.OS === 'ios';

/**
 * Drives the session-pack purchase flow with react-native-iap (v15 / OpenIAP).
 * The packs are CONSUMABLE in-app products (`type: 'in-app'`), NOT auto-renewable
 * subscriptions — the store charges once per purchase, the backend counts the
 * sessions and reports remaining via GET /subscriptions/me/usage, and the SKU
 * can be bought again once exhausted (finishTransaction `isConsumable: true`).
 *
 * Flow: connect → fetch products → requestPurchase → (listener) verify on backend
 * (POST /subscriptions) → finishTransaction. The store result is delivered
 * asynchronously to `purchaseUpdatedListener`, so the purchase promise resolving
 * does NOT mean it succeeded — the listener is the source of truth.
 *
 * Requires a native/dev build (the IAP native module isn't in Expo Go).
 */
export function useSubscriptionPurchase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [connected, setConnected] = useState(false);
  // True while a purchase + its backend verification are in flight.
  const [pending, setPending] = useState(false);
  const onSuccessRef = useRef<(() => void) | null>(null);
  // The plan/trainer in flight for the active purchase, forwarded to the backend
  // from the (async) purchase listener.
  const planIdRef = useRef<string | null>(null);
  const trainerIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const updateSub = purchaseUpdatedListener(async (purchase: Purchase) => {
      const token = purchase.purchaseToken;
      const planId = planIdRef.current;
      const trainerId = trainerIdRef.current;

      if (!token || !planId || !trainerId) {
        // Missing data we can't recover here (e.g. a restored purchase with no
        // plan/trainer context) — clear it from the queue and bail quietly.
        await finishTransaction({ purchase, isConsumable: true }).catch(() => undefined);
        if (mountedRef.current) setPending(false);
        onSuccessRef.current = null;
        return;
      }

      try {
        await createSubscription({
          planId,
          trainerId,
          platform: isIOS ? 'apple' : 'google',
          productId: purchase.productId,
          // Apple → receipt_data, Google → purchase_token. The unified token is
          // the StoreKit JWS on iOS / the Play token on Android.
          receiptData: isIOS ? token : null,
          purchaseToken: isIOS ? null : token,
        });
        await finishTransaction({ purchase, isConsumable: true });
        if (!mountedRef.current) return;
        toast.success('Sessions added. You’re all set!');
        onSuccessRef.current?.();
      } catch (error) {
        // 409 = this receipt/token was already used → the sessions were already
        // credited. Treat as success (reuse), finish, and continue.
        if (error instanceof ApiError && error.status === 409) {
          await finishTransaction({ purchase, isConsumable: true }).catch(() => undefined);
          if (mountedRef.current) {
            toast.success('These sessions are already on your account.');
            onSuccessRef.current?.();
          }
        } else {
          // Do NOT finish on verify failure — it stays queued and retries on the
          // next launch.
          const message =
            error instanceof ApiError
              ? error.message
              : "We couldn't verify your purchase. It will retry automatically.";
          toast.error(message);
        }
      } finally {
        if (mountedRef.current) setPending(false);
        onSuccessRef.current = null;
      }
    });

    const errorSub = purchaseErrorListener((error) => {
      if (mountedRef.current) setPending(false);
      onSuccessRef.current = null;
      if (String(error.code) === USER_CANCELLED) return; // user dismissed the sheet
      toast.error('Purchase failed. Please try again.');
    });

    (async () => {
      try {
        await initConnection();
        if (!mountedRef.current) return;
        setConnected(true);
        const result = await fetchProducts({ skus: SUBSCRIPTION_SKUS, type: 'in-app' });
        if (mountedRef.current && Array.isArray(result)) {
          setProducts(result as Product[]);
          if (result.length === 0) {
            console.warn(
              '[IAP] Store returned 0 in-app products for',
              SUBSCRIPTION_SKUS,
              '— check the products exist as CONSUMABLE in-app purchases (not subscriptions) and are active in the store, the build is on a test track, and the account is a license tester.',
            );
          }
        }
      } catch (error) {
        console.warn('[IAP] init/fetch failed:', error instanceof Error ? error.message : error);
      }
    })();

    return () => {
      mountedRef.current = false;
      updateSub.remove();
      errorSub.remove();
      endConnection().catch(() => undefined);
    };
  }, []);

  const purchase = useCallback(
    async (planId: string, opts?: { trainerId?: string | null; onSuccess?: () => void }) => {
      const sku = productIdForPlan(planId);
      if (!sku) {
        toast.error('This plan is not available for purchase.');
        return;
      }
      if (!opts?.trainerId) {
        toast.error('Pick a trainer before subscribing.');
        return;
      }
      if (!connected) {
        toast.error("The store isn't ready yet. Please try again in a moment.");
        return;
      }

      // The product must have loaded from the store, else the sheet won't open
      // ("fails in the background"). Usual causes: product not created/approved,
      // build not on a test track, or account not a license tester.
      const product = products.find((p) => p.id === sku);
      if (!product) {
        toast.error("This plan isn't available from the store yet. Please try again shortly.");
        return;
      }

      onSuccessRef.current = opts.onSuccess ?? null;
      planIdRef.current = planId;
      trainerIdRef.current = opts.trainerId;
      setPending(true);
      try {
        await requestPurchase({
          type: 'in-app',
          request: {
            apple: { sku },
            google: { skus: [sku] },
          },
        });
        // Outcome arrives via purchaseUpdatedListener / purchaseErrorListener.
      } catch {
        if (mountedRef.current) setPending(false);
        onSuccessRef.current = null;
        toast.error("We couldn't start the purchase. Please try again.");
      }
    },
    [connected, products],
  );

  const priceForPlan = useCallback(
    (planId: string): string | null => {
      const sku = productIdForPlan(planId);
      return products.find((p) => p.id === sku)?.displayPrice ?? null;
    },
    [products],
  );

  return { products, connected, pending, purchase, priceForPlan };
}
