/**
 * ============================================================================
 *  Dispagaz® — product configuration (a Bensaid Mek Énergie solution)
 * ============================================================================
 *  Links used by the /dispagaz landing page. Empty values ("") are treated as
 *  "not available": the corresponding button is simply not displayed.
 *  Company contact details (phones, address…) come from src/config/company.ts.
 * ============================================================================
 */
export const dispagaz = {
  name: "Dispagaz",

  tagline: "Solution digitale pour les distributeurs de GPL",

  description:
    "Dispagaz, la solution digitale de Bensaid Mek Énergie pour les distributeurs de GPL : ERP, application de commande pour les clients et distribution automatique de bouteilles 24h/24.",

  /** Where every "Demander une démo" button leads (quote form, preset on Dispagaz). */
  demoHref: "/contact?besoin=dispagaz#devis",

  /** Customer web app login (demo). Shows "Se connecter" in the Dispagaz header. */
  appUrl: "/dispagaz/app/connexion",

  /** ⚠️ À COMPLÉTER — presentation video (e.g. YouTube). Shows "Voir la vidéo". */
  videoUrl: "",
} as const;
