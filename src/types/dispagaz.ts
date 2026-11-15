/**
 * Dispagaz customer app — domain types.
 *
 * All monetary amounts are integers in **centimes** (1 MAD = 100) to avoid
 * floating-point errors. Format them with `formatMAD()` from lib/dispagaz.
 */

export type ID = string;
export type Centimes = number;
export type ISODate = string;

/* ----------------------------------------------------------- Account */

export type AuthProvider = "email" | "google";
export type Language = "fr" | "ar" | "en";

export type User = {
  id: ID;
  email: string;
  provider: AuthProvider;
  createdAt: ISODate;
};

export type Session = {
  userId: ID;
  email: string;
  provider: AuthProvider;
  remember: boolean;
  createdAt: ISODate;
};

export type Profile = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate?: string;
  language: Language;
};

export type PaymentMethod = "wallet" | "card" | "cod" | "terminal";

export type Preferences = {
  defaultPaymentMethod: Exclude<PaymentMethod, "terminal">;
};

/* ----------------------------------------------------------- Addresses */

export type PropertyType = "appartement" | "maison" | "villa";

export type AddressInput = {
  label: string;
  city: string;
  district: string;
  street: string;
  directions?: string;
  phone: string;
  propertyType: PropertyType;
  // Appartement
  buildingName?: string;
  buildingNumber?: string;
  floor?: string;
  apartmentNumber?: string;
  intercom?: string;
  // Maison
  houseNumber?: string;
  // Villa
  villaNumber?: string;
  compound?: string;
  // All
  deliveryInstructions?: string;
  /** Map position placeholder — filled by a maps provider later. */
  position?: { lat: number; lng: number } | null;
};

export type Address = AddressInput & {
  id: ID;
  isDefault: boolean;
  createdAt: ISODate;
};

/* ----------------------------------------------------------- Wallet */

export type TransactionType = "recharge" | "commande" | "remboursement" | "ajustement";

export type WalletTransaction = {
  id: ID;
  type: TransactionType;
  /** Signed amount: positive = credit, negative = debit. */
  amount: Centimes;
  balanceAfter: Centimes;
  reference: string;
  description: string;
  orderId?: ID;
  createdAt: ISODate;
};

export type Wallet = {
  balance: Centimes;
  transactions: WalletTransaction[];
};

/* ----------------------------------------------------------- Catalog */

export type ProductCategory = "butane" | "propane";
export type Availability = "in_stock" | "limited" | "out_of_stock";

export type Product = {
  id: ID;
  category: ProductCategory;
  brand: string;
  name: string;
  /** Display size, e.g. "12 kg". */
  size: string;
  weightKg: number;
  price: Centimes;
  /** Consigne charged when no empty bottle is exchanged. */
  deposit: Centimes;
  /** Image key or URL (rendered by <BottleImage /> until real photos exist). */
  image: string;
  availability: Availability;
};

/* ----------------------------------------------------------- Distributors */

export type DistributorStatus = "open" | "closed" | "maintenance";

export type Distributor = {
  id: ID;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  /** Distance from the customer, in km (mock until geolocation is wired). */
  distanceKm: number;
  openingHours: string;
  is24_7: boolean;
  status: DistributorStatus;
  /** Stock per product id. */
  inventory: Record<ID, number>;
};

/* ----------------------------------------------------------- Orders */

export type Fulfillment = "delivery" | "pickup";

export type DeliveryStatus =
  "received" | "confirmed" | "preparing" | "out_for_delivery" | "delivered";
export type PickupStatus = "reserved" | "collected";
export type OrderStatus = DeliveryStatus | PickupStatus | "cancelled";

export type PaymentStatus = "paid" | "to_collect" | "to_pay_at_terminal" | "refunded";

export type OrderItem = {
  productId: ID;
  name: string;
  brand: string;
  category: ProductCategory;
  size: string;
  unitPrice: Centimes;
  quantity: number;
};

export type AddressSnapshot = Omit<Address, "isDefault" | "createdAt">;

export type PickupDetails = {
  reference: string;
  code: string;
  expiresAt: ISODate;
  requiresEmptyBottleReturn: boolean;
  emptyBottleReturned: boolean;
  collected: boolean;
};

export type Order = {
  id: ID;
  number: string;
  createdAt: ISODate;
  fulfillment: Fulfillment;
  items: OrderItem[];
  exchangeEmptyBottle: boolean;
  subtotal: Centimes;
  depositTotal: Centimes;
  deliveryFee: Centimes;
  total: Centimes;
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    reference: string;
    cardLast4?: string;
  };
  address?: AddressSnapshot;
  distributor?: { id: ID; name: string; address: string; is24_7: boolean };
  pickup?: PickupDetails;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: ISODate }[];
};

/** Checkout in progress (persisted so a refresh never loses it). */
export type OrderDraft = {
  /** Identifies a checkout session (a new value restarts the flow). */
  startedAt: ISODate;
  fulfillment?: Fulfillment;
  productId?: ID;
  quantity: number;
  exchangeEmptyBottle: boolean;
  addressId?: ID;
  newAddress?: AddressInput & { saveToProfile: boolean };
  distributorId?: ID;
  paymentMethod?: PaymentMethod;
};

/* ----------------------------------------------------------- Notifications */

export type AppNotification = {
  id: ID;
  title: string;
  body: string;
  href?: string;
  read: boolean;
  createdAt: ISODate;
};

/* ----------------------------------------------------------- Demo database */

export type Account = {
  user: User;
  profile: Profile | null;
  addresses: Address[];
  wallet: Wallet;
  orders: Order[];
  notifications: AppNotification[];
  preferences: Preferences;
  draft: OrderDraft | null;
};

export type DemoDatabase = {
  version: 1;
  accounts: Record<string, Account>;
  /** Stock changes on top of the mock distributor data. */
  inventoryDelta: Record<ID, Record<ID, number>>;
};

/** Result type returned by every service — mirrors a future API response. */
export type ServiceResult<T> = { ok: true; data: T } | { ok: false; error: string };
