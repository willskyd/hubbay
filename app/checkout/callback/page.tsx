"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

function CheckoutCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference");
  const [message, setMessage] = useState("Confirming payment...");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setMessage("Missing payment reference.");
      return;
    }

    const verify = async () => {
      const response = await fetch("/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
        orderId?: string;
      };

      setMessage(data.message || data.error || "Payment processed.");
      if (data.orderId) {
        setOrderId(data.orderId);
        setTimeout(() => {
          router.push(`/orders/${data.orderId}`);
        }, 1800);
      }
    };

    verify();
  }, [reference, router]);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-4">
      <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Checkout</p>
        <h1 className="mt-2 text-3xl font-black text-hubbay-text">Payment Status</h1>
        <p className="mt-4 text-sm text-hubbay-secondary">{message}</p>
        <div className="mt-6">
          <Link href={orderId ? `/orders/${orderId}` : "/orders"}>
            <Button>Go to Orders</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-4">
          <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6 text-center">
            <p className="text-sm text-hubbay-secondary">Loading payment status...</p>
          </div>
        </main>
      }
    >
      <CheckoutCallbackContent />
    </Suspense>
  );
}
