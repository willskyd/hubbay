"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Instagram, MapPin, PhoneCall, Send, Twitter } from "lucide-react";

import { HUBBAY_PHONE, LAGOS_ADDRESS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerNavLinks = [
  { href: "/about", label: "About Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/faq", label: "FAQ" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as { message: string };
      setMessage(data.message);
      if (response.ok) setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="mt-24 border-t border-hubbay-divider/80 bg-hubbay-surface/85">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-14 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr_1.1fr]">
          <div className="space-y-4">
            <h3 className="bg-emerald-gold bg-clip-text text-3xl font-black text-transparent">HubBay</h3>
            <p className="max-w-sm text-sm leading-relaxed text-hubbay-secondary">
              HubBay is Lagos&apos; premium African-fusion restaurant platform, combining elevated food,
              fast delivery intelligence, and luxury ordering experiences.
            </p>
            <div className="flex gap-2">
              <a
                className="rounded-full border border-hubbay-gold/35 p-2.5 text-hubbay-emerald transition hover:border-hubbay-gold hover:bg-hubbay-gold/10 hover:text-hubbay-gold"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                className="rounded-full border border-hubbay-gold/35 p-2.5 text-hubbay-emerald transition hover:border-hubbay-gold hover:bg-hubbay-gold/10 hover:text-hubbay-gold"
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-hubbay-gold">Explore</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="inline-flex text-sm text-hubbay-secondary transition hover:text-hubbay-emerald hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.22)]"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="inline-flex text-sm text-hubbay-secondary transition hover:text-hubbay-emerald hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.22)]"
                >
                  Signature Menu
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="inline-flex text-sm text-hubbay-secondary transition hover:text-hubbay-emerald hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.22)]"
                >
                  Wallet & Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="inline-flex text-sm text-hubbay-secondary transition hover:text-hubbay-emerald hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.22)]"
                >
                  Customer Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-hubbay-gold">Visit HubBay</h4>
            <p className="mt-4 flex items-start gap-2 text-sm text-hubbay-secondary">
              <MapPin size={16} className="mt-0.5 text-hubbay-gold" />
              {LAGOS_ADDRESS}
            </p>
            <a
              href={`tel:${HUBBAY_PHONE}`}
              className="mt-3 inline-flex items-center gap-2 text-sm text-hubbay-secondary transition hover:text-hubbay-emerald"
            >
              <PhoneCall size={15} className="text-hubbay-gold" />
              {HUBBAY_PHONE}
            </a>
            <div className="mt-4 space-y-1 text-sm text-hubbay-secondary">
              <p>Mon - Fri: 10:00 AM - 11:00 PM</p>
              <p>Sat - Sun: 9:00 AM - 12:30 AM</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-hubbay-gold">
              Join HubBay Circle
            </h4>
            <p className="mt-4 text-sm text-hubbay-secondary">
              Get menu launches, tasting invites, and exclusive Lagos offers.
            </p>
            <form onSubmit={subscribe} className="mt-4 space-y-3">
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@domain.com"
              />
              <Button disabled={loading} type="submit" className="w-full">
                <Send size={15} />
                {loading ? "Joining..." : "Subscribe"}
              </Button>
            </form>
            {message ? <p className="mt-2 text-xs text-hubbay-secondary">{message}</p> : null}
          </div>
        </div>

        <div className="mt-10 border-t border-hubbay-divider/80 pt-5">
          <nav className="flex flex-wrap items-center gap-4 text-xs md:gap-6">
            {footerNavLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-hubbay-secondary transition hover:text-hubbay-emerald hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.24)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-xs text-hubbay-secondary/85">
            (c) {new Date().getFullYear()} HubBay. Premium African Fusion, Lagos.
          </p>
        </div>
      </div>
    </footer>
  );
}
