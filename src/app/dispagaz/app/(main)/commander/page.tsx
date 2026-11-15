import type { Metadata } from "next";
import { OrderFlow } from "@/features/orders/OrderFlow";

export const metadata: Metadata = { title: "Commander du GPL" };

export default function Page() {
  return <OrderFlow />;
}
