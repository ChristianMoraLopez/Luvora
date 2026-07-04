# LUVORA — Supabase Edge Functions

Payment backend as Supabase Edge Functions (Deno). They run **inside Supabase**,
hold secrets there, and use the auto-injected `SUPABASE_SERVICE_ROLE_KEY`.

| Function | Public? | Purpose |
|---|---|---|
| `mp-webhook` | yes (`verify_jwt=false`) | Mercado Pago notifications → verifies the payment via MP's API (+ optional `x-signature`) and marks the order `pagado`. **Deployed & live.** |
| `create-checkout` | requires anon/user JWT | Recomputes prices/shipping, records the `pendiente` order, creates the MP preference. **Source ready; deploy when activating.** |

URLs:
- `https://vptjcnasqwgvzhnnotix.supabase.co/functions/v1/mp-webhook`
- `https://vptjcnasqwgvzhnnotix.supabase.co/functions/v1/create-checkout`

## Required secrets (set once — I can't set these via API)
Dashboard → **Project Settings → Edge Functions → Secrets** (or CLI
`supabase secrets set KEY=value`):

```
MP_ACCESS_TOKEN    = APP_USR-...        # Mercado Pago access token (required)
MP_WEBHOOK_SECRET  = ...                # optional; enables x-signature validation
SITE_URL           = https://www.luvoraoficial.com   # optional (create-checkout back_urls)
```
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.

## Activation (to move the live flow into Supabase)
1. Set `MP_ACCESS_TOKEN` (above).
2. `mp-webhook` then marks orders paid. To route the checkout through Supabase too,
   deploy `create-checkout` and point the storefront at
   `supabase.functions.invoke("create-checkout", { body: { items, form } })`.

Until then, the **Next.js routes** (`/api/checkout`, `/api/webhooks/mercadopago`)
handle payments with the Vercel env vars — already working and secure (secrets stay
server-side; the webhook validates against MP's API).

## Redeploy
Via the CLI: `supabase functions deploy mp-webhook` (from repo root, linked project).
