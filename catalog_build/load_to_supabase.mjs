/**
 * LUVORA · one-shot Supabase loader
 * Runs schema.sql + seed.sql against your Supabase Postgres database.
 *
 * Usage:
 *   1) Get your connection string:
 *      Supabase Dashboard → project → Connect → "Session pooler" URI
 *      (looks like: postgresql://postgres.vptjcnasqwgvzhnnotix:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres)
 *   2) Run:
 *      node load_to_supabase.mjs "postgresql://postgres.xxxx:PASSWORD@aws-1-...pooler.supabase.com:5432/postgres"
 *      — or set DATABASE_URL in the environment / in a .env file next to this script.
 *
 * Idempotent: safe to re-run (schema uses IF NOT EXISTS, seed uses ON CONFLICT).
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const HERE = dirname(fileURLToPath(import.meta.url));

// ---- resolve connection string: argv > env > .env file ----
let url = process.argv[2] || process.env.DATABASE_URL;
if (!url && existsSync(join(HERE, ".env"))) {
  const env = readFileSync(join(HERE, ".env"), "utf8");
  const m = env.match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\r\n]+)/m);
  if (m) url = m[1];
}
if (!url) {
  console.error(
    "ERROR: no connection string.\n" +
    "Pass it as an argument or set DATABASE_URL (see header of this file).\n" +
    "Dashboard → Connect → Session pooler URI (port 5432)."
  );
  process.exit(1);
}
if (/\[?YOUR|PASSWORD\]/i.test(url)) {
  console.error("ERROR: replace [PASSWORD] in the connection string with your real database password.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
  statement_timeout: 0,
  query_timeout: 600000,
});

const run = async (label, sql) => {
  const t = Date.now();
  process.stdout.write(`→ ${label} ... `);
  await client.query(sql);
  console.log(`OK (${((Date.now() - t) / 1000).toFixed(1)}s)`);
};

try {
  await client.connect();
  console.log("Connected to Supabase Postgres.");

  await run("schema.sql (tables, indexes, FTS, RLS, RPC)", readFileSync(join(HERE, "schema.sql"), "utf8"));
  await run("seed.sql   (2 448 inserts)", readFileSync(join(HERE, "seed.sql"), "utf8"));

  const { rows } = await client.query(`
    select 'categories' t, count(*) n from public.categories
    union all select 'subcategories', count(*) from public.subcategories
    union all select 'tags',          count(*) from public.tags
    union all select 'products',      count(*) from public.products
    union all select 'variants',      count(*) from public.product_variants
    union all select 'images',        count(*) from public.product_images
    union all select 'product_tags',  count(*) from public.product_tags
    order by 1;
  `);
  console.log("\nRow counts:");
  for (const r of rows) console.log(`  ${r.t.padEnd(14)} ${r.n}`);

  const expect = { categories: 7, subcategories: 46, products: 235, variants: 299, images: 235 };
  const got = Object.fromEntries(rows.map(r => [r.t, Number(r.n)]));
  const bad = Object.entries(expect).filter(([k, v]) => got[k] !== v);
  console.log(bad.length ? `\n⚠ mismatch: ${JSON.stringify(bad)}` : "\n✓ All counts match. Catalog loaded.");
} catch (e) {
  console.error("\nFAILED:", e.message);
  if (/password authentication/i.test(e.message))
    console.error("→ Check the database password (Dashboard → Settings → Database → Reset password if lost).");
  if (/ENOTFOUND|ECONNREFUSED/i.test(e.message))
    console.error("→ Use the Session pooler URI (port 5432), not the direct db.<ref> host (IPv6-only).");
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
