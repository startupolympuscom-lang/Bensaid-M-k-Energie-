import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/AuthScreen";

export const metadata: Metadata = { title: "Créer un compte" };

export default function Page() {
  return <AuthScreen mode="signup" />;
}
