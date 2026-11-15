import type { Metadata } from "next";
import { ConfirmationScreen } from "@/features/orders/ConfirmationScreen";

export const metadata: Metadata = { title: "Commande confirmée" };

export default function Page() {
  return <ConfirmationScreen />;
}
