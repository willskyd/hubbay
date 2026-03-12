"use client";

import { OrderType } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  dishId: string;
  name: string;
  priceKobo: number;
  imageUrl: string;
  quantity: number;
  specialInstructions?: string;
};

type CartState = {
  items: CartItem[];
  orderType: OrderType;
  deliveryAddress: string;
  orderNote: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  updateInstructions: (dishId: string, specialInstructions: string) => void;
  setOrderType: (orderType: OrderType) => void;
  setDeliveryAddress: (address: string) => void;
  setOrderNote: (note: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      orderType: OrderType.PICKUP,
      deliveryAddress: "",
      orderNote: "",
      open: false,
      setOpen: (open) => set({ open }),
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.dishId === item.dishId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.dishId === item.dishId
                  ? {
                      ...i,
                      quantity: i.quantity + 1,
                    }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (dishId) =>
        set((state) => ({
          items: state.items.filter((i) => i.dishId !== dishId),
        })),
      updateQuantity: (dishId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.dishId !== dishId)
              : state.items.map((i) =>
                  i.dishId === dishId ? { ...i, quantity } : i,
                ),
        })),
      updateInstructions: (dishId, specialInstructions) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.dishId === dishId ? { ...i, specialInstructions } : i,
          ),
        })),
      setOrderType: (orderType) => set({ orderType }),
      setDeliveryAddress: (deliveryAddress) => set({ deliveryAddress }),
      setOrderNote: (orderNote) => set({ orderNote }),
      clearCart: () =>
        set({
          items: [],
          orderType: OrderType.PICKUP,
          deliveryAddress: "",
          orderNote: "",
          open: false,
        }),
    }),
    {
      name: "hubbay-cart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        orderType: state.orderType,
        deliveryAddress: state.deliveryAddress,
        orderNote: state.orderNote,
      }),
    },
  ),
);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((acc, item) => acc + item.priceKobo * item.quantity, 0);
