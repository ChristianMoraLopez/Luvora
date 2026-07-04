// LUVORA · product image uploader → Supabase Storage (bucket: product-images)
//
// AUTO FIRST-PASS: for each of the 235 products in image_map.json, take the
// LARGEST candidate raster on its page, convert jpeg -> webp (resized/optimized), and upload
// it to the product's target_storage_path — which equals product_images.path,
// the key the storefront already reads. No code change needed; images appear
// automatically. Idempotent: re-running overwrites (upsert), so wrong picks can
// be corrected later by re-uploading a curated file to the same path.
//
// Usage:
//   node upload_images.mjs             # upload all 235
//   node upload_images.mjs --limit 5   # test run: first 5 only
//   node upload_images.mjs --dry-run   # convert + report sizes, no upload
//
// Requires ../.env.local (project root) with:
//   NEXT_PUBLIC_SUPABASE_URL="https://vptjcnasqwgvzhnnotix.supabase.co"
//   SUPABASE_SERVICE_ROLE_KEY="..."    # server-only; the bucket blocks anon writes

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CANDIDATES_DIR = path.join(ROOT, "catalog_images");
const MAP_PATH = path.join(ROOT, "image_map.json");
const BUCKET = "product-images";

// ── tiny .env.local parser (project root) ─────────────────────────────
function loadEnv() {
  const envPath = path.join(ROOT, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(`\n✗ Missing ${envPath}\n  Copy .env.example → .env.local and fill in the keys.\n`);
    process.exit(1);
  }
  const out = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY || /YOUR-|\.\.\.|<.*>/.test(SERVICE_KEY)) {
  console.error("\n✗ NEXT_PUBLIC_SUPABASE_URL and a real SUPABASE_SERVICE_ROLE_KEY must be set in .env.local\n");
  process.exit(1);
}

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const li = args.indexOf("--limit");
const LIMIT = li !== -1 ? parseInt(args[li + 1], 10) : Infinity;
const CONCURRENCY = 3;
const MAX_WIDTH = 1200;    // catalog rasters are large; 1200px covers cards + detail
const WEBP_QUALITY = 80;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const { items } = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
const work = items.slice(0, LIMIT);

let ok = 0, skipped = 0, failed = 0;
const failures = [];

async function processOne(item) {
  const candidates = item.candidate_raw_images || [];
  const dest = item.target_storage_path;
  if (!candidates.length) {
    skipped++; failures.push({ slug: item.product_slug, reason: "no candidate" }); return;
  }

  // Pick the LARGEST decodable candidate on the page (highest resolution →
  // sharp product cards; the first candidate is often a small thumbnail).
  // (Some catalog rasters are JPEG 2000 mislabeled .jpeg, which the prebuilt
  //  sharp binary can't read — those are skipped.)
  let best = null, lastErr = null; // best = { candidate, srcPath, area }
  for (const candidate of candidates) {
    const srcPath = path.join(CANDIDATES_DIR, candidate);
    if (!fs.existsSync(srcPath)) { lastErr = `missing file ${candidate}`; continue; }
    try {
      const m = await sharp(srcPath).metadata();
      const area = (m.width || 0) * (m.height || 0);
      if (!best || area > best.area) best = { candidate, srcPath, area };
    } catch (e) { lastErr = e.message || String(e); }
  }

  let webp = null, used = null;
  if (best) {
    try {
      webp = await sharp(best.srcPath)
        .rotate()                                        // respect EXIF orientation
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      used = best.candidate;
    } catch (e) { lastErr = e.message || String(e); }
  }

  if (!webp) {
    failed++; failures.push({ slug: item.product_slug, reason: lastErr || "no decodable candidate" }); return;
  }

  try {
    if (DRY_RUN) {
      ok++; console.log(`  [dry] ${dest}  (${(webp.length / 1024).toFixed(0)} KB) ← ${used}`); return;
    }
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(dest, webp, { contentType: "image/webp", upsert: true });
    if (error) throw error;
    ok++;
    if (ok % 25 === 0) console.log(`  … ${ok} uploaded`);
  } catch (e) {
    failed++; failures.push({ slug: item.product_slug, reason: e.message || String(e) });
  }
}

async function run() {
  console.log(`\n${DRY_RUN ? "DRY RUN — " : ""}Processing ${work.length} products → bucket "${BUCKET}"\n`);
  const queue = [...work];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) await processOne(queue.shift());
  }));

  console.log(`\n── Done ──\n  uploaded: ${ok}\n  skipped:  ${skipped}\n  failed:   ${failed}`);
  if (failures.length) {
    console.log(`\nIssues:`);
    for (const f of failures.slice(0, 30)) console.log(`  • ${f.slug}: ${f.reason}`);
    if (failures.length > 30) console.log(`  … +${failures.length - 30} more`);
  }
}

process.on("unhandledRejection", (e) => { console.error("UNHANDLED", e); process.exit(1); });
run()
  .then(() => process.exit(failed > 0 ? 1 : 0))
  .catch((e) => { console.error("FATAL", e); process.exit(1); });
