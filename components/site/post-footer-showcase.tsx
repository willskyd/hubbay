import { CalendarDays, Gift, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PostFooterShowcase() {
  return (
    <section className="border-t border-hubbay-divider bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(250,249,246,0.95))] dark:border-hubbay-gold/15 dark:bg-[linear-gradient(180deg,rgba(18,26,23,0.72),rgba(10,15,12,0.95))]">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-hubbay-gold/25 bg-hubbay-surface/70 p-6 backdrop-blur-sm md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-hubbay-gold">Still Hungry?</p>
            <h3 className="mt-2 text-3xl font-semibold text-hubbay-text md:text-4xl">
              Discover More Than A Meal
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-hubbay-secondary md:text-base">
              From late-night specials to chef table experiences, HubBay brings a premium
              restaurant standard to every touchpoint.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/menu">
                <Button size="lg">See Full Menu</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Plan Your Next Order
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-2xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-hubbay-text">
                <CalendarDays size={16} className="text-hubbay-gold" />
                Weekend Brunch Sessions
              </p>
              <p className="mt-2 text-xs text-hubbay-secondary">
                Premium brunch platters and craft drinks every Saturday and Sunday.
              </p>
            </div>
            <div className="rounded-2xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-hubbay-text">
                <UtensilsCrossed size={16} className="text-hubbay-gold" />
                Corporate & Event Catering
              </p>
              <p className="mt-2 text-xs text-hubbay-secondary">
                Executive trays, private events, and team experiences with concierge logistics.
              </p>
            </div>
            <div className="rounded-2xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-hubbay-text">
                <Gift size={16} className="text-hubbay-gold" />
                HubBay Gift Moments
              </p>
              <p className="mt-2 text-xs text-hubbay-secondary">
                Gift premium food experiences to family, friends, and clients in Lagos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
