import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { formatCOP, formatNumber } from "@/lib/format";
import { products } from "@/data/products";
import { categoryName } from "@/data/categories";
import { mockOrders, orderStatusLabel, orderStatusStyle } from "@/data/orders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Panel de administración", robots: { index: false } };

/**
 * Admin dashboard (presentational). In production, protect this route:
 *  - middleware checks a Supabase session + `profiles.role = 'admin'`
 *  - all reads/writes go through RLS-guarded queries or service-role server actions.
 */
export default function AdminPage() {
  const revenue = mockOrders.reduce((s, o) => s + o.total, 0);
  const aov = revenue / Math.max(1, mockOrders.length);
  const lowStock = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5);

  const kpis = [
    { label: "Ingresos", value: formatCOP(revenue) },
    { label: "Pedidos", value: formatNumber(mockOrders.length) },
    { label: "Ticket promedio", value: formatCOP(Math.round(aov)) },
    { label: "Productos", value: formatNumber(products.length) },
  ];

  return (
    <Container className="py-[clamp(32px,5vw,64px)]">
      <div className="mb-10 flex flex-col gap-2">
        <span className="eyebrow text-burgundy">Administración</span>
        <h1 className="font-display text-[clamp(30px,4vw,48px)]">Panel</h1>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-card border border-border bg-white/60 p-6">
            <p className="eyebrow text-mauve">{k.label}</p>
            <p className="mt-3 font-display text-2xl text-ink">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent orders */}
        <section>
          <h2 className="mb-4 font-display text-2xl">Pedidos recientes</h2>
          <div className="overflow-x-auto rounded-card border border-border">
            <table className="w-full min-w-[520px] text-left text-[13px]">
              <thead className="bg-blush-soft/60 text-[11px] uppercase tracking-nav text-mauve">
                <tr>
                  <th className="px-4 py-3 font-semibold">Pedido</th>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-blush-soft/30">
                    <td className="px-4 py-3 font-medium">{o.number}</td>
                    <td className="px-4 py-3 text-ink/70">{o.address.fullName}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]", orderStatusStyle[o.status])}>
                        {orderStatusLabel[o.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-burgundy">{formatCOP(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Low stock */}
        <section>
          <h2 className="mb-4 font-display text-2xl">Inventario bajo</h2>
          <ul className="flex flex-col gap-2">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-card border border-border bg-white/60 px-4 py-3">
                <span>
                  <span className="block text-[14px] font-medium">{p.name}</span>
                  <span className="text-[12px] text-ink/55">{categoryName(p.category)}</span>
                </span>
                <span className={cn("text-[13px] font-semibold", p.stock < 20 ? "text-red-500" : "text-ink/70")}>
                  {p.stock} uds.
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Container>
  );
}
