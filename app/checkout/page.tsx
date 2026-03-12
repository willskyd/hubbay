"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { formatNairaFromKobo } from "@/lib/utils";
import { selectCartSubtotal, useCartStore } from "@/store/cart-store";

export default function CheckoutPage() {
  const subtotal = useCartStore(selectCartSubtotal);
  const orderType = useCartStore((state) => state.orderType);
  const setOpen = useCartStore((state) => state.setOpen);
  const items = useCartStore((state) => state.items);
  const deliveryFee = useMemo(
    () => (orderType === "DELIVERY" && subtotal > 0 ? 2500 : 0),
    [orderType, subtotal],
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8">
      <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Checkout</p>
      <h1 className="mt-2 text-4xl font-black text-hubbay-text">Review & Place Order</h1>
      <div className="mt-8 space-y-3 rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
        {items.length === 0 ? (
          <p className="text-sm text-hubbay-secondary">Your cart is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.dishId} className="flex justify-between text-sm text-hubbay-secondary">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>{formatNairaFromKobo(item.priceKobo * item.quantity)}</span>
            </div>
          ))
        )}
        <div className="border-t border-hubbay-gold/20 pt-3">
          <div className="flex justify-between text-sm text-hubbay-secondary">
            <span>Subtotal</span>
            <span>{formatNairaFromKobo(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-hubbay-secondary">
            <span>Delivery Fee</span>
            <span>{formatNairaFromKobo(deliveryFee)}</span>
          </div>
          <div className="mt-2 flex justify-between text-base font-bold text-hubbay-text">
            <span>Total</span>
            <span>{formatNairaFromKobo(subtotal + deliveryFee)}</span>
          </div>
        </div>
      </div>
      <Button className="mt-6" onClick={() => setOpen(true)}>
        Open Floating Cart to Complete Checkout
      </Button>
    </main>
  );
}
