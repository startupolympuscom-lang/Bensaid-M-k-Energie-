import type { Viewport } from "next";
import { DispagazFooter } from "@/components/dispagaz/DispagazFooter";
import { DispagazHeader } from "@/components/dispagaz/DispagazHeader";

export const viewport: Viewport = {
  themeColor: "#101214",
};

/** Dispagaz® product pages: dark product header and footer. */
export default function DispagazLayout({ children }: LayoutProps<"/dispagaz">) {
  return (
    <>
      <DispagazHeader />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <DispagazFooter />
    </>
  );
}
