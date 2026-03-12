"use client";

import { create } from "zustand";

type WalletStore = {
  balanceKobo: number;
  loading: boolean;
  setBalance: (balanceKobo: number) => void;
  refresh: () => Promise<void>;
};

export const useWalletStore = create<WalletStore>((set) => ({
  balanceKobo: 0,
  loading: false,
  setBalance: (balanceKobo) => set({ balanceKobo }),
  refresh: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/wallet", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { balanceKobo: number };
      set({ balanceKobo: data.balanceKobo });
    } finally {
      set({ loading: false });
    }
  },
}));
