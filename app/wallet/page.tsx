import { redirect } from "next/navigation";

import { WalletPanel } from "@/components/dashboard/wallet-panel";
import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = {
  title: "Wallet | HubBay",
};

export const dynamic = "force-dynamic";

export default async function WalletPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Wallet</p>
      <h1 className="mt-2 text-4xl font-black text-hubbay-text">HubBay Wallet</h1>
      <p className="mt-2 text-sm text-hubbay-secondary">
        Manage deposits and track wallet activity.
      </p>
      {!isDatabaseConfigured ? (
        <div className="mt-8 rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
          <p className="text-sm text-hubbay-gold">
            Database is not configured yet, so wallet is running in demo mode.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <WalletPanel />
        </div>
      )}
    </main>
  );
}
