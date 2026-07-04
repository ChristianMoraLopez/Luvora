import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { formatCOP, formatDate } from "@/lib/format";
import { orderStatusLabel, orderStatusStyle } from "@/data/orders";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mis pedidos" };
export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta");

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, placed_at, subtotal, shipping_cost, total, order_items(product_name, variant_name, quantity, unit_price, line_total)",
    )
    .eq("user_id", user.id)
    .order("placed_at", { ascending: false });

  const list = (orders ?? []) as any[];

  return (
    <Container className="py-[clamp(32px,5vw,64px)]">
      <nav className="mb-8 text-[11px] uppercase tracking-nav text-mauve">
        <Link href="/cuenta" className="hover:text-burgundy">Cuenta</Link> /{" "}
        <span className="text-burgundy">Pedidos</span>
      </nav>
      <h1 className="mb-10 font-display text-[clamp(30px,4vw,48px)]">Mis pedidos</h1>

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="font-display text-2xl">Aún no tienes pedidos</p>
          <p className="max-w-[34ch] text-[14px] font-light text-ink/70">
            Cuando hagas tu primera compra, aquí podrás seguir su estado.
          </p>
          <Button href="/tienda" variant="solid" size="md" className="mt-1">
            Explorar tienda
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {list.map((order) => {
            const status = (order.status as OrderStatus) ?? "pendiente";
            return (
              <article key={order.id} className="rounded-card border border-border bg-white/50 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="font-display text-xl">{order.order_number}</p>
                    <p className="text-[12px] text-ink/60">{formatDate(order.placed_at)}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
                      orderStatusStyle[status] ?? "bg-blush-soft text-burgundy",
                    )}
                  >
                    {orderStatusLabel[status] ?? status}
                  </span>
                </div>

                <ul className="flex flex-col gap-2 py-4 text-[14px]">
                  {(order.order_items ?? []).map((line: any, i: number) => (
                    <li key={i} className="flex justify-between gap-4">
                      <span className="text-ink/80">
                        {line.quantity} × {line.product_name}
                        {line.variant_name && <span className="text-ink/50"> · {line.variant_name}</span>}
                      </span>
                      <span className="font-medium">{formatCOP(line.line_total)}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-[13px] uppercase tracking-nav text-ink/70">Total</span>
                  <span className="font-display text-xl text-burgundy">{formatCOP(order.total)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Container>
  );
}
