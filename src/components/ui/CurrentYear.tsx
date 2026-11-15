import { cacheLife } from "next/cache";

/** Current year, cached (required with Cache Components: no `new Date()` in the static shell). */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
