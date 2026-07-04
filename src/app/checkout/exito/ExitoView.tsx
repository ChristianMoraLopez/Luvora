"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/brand/Icons";
import { useCartStore } from "@/store/cart";

export function ExitoView() {
  const params = useSearchParams();
  const clear = useCartStore((s) => s.clear);

  // Payment approved → empty the cart.
  useEffect(() => {
    clear();
  }, [clear]);

  const orderNumber = params.get("order") ?? undefined;
  const reference =
    orderNumber ??
    params.get("payment_id") ??
    params.get("external_reference") ??
    params.get("merchant_order_id") ??
    undefined;

  return (
    <Container className="flex flex-col items-center gap-5 py-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-blush-soft text-burgundy">
        <CheckIcon size={34} />
      </span>
      <h1 className="font-display text-[clamp(30px,4vw,48px)]">¡Gracias por tu compra!</h1>
      <p className="max-w-[42ch] text-[15px] font-light leading-relaxed text-ink/70">
        Recibimos tu pago. Te enviaremos la confirmación y el seguimiento por correo.
        Tu pedido viaja en empaque 100% neutro, sin logotipos ni referencias al contenido.
      </p>
      {reference && (
        <p className="text-[13px] text-mauve">
          {orderNumber ? "Número de pedido" : "Referencia de pago"}:{" "}
          <span className="font-semibold text-ink">{reference}</span>
        </p>
      )}
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
