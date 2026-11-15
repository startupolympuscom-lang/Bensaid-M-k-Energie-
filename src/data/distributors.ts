import type { Distributor } from "@/types/dispagaz";

/**
 * Demo Points Dispagaz (automatic LPG distributors) around Meknès.
 *
 * ⚠️ Demonstration data: locations, distances and stock are illustrative.
 * distributorService will later read these from the real API / geolocation.
 */
export const distributors: Distributor[] = [
  {
    id: "dz-hamria",
    name: "Dispagaz Hamria",
    address: "Avenue des FAR, Hamria",
    city: "Meknès",
    latitude: 33.8962,
    longitude: -5.5473,
    distanceKm: 1.2,
    openingHours: "24h/24",
    is24_7: true,
    status: "open",
    inventory: { "atlas-butane-6": 8, "atlas-butane-12": 5, "oasis-butane-12": 3 },
  },
  {
    id: "dz-zitoune",
    name: "Dispagaz Zitoune",
    address: "Boulevard Zitoune",
    city: "Meknès",
    latitude: 33.8722,
    longitude: -5.5652,
    distanceKm: 2.8,
    openingHours: "24h/24",
    is24_7: true,
    status: "open",
    inventory: { "atlas-butane-3": 10, "atlas-butane-6": 4, "medina-butane-12": 6 },
  },
  {
    id: "dz-bassatine",
    name: "Dispagaz Bassatine",
    address: "Avenue Bassatine",
    city: "Meknès",
    latitude: 33.9131,
    longitude: -5.5318,
    distanceKm: 3.5,
    openingHours: "24h/24",
    is24_7: true,
    status: "open",
    inventory: { "oasis-butane-6": 7, "oasis-butane-12": 0, "atlas-propane-13": 2 },
  },
  {
    id: "dz-wislane",
    name: "Dispagaz Wislane",
    address: "Route de Wislane",
    city: "Meknès",
    latitude: 33.8641,
    longitude: -5.5089,
    distanceKm: 6.3,
    openingHours: "06:00 – 23:00",
    is24_7: false,
    status: "open",
    inventory: { "atlas-butane-12": 9, "atlas-butane-6": 3 },
  },
  {
    id: "dz-sidi-bouzekri",
    name: "Dispagaz Sidi Bouzekri",
    address: "Rue principale, Sidi Bouzekri",
    city: "Meknès",
    latitude: 33.8857,
    longitude: -5.5891,
    distanceKm: 4.1,
    openingHours: "24h/24",
    is24_7: true,
    status: "maintenance",
    inventory: { "atlas-butane-12": 4 },
  },
];
