#!/usr/bin/env node
/**
 * Downloads Satoshi, the Dispagaz typeface, from the official Fontshare API
 * into src/assets/fonts/satoshi/ so next/font/local can self-host it
 * (preloaded, cached with the site, metric-matched fallback, no third-party
 * request at runtime).
 *
 * Satoshi is distributed under the ITF Free Font License: free for commercial
 * use and for self-hosting on a website, but the font files must not be
 * redistributed — for instance by committing them to this public repository.
 * They are therefore fetched at build time (npm "predev" / "prebuild") and
 * gitignored.
 *
 * Usage: node scripts/fetch-satoshi.mjs [--force]
 */
import { spawnSync } from "node:child_process";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";

const WEIGHTS = ["400", "500", "700", "900"];
const CSS_URL = `https://api.fontshare.com/v2/css?f[]=satoshi@${WEIGHTS.join(",")}&display=swap`;
const OUT_DIR = new URL("../src/assets/fonts/satoshi/", import.meta.url);
const fileFor = (weight) => new URL(`satoshi-${weight}.woff2`, OUT_DIR);
const force = process.argv.includes("--force");

const isWoff2 = (buf) => buf.length > 1024 && buf.subarray(0, 4).toString("latin1") === "wOF2";

async function present(weight) {
  try {
    return isWoff2(await readFile(fileFor(weight)));
  } catch {
    return false;
  }
}

if (!force && (await Promise.all(WEIGHTS.map(present))).every(Boolean)) {
  console.log("✓ Satoshi already downloaded");
  process.exit(0);
}

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY is set: re-run
// with it so the script also works behind a corporate / sandbox proxy.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(process.execPath, process.argv.slice(1), {
    stdio: "inherit",
    env: { ...process.env, NODE_USE_ENV_PROXY: "1" },
  });
  process.exit(child.status ?? 1);
}

async function download(url, as) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return as === "text" ? await res.text() : Buffer.from(await res.arrayBuffer());
    } catch (error) {
      lastError = error;
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  throw new Error(`${url}: ${lastError?.message ?? lastError}`);
}

try {
  const css = await download(CSS_URL, "text");
  // One @font-face block per weight; take its woff2 source.
  const sources = new Map();
  for (const block of css.split("@font-face").slice(1)) {
    const weight = block.match(/font-weight:\s*(\d+)/)?.[1];
    const woff2 = block.match(/url\(['"]?([^'")]+\.woff2)['"]?\)/)?.[1];
    if (weight && woff2) sources.set(weight, new URL(woff2, "https://cdn.fontshare.com").href);
  }

  await mkdir(OUT_DIR, { recursive: true });
  for (const weight of WEIGHTS) {
    const url = sources.get(weight);
    if (!url) throw new Error(`no woff2 source for weight ${weight} in the Fontshare CSS`);
    const font = await download(url, "buffer");
    if (!isWoff2(font)) throw new Error(`weight ${weight}: the download is not a woff2 file`);
    const target = fileFor(weight);
    const tmp = new URL(`${target.pathname}.tmp`, target);
    await writeFile(tmp, font);
    await rename(tmp, target);
  }
  console.log(`✓ Satoshi downloaded (${WEIGHTS.join(", ")})`);
} catch (error) {
  console.error(
    `✗ Could not download the Satoshi font from Fontshare.\n  ${error.message}\n` +
      "  The Dispagaz pages need it to build. Check the network access to\n" +
      "  api.fontshare.com and cdn.fontshare.com, then run: npm run fonts",
  );
  process.exit(1);
}
