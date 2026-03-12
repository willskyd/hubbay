"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChefHat, Clock3, Flame, Sparkles, Truck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type ServiceMode = "pickup" | "delivery" | "private";
type HeroInsight = "pickup" | "tracking" | "delivery" | "signature" | "speed" | "rating" | null;

const heroSlides = [
  {
    tag: "Signature Rice",
    title: "Firewood Jollof & Tiger Prawns",
    description:
      "Smoky party jollof with butter-seared tiger prawns, roasted sweet peppers, and citrus herb oil.",
    eta: "Pickup 18 min",
    mode: "Door Delivery 32 min",
    accent: "Live Order Tracking",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Craft Drinks",
    title: "Zobo Reserve & Citrus Tonic",
    description:
      "Cold-brew hibiscus, pineapple mist, and citrus tonic served ice-cold for warm Lagos evenings.",
    eta: "Bar Ready 6 min",
    mode: "Pair with Meals",
    accent: "Freshly Mixed",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Grill Master",
    title: "Suya Flame Platter",
    description:
      "Charcoal grilled cuts, suya dust, and house pepper glaze plated for premium dine-in or fast dispatch.",
    eta: "Pickup 22 min",
    mode: "Delivery 35 min",
    accent: "Hot Off Grill",
    image:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80",
  },
  {
    tag: "Experience",
    title: "Private Dining and Express Delivery",
    description:
      "Reserve chef-led tastings, order for pickup, or schedule premium doorstep delivery across Lagos.",
    eta: "Concierge Ready",
    mode: "Pickup or Delivery",
    accent: "Curated Service",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=80",
  },
];

const marqueeItems = [
  "Fresh from the Grill",
  "Lagos Loves HubBay",
  "Order Now & Get 10% Off",
  "Premium African Fusion",
  "Private Dining Concierge",
  "Wallet-First Checkout",
];

const serviceDetails: Record<ServiceMode, { title: string; body: string; tags: string[] }> = {
  pickup: {
    title: "Pickup Fast Lane",
    body: "Reserve your dish and collect from our dedicated counter without waiting in queue.",
    tags: ["Express Counter", "Live ETA", "Heat-Sealed Packaging"],
  },
  delivery: {
    title: "Door Delivery Control",
    body: "Optimized rider routing, live order stages, and dynamic ETA updates across Lagos.",
    tags: ["Route Tracking", "Status Broadcast", "Location-Aware ETA"],
  },
  private: {
    title: "Private Dining Concierge",
    body: "Chef-led tasting sessions and curated event dining built around your preferred schedule.",
    tags: ["Chef Curation", "Premium Setup", "Guest Personalization"],
  },
};

function formatCountdown(seconds: number) {
  const safe = Math.max(seconds, 0);
  const m = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const s = (safe % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeService, setActiveService] = useState<ServiceMode>("pickup");
  const [activeInsight, setActiveInsight] = useState<HeroInsight>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4800);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setActiveInsight(null);
  }, [activeSlide]);

  const pickupBaseSeconds = useMemo(() => {
    const eta = heroSlides[activeSlide].eta;
    const match = eta.match(/\d+/);
    const minutes = match ? Number(match[0]) : 18;
    return Math.max(minutes, 1) * 60;
  }, [activeSlide]);

  const [pickupCountdown, setPickupCountdown] = useState(pickupBaseSeconds);

  useEffect(() => {
    setPickupCountdown(pickupBaseSeconds);
  }, [pickupBaseSeconds]);

  useEffect(() => {
    if (activeInsight !== "pickup") return;

    const timer = setInterval(() => {
      setPickupCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeInsight]);

  return (
    <section className="relative isolate overflow-hidden pb-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroSlides[activeSlide].title}
          initial={{ scale: 1.04, opacity: 0.25 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.03, opacity: 0.18 }}
          transition={{ duration: 1.05, ease: "easeOut" }}
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSlides[activeSlide].image})` }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(248,245,239,0.42)_4%,rgba(248,245,239,0.16)_48%,rgba(248,245,239,0.48)_100%)] dark:bg-[linear-gradient(120deg,rgba(10,15,12,0.88)_4%,rgba(10,15,12,0.55)_48%,rgba(10,15,12,0.88)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(212,175,55,0.16),rgba(255,255,255,0)_45%)] dark:bg-[radial-gradient(circle_at_75%_20%,rgba(212,175,55,0.25),rgba(10,15,12,0)_42%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_90%,rgba(0,109,79,0.16),rgba(255,255,255,0)_48%)] dark:bg-[radial-gradient(circle_at_15%_90%,rgba(0,109,79,0.25),rgba(10,15,12,0)_45%)]" />

      <div className="mx-auto flex min-h-[84vh] w-full max-w-7xl items-end px-4 py-14 md:px-8 md:py-16">
        <div className="w-full">
          <div className="relative left-1/2 mb-6 w-[min(96vw,1540px)] -translate-x-1/2 overflow-hidden rounded-full border border-hubbay-gold/30 bg-hubbay-background/75 px-2 py-2 backdrop-blur-xl">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="flex w-[200%] gap-2"
            >
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-hubbay-gold/30 bg-hubbay-surface/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-hubbay-secondary"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <div className="min-w-0 space-y-4">
              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-wrap gap-2"
              >
                {([
                  ["pickup", "Pickup"],
                  ["delivery", "Door Delivery"],
                  ["private", "Private Dining"],
                ] as const).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setActiveService(value)}
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                      activeService === value
                        ? "border-hubbay-gold bg-hubbay-gold/15 text-hubbay-gold"
                        : "border-hubbay-divider bg-hubbay-background/70 text-hubbay-text hover:border-hubbay-gold/55"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  className="rounded-2xl border border-hubbay-gold/30 bg-hubbay-background/75 p-4 backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hubbay-gold">
                    {serviceDetails[activeService].title}
                  </p>
                  <p className="mt-2 text-sm text-hubbay-secondary">{serviceDetails[activeService].body}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {serviceDetails[activeService].tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-hubbay-gold/20 bg-hubbay-surface/85 px-2.5 py-1 text-xs text-hubbay-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <motion.div
                key={`${heroSlides[activeSlide].title}-content`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="overflow-hidden rounded-3xl border border-hubbay-gold/35 bg-hubbay-background/78 p-5 shadow-[0_0_60px_rgba(0,109,79,0.18)] backdrop-blur-xl md:p-7"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-hubbay-gold">
                  {heroSlides[activeSlide].tag}
                </p>
                <h2
                  className={`mt-3 max-w-2xl text-3xl font-black leading-tight text-hubbay-text md:text-5xl ${
                    heroSlides[activeSlide].title.includes("Private Dining")
                      ? "tracking-[0.01em] text-hubbay-emerald"
                      : ""
                  }`}
                >
                  {heroSlides[activeSlide].title}
                </h2>
                <p className="mt-3 max-w-2xl text-sm text-hubbay-secondary md:text-[15px]">
                  {heroSlides[activeSlide].description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveInsight("pickup")}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      activeInsight === "pickup"
                        ? "border-hubbay-gold bg-hubbay-gold/18 text-hubbay-gold"
                        : "border-hubbay-gold/45 bg-hubbay-gold/10 text-hubbay-gold hover:border-hubbay-gold"
                    }`}
                  >
                    {heroSlides[activeSlide].eta}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInsight("delivery")}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      activeInsight === "delivery"
                        ? "border-hubbay-gold bg-hubbay-gold/18 text-hubbay-gold"
                        : "border-hubbay-divider bg-hubbay-surface/90 text-hubbay-text hover:border-hubbay-gold/60"
                    }`}
                  >
                    {heroSlides[activeSlide].mode}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInsight("tracking")}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      activeInsight === "tracking"
                        ? "border-hubbay-emerald/70 bg-hubbay-emerald/20 text-hubbay-emerald"
                        : "border-hubbay-emerald/45 bg-hubbay-emerald/10 text-hubbay-emerald hover:border-hubbay-emerald/70"
                    }`}
                  >
                    {heroSlides[activeSlide].accent}
                  </button>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setActiveInsight("signature")}
                    className="rounded-2xl border border-hubbay-gold/25 bg-hubbay-surface/85 p-3 text-left transition hover:border-hubbay-gold/70"
                  >
                    <p className="flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-hubbay-gold">
                      <Flame size={12} />
                      Signature
                    </p>
                    <p className="mt-1 text-sm font-semibold text-hubbay-text">12k+ Orders Served</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInsight("speed")}
                    className="rounded-2xl border border-hubbay-gold/25 bg-hubbay-surface/85 p-3 text-left transition hover:border-hubbay-gold/70"
                  >
                    <p className="flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-hubbay-gold">
                      <Clock3 size={12} />
                      Avg ETA
                    </p>
                    <p className="mt-1 text-sm font-semibold text-hubbay-text">22 Minutes</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInsight("rating")}
                    className="rounded-2xl border border-hubbay-gold/25 bg-hubbay-surface/85 p-3 text-left transition hover:border-hubbay-gold/70"
                  >
                    <p className="flex items-center gap-1 text-xs uppercase tracking-[0.18em] text-hubbay-gold">
                      <Sparkles size={12} />
                      Premium
                    </p>
                    <p className="mt-1 text-sm font-semibold text-hubbay-text">4.9 Lagos Rating</p>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {activeInsight ? (
                    <motion.div
                      key={activeInsight}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-4 rounded-2xl border border-hubbay-gold/30 bg-hubbay-surface/88 p-3"
                    >
                      {activeInsight === "pickup" ? (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
                            Pickup Countdown
                          </p>
                          <p className="mt-1 text-xl font-bold text-hubbay-text">
                            Ready in {formatCountdown(pickupCountdown)}
                          </p>
                          <p className="text-xs text-hubbay-secondary">
                            Kitchen queue and packaging time updates in real-time.
                          </p>
                        </div>
                      ) : null}
                      {activeInsight === "tracking" ? (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
                            Live Order Tracking
                          </p>
                          <div className="mt-2 grid gap-2 sm:grid-cols-3">
                            {["Pending", "Preparing", "Rider En Route"].map((step, index) => (
                              <div
                                key={step}
                                className="rounded-xl border border-hubbay-divider bg-hubbay-background px-3 py-2 text-xs text-hubbay-secondary"
                              >
                                <p className="font-semibold text-hubbay-text">{step}</p>
                                <p className="mt-1">{index === 2 ? "ETA 12 mins" : "Completed"}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                      {activeInsight === "delivery" ? (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
                            Delivery Scope
                          </p>
                          <p className="mt-1 text-sm text-hubbay-secondary">
                            Active dispatch coverage: Lekki, VI, Ikoyi, Yaba, Surulere. Rider ETA
                            recalculates every minute.
                          </p>
                        </div>
                      ) : null}
                      {activeInsight === "signature" ? (
                        <p className="text-sm text-hubbay-secondary">
                          Signature dishes are chef-curated and prepared with premium ingredients each
                          shift.
                        </p>
                      ) : null}
                      {activeInsight === "speed" ? (
                        <p className="text-sm text-hubbay-secondary">
                          Avg ETA combines kitchen prep + rider route intelligence for accurate
                          time-to-door estimates.
                        </p>
                      ) : null}
                      {activeInsight === "rating" ? (
                        <p className="text-sm text-hubbay-secondary">
                          Rated by verified completed orders only, with post-delivery feedback and
                          quality checks.
                        </p>
                      ) : null}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-3"
              >
                <Link href="/menu">
                  <Button size="lg">Explore Menu</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline">
                    Open Wallet
                  </Button>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ x: 24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="grid min-w-0 gap-3"
            >
              <div className="rounded-2xl border border-hubbay-gold/35 bg-hubbay-background/70 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
                  Tonight At HubBay
                </p>
                <p className="mt-2 text-sm font-semibold text-hubbay-text">Chef Table & Cocktail Pairing</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-hubbay-gold/30 bg-hubbay-surface/90 px-2.5 py-1 text-xs text-hubbay-secondary">
                    <ChefHat size={12} className="text-hubbay-gold" />
                    7:00 PM Seating
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-hubbay-gold/30 bg-hubbay-surface/90 px-2.5 py-1 text-xs text-hubbay-secondary">
                    <Truck size={12} className="text-hubbay-gold" />
                    Fast Dispatch
                  </span>
                </div>
              </div>
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`group flex items-center gap-3 rounded-2xl border p-2 text-left transition ${
                    activeSlide === index
                      ? "border-hubbay-gold bg-hubbay-background/90"
                      : "border-hubbay-divider bg-hubbay-background/65 hover:border-hubbay-gold/55"
                  }`}
                >
                  <div
                    className="h-14 w-16 shrink-0 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs uppercase tracking-[0.15em] text-hubbay-gold/90">
                      {slide.tag}
                    </p>
                    <p className="truncate text-sm font-semibold text-hubbay-text">{slide.title}</p>
                  </div>
                </button>
              ))}
              <div className="flex justify-end gap-2 pt-1">
                {heroSlides.map((slide, index) => (
                  <button
                    type="button"
                    key={`${slide.title}-dot`}
                    aria-label={`Show ${slide.title}`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === index
                        ? "w-8 bg-hubbay-gold"
                        : "w-2 bg-hubbay-emerald/35 hover:bg-hubbay-gold/70"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
