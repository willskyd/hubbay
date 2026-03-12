"use client";

import { WalletTxnStatus, WalletTxnType } from "@prisma/client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNairaFromKobo } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";

type WalletTransaction = {
  id: string;
  amountKobo: number;
  type: WalletTxnType;
  status: WalletTxnStatus;
  reference: string;
  description: string | null;
  createdAt: string;
};

type WalletData = {
  balanceKobo: number;
  transactions: WalletTransaction[];
};

export function WalletPanel() {
  const { balanceKobo, setBalance } = useWalletStore();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [amount, setAmount] = useState("10000");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/wallet", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as WalletData;
      setBalance(data.balanceKobo);
      setTransactions(data.transactions);
    };
    load();
  }, [setBalance]);

  const deposit = async () => {
    const amountNaira = Number(amount);
    if (!amountNaira || amountNaira < 1000) {
      setMessage("Minimum wallet deposit is NGN 1,000.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/wallet/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountNaira }),
      });
      const data = (await response.json()) as {
        authorizationUrl?: string;
        error?: string;
      };
      if (!response.ok || !data.authorizationUrl) {
        setMessage(data.error || "Unable to initialize deposit.");
        return;
      }
      window.location.href = data.authorizationUrl;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
          HubBay Wallet
        </p>
        <h2 className="mt-3 text-4xl font-black text-hubbay-text">
          {formatNairaFromKobo(balanceKobo)}
        </h2>
        <p className="mt-2 text-sm text-hubbay-secondary">
          Pay from wallet first. Any balance left gets routed to Paystack checkout.
        </p>
        <div className="mt-6 flex flex-col gap-3 md:flex-row">
          <Input
            type="number"
            min={1000}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Deposit amount (NGN)"
          />
          <Button onClick={deposit} disabled={loading}>
            {loading ? "Connecting..." : "Deposit via Paystack"}
          </Button>
        </div>
        {message ? <p className="mt-3 text-sm text-hubbay-secondary">{message}</p> : null}
      </div>

      <div className="rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
        <h3 className="text-lg font-semibold text-hubbay-text">Recent Wallet Activity</h3>
        <div className="mt-4 space-y-3">
          {transactions.length === 0 ? (
            <p className="text-sm text-hubbay-secondary">No transactions yet.</p>
          ) : (
            transactions.map((txn) => (
              <div
                key={txn.id}
                className="rounded-2xl border border-hubbay-gold/15 bg-hubbay-background/35 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-hubbay-text">{txn.type}</p>
                  <p className="text-sm text-hubbay-gold">{formatNairaFromKobo(txn.amountKobo)}</p>
                </div>
                <p className="text-xs text-hubbay-secondary">
                  {new Date(txn.createdAt).toLocaleString("en-NG")} - {txn.status}
                </p>
                <p className="mt-1 truncate text-xs text-hubbay-secondary">{txn.reference}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
