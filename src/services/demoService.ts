import { delay, demoStore } from "@/services/storage";

/** "Réinitialiser les données de démonstration": wipes all local demo data. */
export async function resetDemoData() {
  await delay(300);
  demoStore.reset();
}
