import type { Metadata } from "next";
import { TopUpScreen } from "@/features/wallet/TopUpScreen";

export const metadata: Metadata = { title: "Recharger mon portefeuille" };

export default function Page() {
  return <TopUpScreen />;
}
