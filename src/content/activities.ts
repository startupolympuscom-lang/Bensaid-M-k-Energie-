export type ActivityId = "gpl" | "gaz-industriels" | "solaire" | "services";

export type Activity = {
  id: ActivityId;
  title: string;
  description: string;
  accent: "orange" | "teal";
};

/** The four business lines — shared by the homepage, About page and quote form. */
export const activities: Activity[] = [
  {
    id: "gpl",
    title: "GPL",
    description: "Butane et propane pour les particuliers et les professionnels.",
    accent: "orange",
  },
  {
    id: "gaz-industriels",
    title: "Gaz industriels",
    description: "Oxygène, CO₂, azote, argon et autres gaz techniques.",
    accent: "teal",
  },
  {
    id: "solaire",
    title: "Solutions solaires",
    description: "Fourniture et installation de systèmes photovoltaïques et thermiques.",
    accent: "orange",
  },
  {
    id: "services",
    title: "Services & consulting",
    description: "Conseil et accompagnement en solutions énergétiques.",
    accent: "teal",
  },
];

export const sectors: string[] = [
  "Particuliers",
  "Commerces",
  "Hôtellerie & restauration",
  "Industrie",
  "Collectivités",
];
