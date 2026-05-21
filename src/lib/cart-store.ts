"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine, Currency } from "./types";

interface CartState {
  lines: CartLine[];
  currency: Currency;
  hydrated: boolean;
  setHydrated: () => void;
  setCurrency: (c: Currency) => void;
  addLine: (line: CartLine) => void;
  removeLine: (productHandle: string, variantId: string) => void;
  setQuantity: (
    productHandle: string,
    variantId: string,
    quantity: number,
  ) => void;
  clear: () => void;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      currency: "USD",
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      setCurrency: (c) => set({ currency: c }),
      addLine: (line) =>
        set((s) => {
          const existing = s.lines.find(
            (l) =>
              l.productHandle === line.productHandle &&
              l.variantId === line.variantId,
          );
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l === existing
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l,
              ),
            };
          }
          return { lines: [...s.lines, line] };
        }),
      removeLine: (productHandle, variantId) =>
        set((s) => ({
          lines: s.lines.filter(
            (l) =>
              !(l.productHandle === productHandle && l.variantId === variantId),
          ),
        })),
      setQuantity: (productHandle, variantId, quantity) =>
        set((s) => ({
          lines: s.lines
            .map((l) =>
              l.productHandle === productHandle && l.variantId === variantId
                ? { ...l, quantity: Math.max(0, quantity) }
                : l,
            )
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
      count: () => get().lines.reduce((n, l) => n + l.quantity, 0),
    }),
    {
      name: "zenaura-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, currency: s.currency }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);
