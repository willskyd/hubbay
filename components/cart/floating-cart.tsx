"use client";

import { OrderType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatNairaFromKobo } from "@/lib/utils";
import { selectCartSubtotal, useCartStore } from "@/store/cart-store";

export function FloatingCart() {
  const objectIdPattern = /^[a-f\d]{24}$/i;
  const router = useRouter();
  const { status } = useSession();

  const {
    open,
    setOpen,
    items,
    orderType,
    deliveryAddress,
    orderNote,
    updateQuantity,
    removeItem,
    updateInstructions,
    setOrderType,
    setDeliveryAddress,
    setOrderNote,
    clearCart,
  } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = useCartStore(selectCartSubtotal);
  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );
  const deliveryFee = useMemo(
    () => (orderType === OrderType.DELIVERY && subtotal > 0 ? 2500 : 0),
    [orderType, subtotal],
  );
  const total = subtotal + deliveryFee;

  const checkout = async () => {
    if (items.length === 0 || loading) return;
    if (status !== "authenticated") {
      router.push("/auth/signin");
      return;
    }
    const invalidItems = items.filter((item) => !objectIdPattern.test(item.dishId));
    if (invalidItems.length > 0) {
      invalidItems.forEach((item) => removeItem(item.dishId));
      setError(
        "Some old items were removed from your cart. Please add your dishes again and place order.",
      );
      return;
    }
    if (orderType === OrderType.DELIVERY && deliveryAddress.trim().length < 8) {
      setError("Delivery address is required for door delivery.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          orderType,
          deliveryAddress,
          notes: orderNote,
        }),
      });

      const raw = await response.text();
      let data = {} as {
        error?: string;
        orderId?: string;
        requiresPaystack?: boolean;
        authorizationUrl?: string;
      };
      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {};
      } catch {
        data = { error: "Unable to place order right now. Please try again." };
      }

      if (!response.ok || !data.orderId) {
        setError(data.error || "Unable to place order.");
        return;
      }

      if (data.requiresPaystack && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }

      clearCart();
      router.push(`/orders/${data.orderId}`);
      router.refresh();
    } catch {
      setError("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open ? (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full border border-hubbay-gold/55 bg-hubbay-background/85 px-4 py-3 text-sm font-semibold text-hubbay-text shadow-[0_0_30px_rgba(212,175,55,0.22)] backdrop-blur-md transition hover:border-hubbay-gold hover:bg-hubbay-surface"
          aria-label="Open cart"
        >
          <ShoppingBag size={17} className="text-hubbay-gold" />
          Cart
          <span className="rounded-full bg-hubbay-gold/20 px-2 py-0.5 text-xs text-hubbay-gold">
            {itemCount}
          </span>
        </motion.button>
      ) : null}
      <AnimatePresence>
        {open ? (
          <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-screen w-full max-w-md overflow-y-auto border-l border-hubbay-gold/20 bg-hubbay-background p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-hubbay-text">Your Cart</h2>
              <button
                type="button"
                className="rounded-full border border-hubbay-gold/30 p-2 text-hubbay-secondary hover:text-hubbay-text"
                onClick={() => setOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-hubbay-secondary">No items yet. Add dishes from menu.</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.dishId}
                    className="rounded-2xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-hubbay-text">{item.name}</h3>
                        <p className="text-sm text-hubbay-gold">
                          {formatNairaFromKobo(item.priceKobo)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.dishId)}
                        className="text-xs text-hubbay-secondary hover:text-hubbay-gold"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-hubbay-gold/30 p-1.5 text-hubbay-secondary hover:text-hubbay-text"
                        onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm text-hubbay-text">{item.quantity}</span>
                      <button
                        type="button"
                        className="rounded-full border border-hubbay-gold/30 p-1.5 text-hubbay-secondary hover:text-hubbay-text"
                        onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <Textarea
                      value={item.specialInstructions ?? ""}
                      onChange={(event) =>
                        updateInstructions(item.dishId, event.target.value)
                      }
                      className="mt-3 min-h-[76px]"
                      placeholder="Special instructions (no onions, extra spicy...)"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
                Fulfilment
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType(OrderType.PICKUP)}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    orderType === OrderType.PICKUP
                      ? "border-hubbay-gold bg-hubbay-gold/15 text-hubbay-gold"
                      : "border-hubbay-gold/20 text-hubbay-secondary"
                  }`}
                >
                  Pickup
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType(OrderType.DELIVERY)}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    orderType === OrderType.DELIVERY
                      ? "border-hubbay-gold bg-hubbay-gold/15 text-hubbay-gold"
                      : "border-hubbay-gold/20 text-hubbay-secondary"
                  }`}
                >
                  Delivery
                </button>
              </div>
              {orderType === OrderType.DELIVERY ? (
                <Input
                  placeholder="Delivery address in Lagos"
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                />
              ) : null}
              <Textarea
                className="min-h-[76px]"
                value={orderNote}
                onChange={(event) => setOrderNote(event.target.value)}
                placeholder="Order note for the kitchen"
              />
            </div>

            <div className="mt-6 space-y-1 text-sm">
              <div className="flex justify-between text-hubbay-secondary">
                <span>Subtotal</span>
                <span>{formatNairaFromKobo(subtotal)}</span>
              </div>
              <div className="flex justify-between text-hubbay-secondary">
                <span>Delivery fee</span>
                <span>{formatNairaFromKobo(deliveryFee)}</span>
              </div>
              <div className="mt-2 flex justify-between text-base font-bold text-hubbay-text">
                <span>Total</span>
                <span>{formatNairaFromKobo(total)}</span>
              </div>
              <p className="pt-2 text-xs text-hubbay-secondary">
                Wallet balance is used first. Paystack covers any remaining amount.
              </p>
            </div>

            {error ? <p className="mt-3 text-sm text-hubbay-gold">{error}</p> : null}

            <Button
              disabled={loading || items.length === 0}
              onClick={checkout}
              className="mt-5 w-full"
            >
              {loading ? "Processing..." : "Place order"}
            </Button>
          </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
