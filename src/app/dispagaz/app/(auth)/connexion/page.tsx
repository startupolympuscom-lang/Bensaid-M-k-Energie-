import type { Metadata } from "next";
import { AuthScreen } from "@/features/auth/AuthScreen";

export const metadata: Metadata = { title: "Connexion" };

export default function Page() {
  return <AuthScreen mode="login" />;
}
