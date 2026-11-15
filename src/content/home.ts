import { company } from "@/config/company";

export const hero = {
  eyebrow: "Énergie & solutions durables",
  titleLines: ["Gaz, énergie et", "solutions durables."],
  description:
    "Distribution de GPL, gaz industriels et solutions énergétiques pour les particuliers, les professionnels et les industries.",
  primaryCta: { label: "Nos activités", href: "/#activites" },
  secondaryCta: { label: "Nous contacter", href: "/contact" },
  productCta: { label: "Visiter Dispagaz", href: "/dispagaz" },
};

export const activitiesSection = {
  id: "activites",
  eyebrow: "Nos activités",
  title: "Une offre énergétique complète et intégrée.",
};

export const engagementSection = {
  id: "engagement",
  eyebrow: "Notre engagement",
  title: "Une énergie fiable, sûre et responsable.",
  description:
    "Nous accompagnons nos clients avec des solutions performantes et durables, de la distribution de gaz à la transition énergétique.",
  image: {
    alt: "Sphères de stockage de gaz au lever du soleil, marquées de l’emblème Bensaid Mek Énergie",
  },
};

export const sectorsSection = {
  id: "secteurs",
  eyebrow: "Nos secteurs",
  title: "Des solutions pour tous les besoins.",
  image: {
    alt: "Rangées de panneaux solaires photovoltaïques face au soleil couchant",
  },
};

export const aboutSection = {
  id: "a-propos",
  eyebrow: "À propos",
  title: company.name,
  paragraphs: [
    `${company.name} est une entreprise marocaine multiservice de l’énergie, basée à ${company.address.city}. Elle réunit quatre métiers complémentaires : la distribution de GPL, la fourniture de gaz industriels, les solutions solaires et les services énergétiques.`,
    "Un interlocuteur unique pour accompagner particuliers, professionnels et industriels, du quotidien jusqu’à la transition énergétique.",
  ],
  link: { label: "En savoir plus", href: "/a-propos" },
};

export const ctaSection = {
  title: "Un projet ou un besoin énergétique ?",
  description: "Notre équipe vous accompagne dans la mise en place de la solution adaptée.",
  cta: { label: "Demander un devis", href: "/contact#devis" },
};
