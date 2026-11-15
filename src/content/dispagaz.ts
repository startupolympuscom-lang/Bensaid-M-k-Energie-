import { company } from "@/config/company";

/** Copy of the /dispagaz landing page (French). */

export const dispagazNavigation = [
  { label: "Solutions", href: "/dispagaz#solutions" },
  { label: "Fonctionnalités", href: "/dispagaz#fonctionnalites" },
  { label: "Distribution 24/7", href: "/dispagaz#distribution" },
];

export const dispagazHero = {
  badge: "Solution digitale pour les distributeurs de GPL",
  title: { lead: ["Digitalisez et pilotez", "votre distribution"], highlight: "de GPL" },
  description:
    "Un ERP complet pour gérer vos ventes, stocks, tournées, clients et consignations, en toute simplicité.",
  secondaryCta: { label: "Découvrir les solutions", href: "/dispagaz#solutions" },
  mockupCaption: "Aperçu de l’interface · données d’exemple",
};

export const dispagazSolutions = {
  id: "solutions",
  eyebrow: "Nos solutions",
  title: "Un écosystème complet et intégré",
  description: "Des outils modulaires pour piloter toute votre activité de distribution de GPL.",
  items: [
    {
      title: "ERP",
      description: "Gestion complète de votre activité.",
      href: "/dispagaz#fonctionnalites",
      featured: true,
      note: "",
    },
    {
      title: "Application mobile",
      description: "Commandez votre GPL en livraison ou en point Dispagaz.",
      href: "/dispagaz/app",
      featured: false,
      note: "Bientôt sur l’App Store et Google Play",
    },
    {
      title: "Distribution automatique",
      description: "Distribution de bouteilles 24h/24, 7j/7.",
      href: "/dispagaz#distribution",
      featured: false,
      note: "",
    },
  ],
};

export const dispagazFeatures = {
  id: "fonctionnalites",
  eyebrow: "Fonctionnalités",
  title: "Toute votre distribution dans un seul outil.",
  description:
    "Du dépôt jusqu’au client final, Dispagaz réunit les opérations quotidiennes d’un distributeur de GPL.",
  items: [
    { title: "Ventes", description: "Enregistrez vos ventes et suivez votre chiffre d’affaires." },
    { title: "Stock", description: "Gardez une vue claire sur vos bouteilles pleines et vides." },
    { title: "Tournées", description: "Organisez et suivez les tournées de livraison." },
    { title: "Clients", description: "Centralisez votre portefeuille clients et son historique." },
    { title: "Consignations", description: "Gérez les consignations de bouteilles simplement." },
    {
      title: "Application mobile",
      description:
        "Vos clients commandent leur GPL et suivent leur livraison depuis l’application.",
    },
  ],
};

export const dispagazDistribution = {
  id: "distribution",
  eyebrow: "Distribution automatique",
  title: "Vos bouteilles de gaz, disponibles 24h/24.",
  description:
    "Le distributeur automatique Dispagaz permet à vos clients de se procurer une bouteille de GPL à tout moment, en toute autonomie.",
  steps: [
    { title: "Payez", description: "Le paiement se fait directement sur la borne." },
    {
      title: "Récupérez votre bouteille",
      description: "Le casier s’ouvre : la bouteille est prête.",
    },
    { title: "24h/24, 7j/7", description: "Un point de vente disponible jour et nuit." },
  ],
  image: {
    alt: `Distributeur automatique de bouteilles de GPL Dispagaz et ${company.name}, avec borne de paiement et casiers numérotés`,
  },
};

export const dispagazCta = {
  title: "Prêt à transformer votre distribution ?",
  description:
    "Simplifiez vos opérations, gagnez en efficacité et développez votre réseau avec Dispagaz.",
};
