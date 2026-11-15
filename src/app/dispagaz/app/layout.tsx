import type { Metadata } from "next";
import { ToastProvider } from "@/components/app/Toast";

export const metadata: Metadata = {
  title: { default: "Dispagaz", template: "%s · Dispagaz" },
  description: "Commandez votre GPL simplement, où que vous soyez.",
  // Demo application: kept out of search engines.
  robots: { index: false, follow: false },
};

/** Dispagaz customer web app (demo). */
export default function DispagazAppLayout({ children }: LayoutProps<"/dispagaz/app">) {
  return <ToastProvider>{children}</ToastProvider>;
}
