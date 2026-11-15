/** Routes of the Dispagaz customer web app. */
const base = "/dispagaz/app";

export const appRoutes = {
  home: base,
  login: `${base}/connexion`,
  signup: `${base}/inscription`,
  onboarding: `${base}/bienvenue`,
  order: `${base}/commander`,
  orders: `${base}/commandes`,
  orderDetail: (id: string) => `${base}/commandes/${id}`,
  wallet: `${base}/portefeuille`,
  topUp: `${base}/portefeuille/recharger`,
  points: `${base}/points`,
  addresses: `${base}/adresses`,
  profile: `${base}/profil`,
  notifications: `${base}/notifications`,
} as const;
