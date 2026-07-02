"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, opts?: { variant?: ProductVariant; quantity?: number }) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
}

const lineId = (productId: string, variantId?: string) =>
  variantId ? `${productId}::${variantId}` : productId;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      add: (product, opts) =>
        set((state) => {
          const variant = opts?.variant;
          const quantity = opts?.quantity ?? 1;
          const id = lineId(product.id, variant?.id);
          const existing = state.items.find((i) => i.id === id);

          if (existing) {
            return {
              isOpen: true,
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }

          const item: CartItem = {
            id,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            category: product.category,
            image: product.images[0],
            price: variant?.price ?? product.price,
            variantId: variant?.id,
            variantLabel: variant?.label,
            quantity,
          };
          return { isOpen: true, items: [...state.items, item] };
        }),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      setQuantity: (id, quantity) =>
        set((s) => ({
          items:
            quantity <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clear: () => set({ items: [] }),
    }),
    { name: "luvora-cart" },
  ),
);

/** Derived selectors (call with the store hook). */
export const selectCount = (s: CartState) =>
  s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
