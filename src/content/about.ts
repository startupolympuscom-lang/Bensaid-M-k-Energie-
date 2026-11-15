import { company } from "@/config/company";

export const aboutPage = {
  metaTitle: "À propos",
  metaDescription: `${company.name}, entreprise marocaine multiservice de l’énergie basée à ${company.address.city} : distribution de GPL, gaz industriels, solutions solaires et services énergétiques.`,
  eyebrow: "À propos",
  title: company.name,
  intro: [
    `${company.name} est une entreprise marocaine multiservice de l’énergie, basée à ${company.address.city}. Elle accompagne particuliers, professionnels et industriels à travers quatre métiers complémentaires.`,
    "De la distribution de butane et de propane à la fourniture de gaz techniques, de l’installation de systèmes solaires au conseil énergétique, nous réunissons sous une même enseigne les solutions dont nos clients ont besoin au quotidien et pour préparer leur transition énergétique.",
  ],
  image: {
    alt: "Sphères de stockage de gaz au lever du soleil, marquées de l’emblème Bensaid Mek Énergie",
  },
  activities: {
    id: "metiers",
    eyebrow: "Nos métiers",
    title: "Quatre expertises, un seul interlocuteur.",
  },
  values: {
    eyebrow: "Nos valeurs",
    title: "Ce qui guide notre action.",
    items: [
      {
        title: "Énergie",
        description:
          "Un approvisionnement fiable pour accompagner l’activité de nos clients, jour après jour.",
      },
      {
        title: "Innovation",
        description:
          "Des solutions actuelles, des gaz techniques au solaire photovoltaïque et thermique.",
      },
      {
        title: "Durabilité",
        description: "Des choix énergétiques plus responsables, pour une transition maîtrisée.",
      },
      {
        title: "Confiance",
        description: "Une relation de proximité, fondée sur la sécurité, la clarté et l’écoute.",
      },
    ],
  },
};
