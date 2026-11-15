import type {
  Address,
  AddressInput,
  Availability,
  DistributorStatus,
  Fulfillment,
  Language,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PropertyType,
  TransactionType,
} from "@/types/dispagaz";

export const languageLabels: Record<Language, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  appartement: "Appartement",
  maison: "Maison",
  villa: "Villa",
};

export const fulfillmentLabels: Record<Fulfillment, string> = {
  delivery: "Livraison à domicile",
  pickup: "Point Dispagaz",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  wallet: "Portefeuille Dispagaz",
  card: "Carte bancaire",
  cod: "Paiement à la livraison",
  terminal: "Carte au terminal",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: "Payé",
  to_collect: "À régler à la livraison",
  to_pay_at_terminal: "Paiement à effectuer au distributeur",
  refunded: "Remboursé",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  received: "Commande reçue",
  confirmed: "Confirmée",
  preparing: "En préparation",
  out_for_delivery: "En cours de livraison",
  delivered: "Livrée",
  reserved: "Prête au retrait",
  collected: "Retirée",
  cancelled: "Annulée",
};

export const deliverySteps: OrderStatus[] = [
  "received",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const transactionTypeLabels: Record<TransactionType, string> = {
  recharge: "Recharge",
  commande: "Commande",
  remboursement: "Remboursement",
  ajustement: "Ajustement",
};

export const availabilityLabels: Record<Availability, string> = {
  in_stock: "Disponible",
  limited: "Stock limité",
  out_of_stock: "Indisponible",
};

export const distributorStatusLabels: Record<DistributorStatus, string> = {
  open: "Ouvert",
  closed: "Fermé",
  maintenance: "En maintenance",
};

export function isOrderActive(order: Order) {
  return (
    order.status !== "delivered" && order.status !== "collected" && order.status !== "cancelled"
  );
}

/** One-line street address, adapted to the property type. */
export function addressLine(address: AddressInput | Address): string {
  const unit =
    address.propertyType === "appartement"
      ? [
          address.buildingName,
          address.buildingNumber && `Bât. ${address.buildingNumber}`,
          address.floor && `${address.floor}${/^\d+$/.test(address.floor) ? "e" : ""} étage`,
          address.apartmentNumber && `Appt ${address.apartmentNumber}`,
        ]
      : address.propertyType === "villa"
        ? [address.villaNumber && `Villa ${address.villaNumber}`, address.compound]
        : [address.houseNumber && `N° ${address.houseNumber}`];
  return [...unit, address.street].filter(Boolean).join(", ");
}

export function cityLine(address: AddressInput | Address): string {
  return [address.district, address.city].filter(Boolean).join(", ");
}
