import type { Metadata } from "next";
import { PointsScreen } from "@/features/distributors/PointsScreen";

export const metadata: Metadata = { title: "Points Dispagaz" };

export default function Page() {
  return <PointsScreen />;
}
