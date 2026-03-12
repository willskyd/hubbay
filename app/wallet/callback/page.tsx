"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

function WalletCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const reference = params.get("reference");
  const [message, setMessage] = useState("Verifying your wallet deposit...");

  useEffect(() => {
    if (!reference) {
      setMessage("Missing payment reference.");
      return;
    }

    const verify = async () => {
      const response = await fetch("/api/wallet/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      setMessage(data.message || data.error || "Verification completed.");
      if (response.ok) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 1600);
      }
    };

    verify();
  }, [reference, router]);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-4">
      <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Wallet</p>
        <h1 className="mt-2 text-3xl font-black text-hubbay-text">Deposit Verification</h1>
        <p className="mt-4 text-sm text-hubbay-secondary">{message}</p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function WalletCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-4">
          <div className="w-full rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6 text-center">
            <p className="text-sm text-hubbay-secondary">Loading deposit verification...</p>
          </div>
        </main>
      }
    >
      <WalletCallbackContent />
    </Suspense>
  );
}
