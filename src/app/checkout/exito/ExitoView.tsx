"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/brand/Icons";
import { useCartStore } from "@/store/cart";
import { formatCOP } from "@/lib/format";

export function ExitoView({
  orderNumber,
  total,
  paid,
}: {
  orderNumber: string;
  total: number;
  paid: boolean;
}) {
  const clear = useCartStore((s) => s.clear);

  // Only empty the cart once the payment is actually confirmed.
  useEffect(() => {
    if (paid) clear();
  }, [paid, clear]);

  if (!paid) {
    return (
      <Container className="flex flex-col items-center gap-5 py-28 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-champagne font-display text-3xl text-burgundy">
          …
        </span>
        <h1 className="font-display text-[clamp(30px,4vw,48px)]">Estamos confirmando tu pago</h1>
        <p className="max-w-[42ch] text-[15px] font-light leading-relaxed text-ink/70">
          Recibimos tu pedido <span className="font-semibold text-ink">{orderNumber}</span>. En
          cuanto Mercado Pago confirme el pago te enviaremos la confirmación por correo.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <Button href="/cuenta/pedidos" variant="solid" size="md">
            Ver mis pedidos
          </Button>
          <Button href="/tienda" variant="outline" size="md">
            Seguir comprando
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col items-center gap-5 py-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-blush-soft text-burgundy">
        <CheckIcon size={34} />
      </span>
      <h1 className="font-display text-[clamp(30px,4vw,48px)]">¡Gracias por tu compra!</h1>
      <p className="max-w-[42ch] text-[15px] font-light leading-relaxed text-ink/70">
        Recibimos tu pago. Te enviaremos la confirmación y el seguimiento por correo. Tu pedido
        viaja en empaque 100% neutro, sin logotipos ni referencias al contenido.
      </p>
      <p className="text-[13px] text-mauve">
        Pedido <span className="font-semibold text-ink">{orderNumber}</span> · Total{" "}
        <span className="font-semibold text-ink">{formatCOP(total)}</span>
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <Button href="/cuenta/pedidos" variant="solid" size="md">
          Ver mis pedidos
        </Button>
        <Button href="/tienda" variant="outline" size="md">
          Seguir comprando
        </Button>
      </div>
    </Container>
  );
}
