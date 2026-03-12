"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Gauge,
  MapPinned,
  Navigation,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";

type HighlightId = "delivery" | "wallet" | "assurance";

const highlights: Array<{
  id: HighlightId;
  title: string;
  body: string;
  icon: typeof Clock3;
}> = [
  {
    id: "delivery",
    title: "Lightning Delivery",
    body: "Optimized Lagos routing with live order stage updates from kitchen to doorstep.",
    icon: Clock3,
  },
  {
    id: "wallet",
    title: "Wallet-First Checkout",
    body: "Deposit once with Paystack, then speed through every order from your HubBay wallet.",
    icon: Wallet,
  },
  {
    id: "assurance",
    title: "Premium Assurance",
    body: "Every dish is quality-checked by our kitchen before dispatch, every single time.",
    icon: ShieldCheck,
  },
];

export function Highlights() {
  const [active, setActive] = useState<HighlightId>("delivery");

  return (
    <section className="mx-auto mt-14 grid w-full max-w-7xl gap-4 px-4 md:grid-cols-3 md:px-8">
      {highlights.map((item) => (
        <Card
          key={item.title}
          role="button"
          tabIndex={0}
          onClick={() => setActive(item.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setActive(item.id);
            }
          }}
          className={`cursor-pointer border transition ${
            active === item.id
              ? "border-hubbay-gold bg-hubbay-surface/95"
              : "border-hubbay-gold/20 bg-hubbay-surface/80 hover:border-hubbay-gold/45"
          }`}
        >
          <item.icon className="text-hubbay-gold" size={22} />
          <h3 className="mt-4 text-lg font-semibold text-hubbay-text">{item.title}</h3>
          <p className="mt-2 text-sm text-hubbay-secondary">{item.body}</p>
        </Card>
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="rounded-3xl border border-hubbay-gold/25 bg-hubbay-surface/85 p-5 backdrop-blur-sm md:col-span-3"
        >
          {active === "delivery" ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
                Live Dispatch Visibility
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="relative overflow-hidden rounded-2xl border border-hubbay-gold/25 bg-hubbay-background/50 p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(212,175,55,0.12),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_75%_15%,rgba(212,175,55,0.12),rgba(10,15,12,0))]" />
                  <div className="relative">
                    <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-hubbay-gold">
                      <MapPinned size={13} />
                      Lagos Dispatch Map
                    </p>
                    <div className="relative mt-3 h-40 rounded-xl border border-hubbay-gold/20 bg-[linear-gradient(145deg,rgba(230,226,218,0.95),rgba(214,210,200,0.9))]">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,109,79,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,109,79,0.18)_1px,transparent_1px)] bg-[size:24px_24px]" />
                      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none">
                        <polyline
                          points="8,44 24,36 38,40 52,28 66,30 82,18 94,22"
                          fill="none"
                          stroke="rgba(0,109,79,0.58)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeDasharray="4 3"
                        />
                        <circle cx="8" cy="44" r="1.8" fill="rgba(212,175,55,0.95)" />
                        <circle cx="52" cy="28" r="1.8" fill="rgba(212,175,55,0.95)" />
                        <circle cx="94" cy="22" r="1.8" fill="rgba(212,175,55,0.95)" />
                      </svg>
                      <motion.div
                        className="absolute h-3 w-3 rounded-full border border-hubbay-gold bg-hubbay-emerald shadow-[0_0_14px_rgba(0,109,79,0.55)]"
                        animate={{
                          left: ["8%", "24%", "38%", "52%", "66%", "82%", "94%"],
                          top: ["74%", "60%", "66%", "46%", "50%", "30%", "36%"],
                        }}
                        transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                      />
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border border-hubbay-gold/20 bg-hubbay-background/45 p-3">
                        <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-hubbay-gold">
                          <Navigation size={12} />
                          Rider Speed
                        </p>
                        <p className="mt-1 text-sm font-semibold text-hubbay-text">41 km/h</p>
                      </div>
                      <div className="rounded-xl border border-hubbay-gold/20 bg-hubbay-background/45 p-3">
                        <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-hubbay-gold">
                          <Gauge size={12} />
                          Route Health
                        </p>
                        <p className="mt-1 text-sm font-semibold text-hubbay-text">Excellent</p>
                      </div>
                      <div className="rounded-xl border border-hubbay-gold/20 bg-hubbay-background/45 p-3">
                        <p className="flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-hubbay-gold">
                          <Clock3 size={12} />
                          ETA
                        </p>
                        <p className="mt-1 text-sm font-semibold text-hubbay-text">12 mins</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-hubbay-gold/25 bg-hubbay-background/45 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-hubbay-gold">Live Milestones</p>
                  <div className="mt-3 space-y-2">
                    {["Order Confirmed", "Preparing", "Rider En Route", "Delivered"].map(
                      (step, index) => (
                        <div
                          key={step}
                          className="flex items-center gap-2 rounded-xl border border-hubbay-gold/20 px-3 py-2 text-xs text-hubbay-secondary"
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              index < 3 ? "bg-hubbay-gold" : "bg-hubbay-gold/35"
                            }`}
                          />
                          {step}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {active === "wallet" ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
                Wallet Activity Flow
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-hubbay-gold/20 bg-hubbay-background/45 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-hubbay-gold">1. Deposit</p>
                  <p className="mt-1 text-sm text-hubbay-secondary">Fund wallet securely via Paystack.</p>
                </div>
                <div className="rounded-2xl border border-hubbay-gold/20 bg-hubbay-background/45 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-hubbay-gold">2. Auto-Deduct</p>
                  <p className="mt-1 text-sm text-hubbay-secondary">
                    Wallet pays first before card fallback.
                  </p>
                </div>
                <div className="rounded-2xl border border-hubbay-gold/20 bg-hubbay-background/45 p-4">
                  <p className="text-xs uppercase tracking-[0.15em] text-hubbay-gold">3. Instant Confirm</p>
                  <p className="mt-1 text-sm text-hubbay-secondary">
                    Orders move to kitchen in seconds.
                  </p>
                </div>
              </div>
            </>
          ) : null}

          {active === "assurance" ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
                Quality Control Chain
              </p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {[
                  "Ingredient freshness verified every shift",
                  "Heat and spice profile checked by line chef",
                  "Packaging lock with spill-safe seal",
                  "Final dispatch verification by kitchen lead",
                ].map((line) => (
                  <div
                    key={line}
                    className="flex items-start gap-2 rounded-xl border border-hubbay-gold/20 bg-hubbay-background/45 p-3 text-sm text-hubbay-secondary"
                  >
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-hubbay-gold" />
                    {line}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
