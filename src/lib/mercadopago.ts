import "server-only";

/**
 * Mercado Pago credentials selector.
 * `MERCADOPAGO_MODE` ("test" | "prod") chooses which key set is active, so you
 * can flip between the sandbox and live environment with a single env var.
 */
export type MpMode = "test" | "prod";

export function getMercadoPagoConfig() {
  const mode: MpMode = (process.env.MERCADOPAGO_MODE ?? "test").toLowerCase() === "prod" ? "prod" : "test";
  const isProd = mode === "prod";

  const accessToken = isProd ? process.env.MP_ACCESS_TOKEN_PROD : process.env.MP_ACCESS_TOKEN_TEST;
  const publicKey = isProd ? process.env.MP_PUBLIC_KEY_PROD : process.env.MP_PUBLIC_KEY_TEST;

  return {
    mode,
    isProd,
    accessToken: accessToken?.trim() || null,
    publicKey: publicKey?.trim() || null,
    configured: Boolean(accessToken?.trim()),
  };
}
