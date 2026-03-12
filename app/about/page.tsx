"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const sections = [
  {
    id: "story",
    title: "Our Story",
    body:
      "HubBay began in Lagos with one mission: elevate African flavors with modern speed, precision, and hospitality. We blend local recipes, global techniques, and exceptional service into every order.",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "values",
    title: "Our Values",
    body:
      "Quality first, people always. We source responsibly, cook with integrity, and design every experience around trust, taste, and consistency.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "team",
    title: "Meet the Team",
    body:
      "From chefs and mixologists to dispatch specialists and customer care, HubBay is powered by a team obsessed with making every Lagos meal feel premium.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "why",
    title: "Why Choose Us",
    body:
      "You get unforgettable flavor, luxury-level presentation, transparent order tracking, and wallet-first checkout in one seamless restaurant platform.",
    image:
      "https://images.unsplash.com/photo-1516685018646-549d52f16a7a?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 md:px-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-hubbay-divider bg-hubbay-surface/70 p-8 shadow-glow md:p-10"
      >
        <p className="text-xs uppercase tracking-[0.22em] text-hubbay-gold">About HubBay</p>
        <h1 className="mt-3 bg-emerald-gold bg-clip-text text-4xl font-extrabold leading-tight tracking-[0.01em] text-transparent md:text-6xl">
          Nigerian Roots • African Fusion • Lagos Standard
        </h1>
        <p className="mt-4 max-w-3xl text-base text-hubbay-secondary md:text-lg">
          HubBay is a premium African-fusion restaurant company born in Lagos, built for people who
          want outstanding flavor, elegant presentation, and modern food convenience.
        </p>
      </motion.section>

      <section className="mt-10 space-y-8">
        {sections.map((section, index) => (
          <motion.article
            key={section.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: index * 0.06 }}
            className="grid gap-5 rounded-3xl border border-hubbay-divider bg-hubbay-surface/70 p-5 md:grid-cols-[0.9fr_1.1fr] md:items-center md:p-6"
          >
            <div className="relative h-56 overflow-hidden rounded-2xl md:h-64">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-hubbay-gold">{section.title}</p>
              <h2 className="mt-2 text-3xl font-black text-hubbay-text">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-hubbay-secondary md:text-base">
                {section.body}
              </p>
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
