// Public surface of the subscription feature.

// API + types
export {
  createSubscription,
  getMySubscription,
  getMySubscriptionUsage,
  cancelSubscription,
} from './api/subscription.api';
export type {
  Subscription,
  SubscriptionUsage,
  CreateSubscriptionInput,
  StorePlatform,
} from './api/subscription.api';

// Catalog
export {
  SUBSCRIPTION_PLANS,
  SUBSCRIPTION_SKUS,
  planForId,
  productIdForPlan,
} from './constants/products';
export type { SubscriptionPlan } from './constants/products';

// Hooks
export { useMySubscription, MY_SUBSCRIPTION_QUERY_KEY } from './hooks/useMySubscription';
export { useSubscriptionUsage, SUBSCRIPTION_USAGE_QUERY_KEY } from './hooks/useSubscriptionUsage';
export { useCancelSubscription } from './hooks/useCancelSubscription';
export { useSubscriptionPurchase } from './hooks/useSubscriptionPurchase';
export { useBookingGate } from './hooks/useBookingGate';

// Screens
export { SubscriptionPlansScreen } from './components/SubscriptionPlansScreen';
export { PlanDetailsScreen } from './components/PlanDetailsScreen';
