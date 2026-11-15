import type { Centimes } from "@/types/dispagaz";

/**
 * Demo configuration of the Dispagaz customer app.
 * Every figure here is a demonstration value, meant to be replaced by the
 * real configuration (pricing service / back office) later.
 */
export const demoConfig = {
  currency: "MAD",
  /** Home delivery fee per order (démo). */
  deliveryFee: 1500 as Centimes,
  /** How long a bottle stays reserved at a Point Dispagaz (démo). */
  reservationHours: 24,
  maxQuantity: 6,
  topUp: {
    quickAmounts: [10000, 20000, 30000, 50000] as Centimes[],
    min: 2000 as Centimes,
    max: 500000 as Centimes,
  },
  /** Simulated network latency of the mock services, in ms. */
  latency: { min: 350, max: 750 },
  /** localStorage keys. */
  storageKeys: {
    database: "dispagaz-demo-db-v1",
    session: "dispagaz-demo-session-v1",
  },
} as const;
