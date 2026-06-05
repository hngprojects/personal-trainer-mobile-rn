// Session packs. These are CONSUMABLE in-app products — a one-time purchase that
// credits a fixed number of sessions; the backend counts usage and the client
// shows sessions remaining (GET /subscriptions/me/usage). NOT auto-renewable, so
// the store never charges again on its own — the user re-buys when exhausted.
// `planId` is sent to the backend as `plan_id`; `productId` is the store SKU
// queried/purchased. This catalog is the single source of truth — screens render
// from it rather than duplicating copy.
//
// Mapping confirmed with the team (2026-06-05):
//   casual     → 1 session   · $12  · single trainer
//   committed  → 12 sessions · $100 · any trainer
//   consistent → 18 sessions · $150 · any trainer
// SKUs are namespaced under the app's bundle/package id `net.emerj.fitcall`.
//
// ⚠️ Each `productId` must be created as a CONSUMABLE in-app purchase (NOT a
// subscription) in App Store Connect / Play Console, with this exact id, else
// the purchase sheet won't open. `displayPrice` here is only a pre-store-load
// fallback — the authoritative localized price comes from the store (see
// useSubscriptionPurchase.priceForPlan).
export interface SubscriptionPlan {
  /** Backend plan_id. */
  planId: string;
  /** Store consumable in-app product id (SKU). */
  productId: string;
  /** Marketing title shown on the plans list. */
  title: string;
  /** Sessions granted by this pack. */
  sessions: number;
  /** Fallback price shown before the store responds. */
  displayPrice: string;
  /** Whether sessions can be booked across multiple trainers. */
  multiTrainer: boolean;
  /** Short scope line shown under the price. */
  scope: string;
  /** Bullet features for the plan card. */
  features: string[];
  /** Optional badge (e.g. "BEST VALUE"). */
  tag?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    planId: 'casual',
    productId: 'net.emerj.fitcall.pack.casual',
    title: 'Single Session',
    sessions: 1,
    displayPrice: '$12',
    multiTrainer: false,
    scope: '1 session with one trainer',
    features: ['One 1-on-1 session', 'Train with a single trainer', 'Pick your time'],
  },
  {
    planId: 'committed',
    productId: 'net.emerj.fitcall.pack.committed',
    title: 'Committed',
    sessions: 12,
    displayPrice: '$100',
    multiTrainer: true,
    scope: '12 sessions across any trainer',
    features: [
      '12 sessions to use any time',
      'Book with any trainer you like',
      'Best for a steady routine',
    ],
    tag: 'BEST VALUE',
  },
  {
    planId: 'consistent',
    productId: 'net.emerj.fitcall.pack.consistent',
    title: 'Consistent',
    sessions: 18,
    displayPrice: '$150',
    multiTrainer: true,
    scope: '18 sessions across any trainer',
    features: [
      '18 sessions to use any time',
      'Book with any trainer you like',
      'Best value per session',
    ],
  },
];

/** All SKUs to query from the store on connect. */
export const SUBSCRIPTION_SKUS: string[] = SUBSCRIPTION_PLANS.map((p) => p.productId);

export function planForId(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.planId === planId);
}

export function productIdForPlan(planId: string): string | undefined {
  return planForId(planId)?.productId;
}
