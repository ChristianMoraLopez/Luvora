/** Colombian departments (departamentos) for checkout address selects. */
export const departamentos = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas",
  "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca",
  "Bogotá D.C.", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca",
  "Vaupés", "Vichada",
] as const;

/* ────────────────────────────────────────────────────────────
   Shipping rates (COP) — zone based.

   Local courier (Medellín & metro): direct delivery.
   Regional (Antioquia via carrier) and National (rest of Colombia).
   Ranges in the guide are collapsed to a single deterministic price at
   checkout (upper end, to avoid undercharging); the full ranges are shown
   to the customer for transparency (see `shippingRates`).
──────────────────────────────────────────────────────────── */

export const NATIONAL_SHIPPING = 18000;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // strip accents: í→i, ñ→n, etc.
    .replace(/\s+/g, " ")
    .trim();

// Antioquia metropolitan municipalities → COP 12.000
const METRO_12000 = ["bello", "envigado", "itagui", "san cristobal"];
// COP 13.000
const ZONE_13000 = ["sabaneta", "san antonio de prado"];
// Nearby Antioquia towns → COP 10.000 (guide: 8.5k–10k by package size)
const NEARBY_10000 = ["caldas", "copacabana", "girardota", "rionegro", "san jeronimo"];

export interface ShippingQuote {
  cost: number;
  /** Human label for the summary, e.g. "Medellín", "Envío nacional". */
  zone: string;
}

/**
 * Resolve the shipping cost from department + city.
 * Returns `null` when there's not enough info yet (Antioquia without a city),
 * so the UI can show "se calcula con tu ciudad".
 */
export function shippingQuote(department?: string, city?: string): ShippingQuote | null {
  if (!department) return null;
  const dep = norm(department);
  const c = norm(city ?? "");
  const isAntioquia = dep.includes("antioquia");

  if (!isAntioquia) return { cost: NATIONAL_SHIPPING, zone: "Envío nacional" };

  if (!c) return null; // Antioquia needs the city to pick the tier
  if (c.includes("medellin")) return { cost: 11000, zone: "Medellín" };
  if (METRO_12000.some((x) => c.includes(x))) return { cost: 12000, zone: "Área metropolitana" };
  if (ZONE_13000.some((x) => c.includes(x))) return { cost: 13000, zone: "Sabaneta / San Antonio de Prado" };
  if (NEARBY_10000.some((x) => c.includes(x))) return { cost: 10000, zone: "Antioquia (municipio cercano)" };
  return { cost: 15000, zone: "Antioquia (otros municipios)" };
}

/** Server-safe cost: never null — defaults to the national flat rate. */
export function shippingCostFor(department?: string, city?: string): number {
  return shippingQuote(department, city)?.cost ?? NATIONAL_SHIPPING;
}

/** Rate table shown to the customer (with the guide's ranges). */
export const shippingRates: { zone: string; price: string }[] = [
  { zone: "Medellín", price: "$11.000 – $12.000" },
  { zone: "Bello, Envigado, Itagüí, San Cristóbal", price: "$12.000" },
  { zone: "Sabaneta, San Antonio de Prado", price: "$13.000" },
  { zone: "Antioquia (municipios cercanos)", price: "$8.500 – $10.000" },
  { zone: "Antioquia (otros municipios)", price: "$13.000 – $15.000" },
  { zone: "Resto de Colombia", price: "$18.000" },
];
