import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Pago pendiente", robots: { index: false } };

export default function CheckoutPendientePage() {
  return (
    <Container className="flex flex-col items-center gap-5 py-28 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-champagne text-burgundy font-display text-3xl">
        …
      </span>
      <h1 className="font-display text-[clamp(30px,4vw,48px)]">Tu pago está en proceso</h1>
      <p className="max-w-[42ch] text-[15px] font-light leading-relaxed text-ink/70">
        Estamos confirmando tu pago con Mercado Pago. En cuanto se acredite, te enviaremos
        la confirmación por correo. Puedes cerrar esta página con tranquilidad.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <Button href="/cuenta/pedidos" variant="solid" size="md">
          Ver mis pedidos
        </Button>
        <Button href="/" variant="outline" size="md">
          Volver al inicio
        </Button>
      </div>
    </Container>
  );
}
