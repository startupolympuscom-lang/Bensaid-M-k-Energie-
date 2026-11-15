import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/profile/OnboardingFlow";

export const metadata: Metadata = { title: "Bienvenue" };

export default function Page() {
  return <OnboardingFlow />;
}
