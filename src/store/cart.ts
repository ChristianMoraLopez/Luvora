"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

/** A resolved line to add — price already accounts for the chosen variant. */
export interface AddToCartInput {
  productId: string;
  slug: string;
  name: string;
  category: string;
  image?: string;
  price: number;
  variantId?: string;
  variantLabel?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (line: AddToCartInput, quantity?: number) => void;
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

      add: (line, quantity = 1) =>
        set((state) => {
          const id = lineId(line.productId, line.variantId);
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
            productId: line.productId,
            slug: line.slug,
            name: line.name,
            category: line.category,
            image: line.image,
            price: line.price,
            variantId: line.variantId,
            variantLabel: line.variantLabel,
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
