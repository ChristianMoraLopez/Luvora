import type { Order } from "@/types";

/** Mock orders — stand-in for Supabase `orders` until auth + DB are wired. */
export const mockOrders: Order[] = [
  {
    id: "1",
    number: "LUV-2026-0428",
    status: "enviado",
    createdAt: "2026-06-24T15:20:00-05:00",
    lines: [
      { productId: "ondule", name: "Ondule", variantLabel: "Burdeos", quantity: 1, unitPrice: 289900 },
      { productId: "sensacion-seda", name: "Sensación Seda", quantity: 1, unitPrice: 59900 },
    ],
    subtotal: 349800,
    shipping: 12000,
    total: 361800,
    address: {
      fullName: "Valentina Ríos",
      phone: "+57 300 000 0000",
      department: "Antioquia",
      city: "Medellín",
      addressLine: "Cra. 43A #1-50",
    },
    paymentId: "mp_1234567890",
  },
  {
    id: "2",
    number: "LUV-2026-0391",
    status: "entregado",
    createdAt: "2026-05-30T10:05:00-05:00",
    lines: [
      { productId: "kit-descubrimiento", name: "Kit Descubrimiento", quantity: 1, unitPrice: 329900 },
    ],
    subtotal: 329900,
    shipping: 0,
    total: 329900,
    address: {
      fullName: "Valentina Ríos",
      phone: "+57 300 000 0000",
      department: "Antioquia",
      city: "Medellín",
      addressLine: "Cra. 43A #1-50",
    },
    paymentId: "mp_0987654321",
  },
];

export const orderStatusLabel: Record<Order["status"], string> = {
  pendiente: "Pendiente",
  pagado: "Pagado",
  preparando: "Preparando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const orderStatusStyle: Record<Order["status"], string> = {
  pendiente: "bg-champagne text-burgundy",
  pagado: "bg-blush-soft text-burgundy",
  preparando: "bg-blush text-burgundy",
  enviado: "bg-burgundy text-ivory",
  entregado: "bg-emerald-600/90 text-white",
  cancelado: "bg-ink/10 text-ink/60",
};
