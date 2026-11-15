import type { Metadata } from "next";
import { AddressesScreen } from "@/features/profile/AddressesScreen";

export const metadata: Metadata = { title: "Mes adresses" };

export default function Page() {
  return <AddressesScreen />;
}
