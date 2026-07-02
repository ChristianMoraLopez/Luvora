import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-32 text-center">
      <BrandMark size={56} />
      <p className="font-display text-[clamp(48px,8vw,90px)] leading-none text-burgundy">404</p>
      <h1 className="font-display text-2xl">No encontramos esta página</h1>
      <p className="max-w-[38ch] text-[14px] font-light text-ink/70">
        Es posible que el enlace haya cambiado o que la página ya no exista.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button href="/" variant="solid" size="md">Volver al inicio</Button>
        <Button href="/tienda" variant="outline" size="md">Ir a la tienda</Button>
      </div>
    </Container>
  );
}
