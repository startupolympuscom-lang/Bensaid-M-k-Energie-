import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Bensaid Mek Énergie corporate pages: shared header and footer. */
export default function BensaidLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
