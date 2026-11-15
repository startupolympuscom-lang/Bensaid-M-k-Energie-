import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ButtonLink } from "@/components/ui/Button";
import { SectionEyebrow } from "@/components/ui/SectionEyebrow";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: true },
};

/** Global 404 (rendered by the root layout, so it brings its own header/footer). */
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">
        <section
          aria-labelledby="notfound-title"
          className="pt-16 pb-28 sm:pt-24 lg:pt-32 lg:pb-40"
        >
          <div className="container-page">
            <SectionEyebrow>Erreur 404</SectionEyebrow>
            <h1 id="notfound-title" className="type-h1 mt-7 max-w-[16ch]">
              Cette page est introuvable.
            </h1>
            <p className="type-lead mt-6 max-w-[30rem]">
              Le lien que vous avez suivi est peut-être incorrect ou la page a été déplacée.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/" arrow>
                Retour à l’accueil
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary">
                Nous contacter
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
