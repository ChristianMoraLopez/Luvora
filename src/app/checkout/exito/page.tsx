import { Suspense } from "react";
import type { Metadata } from "next";
import { ExitoView } from "./ExitoView";

export const metadata: Metadata = { title: "Compra confirmada", robots: { index: false } };

export default function CheckoutExitoPage() {
  return (
    <Suspense fallback={null}>
      <ExitoView />
    </Suspense>
  );
}
