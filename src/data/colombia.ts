/** Colombian departments (departamentos) for checkout address selects. */
export const departamentos = [
  "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas",
  "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca",
  "Bogotá D.C.", "Guainía", "Guaviare", "Huila", "La Guajira", "Magdalena",
  "Meta", "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
  "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca",
  "Vaupés", "Vichada",
] as const;

/** Flat-rate shipping in COP (free over threshold). Replace with real rules. */
export const SHIPPING_FLAT = 12000;
export const FREE_SHIPPING_THRESHOLD = 200000;

export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}
