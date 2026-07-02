import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { formatCOP, formatDate } from "@/lib/format";
import { mockOrders, orderStatusLabel, orderStatusStyle } from "@/data/orders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis pedidos" };

export default function PedidosPage() {
  return (
    <Container className="py-[clamp(32px,5vw,64px)]">
      <nav className="mb-8 text-[11px] uppercase tracking-nav text-mauve">
        <Link href="/cuenta" className="hover:text-burgundy">Cuenta</Link> /{" "}
        <span className="text-burgundy">Pedidos</span>
      </nav>
      <h1 className="mb-10 font-display text-[clamp(30px,4vw,48px)]">Mis pedidos</h1>

      <div className="flex flex-col gap-5">
        {mockOrders.map((order) => (
          <article key={order.id} className="rounded-card border border-border bg-white/50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="font-display text-xl">{order.number}</p>
                <p className="text-[12px] text-ink/60">{formatDate(order.createdAt)}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                  orderStatusStyle[order.status],
                )}
              >
                {orderStatusLabel[order.status]}
              </span>
            </div>

            <ul className="flex flex-col gap-2 py-4 text-[14px]">
              {order.lines.map((line) => (
                <li key={line.productId} className="flex justify-between gap-4">
                  <span className="text-ink/80">
                    {line.quantity} × {line.name}
                    {line.variantLabel && <span className="text-ink/50"> · {line.variantLabel}</span>}
                  </span>
                  <span className="font-medium">{formatCOP(line.unitPrice * line.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-[13px] uppercase tracking-nav text-ink/70">Total</span>
              <span className="font-display text-xl text-burgundy">{formatCOP(order.total)}</span>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}
