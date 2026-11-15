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
    "Dispagaz, la solution digitale de Bensaid Mek Énergie pour les distributeurs de GPL : ERP, application mobile pour les équipes terrain et distribution automatique de bouteilles 24h/24.",

  /** Where every "Demander une démo" button leads (quote form, preset on Dispagaz). */
  demoHref: "/contact?besoin=dispagaz#devis",

  /** ⚠️ À COMPLÉTER — URL of the Dispagaz web app login. Shows "Se connecter". */
  appUrl: "",

  /** ⚠️ À COMPLÉTER — presentation video (e.g. YouTube). Shows "Voir la vidéo". */
  videoUrl: "",
} as const;
