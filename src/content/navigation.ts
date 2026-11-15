export type NavItem = {
  label: string;
  href: string;
  /** Pathname for which this item is considered the current page. */
  match?: string;
};

export const mainNavigation: NavItem[] = [
  { label: "Accueil", href: "/", match: "/" },
  { label: "Nos activités", href: "/#activites" },
  { label: "À propos", href: "/a-propos", match: "/a-propos" },
  { label: "Contact", href: "/contact", match: "/contact" },
];

export const quoteCta = {
  label: "Demander un devis",
  href: "/contact#devis",
};
