import type { Metadata } from "next";
import { WalletScreen } from "@/features/wallet/WalletScreen";

export const metadata: Metadata = { title: "Portefeuille" };

export default function Page() {
  return <WalletScreen />;
}
