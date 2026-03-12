"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LifeBuoy,
  MessageCircleQuestion,
  Search,
  SendHorizonal,
  Truck,
  WalletCards,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const faqItems = [
  {
    question: "How do I pay with wallet first?",
    answer:
      "At checkout, HubBay automatically applies your wallet balance first. If it is not enough, Paystack covers the remainder.",
  },
  {
    question: "Can I switch between pickup and delivery?",
    answer:
      "Yes. In your cart, choose Pickup or Delivery before placing the order. Delivery requires a Lagos address.",
  },
  {
    question: "How do I track my order live?",
    answer:
      "Open Orders, select your order, and follow timeline stages from Pending to Delivered with live status changes.",
  },
  {
    question: "What if payment succeeds but order is not updated?",
    answer:
      "Use Wallet Help or Contact Support below. Include your order number or payment reference for fast resolution.",
  },
];

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });

  const filteredFaq = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqItems;
    return faqItems.filter((item) =>
      `${item.question} ${item.answer}`.toLowerCase().includes(q),
    );
  }, [query]);

  const submitComplaint = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setStatus("");

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          orderId: form.orderId || undefined,
          message: form.message,
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        setStatus(data.error || "Unable to submit complaint right now.");
        return;
      }

      setStatus(data.message || "Complaint submitted successfully.");
      setForm({ name: "", email: "", orderId: "", message: "" });
    } catch {
      setStatus("Unable to submit complaint right now.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-hubbay-gold/55 bg-hubbay-emerald text-white shadow-[0_0_28px_rgba(212,175,55,0.34)] transition hover:-translate-y-0.5 hover:border-hubbay-gold hover:shadow-[0_14px_32px_rgba(0,109,79,0.28)]"
        aria-label="Open help center"
      >
        <MessageCircleQuestion size={18} />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              aria-label="Close help center"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="fixed right-0 top-0 z-[60] h-screen w-full max-w-md overflow-y-auto border-l border-hubbay-gold/25 bg-hubbay-surface/95 p-5 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-hubbay-gold">Help Center</p>
                  <h3 className="text-xl font-bold text-hubbay-text">HubBay Support</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-hubbay-gold/35 p-2 text-hubbay-secondary transition hover:text-hubbay-text"
                  aria-label="Close help panel"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="mt-4 rounded-2xl border border-hubbay-gold/25 bg-hubbay-background/85 p-3">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-hubbay-gold">
                  Search FAQ
                </label>
                <div className="relative">
                  <Search
                    size={14}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-hubbay-secondary"
                  />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search payment, wallet, tracking..."
                    className="pl-9"
                  />
                </div>
                <div className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1">
                  {filteredFaq.length === 0 ? (
                    <p className="text-xs text-hubbay-secondary">No matching answers found.</p>
                  ) : (
                    filteredFaq.map((item) => (
                      <details
                        key={item.question}
                        className="rounded-xl border border-hubbay-divider bg-hubbay-surface/80 px-3 py-2"
                      >
                        <summary className="cursor-pointer text-sm font-medium text-hubbay-text">
                          {item.question}
                        </summary>
                        <p className="mt-2 text-xs leading-relaxed text-hubbay-secondary">{item.answer}</p>
                      </details>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-hubbay-gold/25 bg-hubbay-background/85 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hubbay-gold">
                  Quick Help
                </p>
                <div className="mt-3 grid gap-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-hubbay-divider bg-hubbay-surface/80 px-3 py-2 text-sm text-hubbay-text transition hover:border-hubbay-gold/60"
                  >
                    <LifeBuoy size={14} className="text-hubbay-gold" />
                    Contact Support
                  </Link>
                  <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 rounded-xl border border-hubbay-divider bg-hubbay-surface/80 px-3 py-2 text-sm text-hubbay-text transition hover:border-hubbay-gold/60"
                  >
                    <Truck size={14} className="text-hubbay-gold" />
                    Live Order Tracking
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-hubbay-divider bg-hubbay-surface/80 px-3 py-2 text-sm text-hubbay-text transition hover:border-hubbay-gold/60"
                  >
                    <WalletCards size={14} className="text-hubbay-gold" />
                    Wallet Help
                  </Link>
                </div>
              </div>

              <form
                onSubmit={submitComplaint}
                className="mt-4 space-y-3 rounded-2xl border border-hubbay-gold/25 bg-hubbay-background/85 p-3"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hubbay-gold">
                  Submit Complaint
                </p>
                <Input
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Full name"
                />
                <Input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="Email address"
                />
                <Input
                  value={form.orderId}
                  onChange={(event) => setForm((prev) => ({ ...prev, orderId: event.target.value }))}
                  placeholder="Order ID (optional)"
                />
                <Textarea
                  required
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  placeholder="Tell us what happened..."
                  className="min-h-[110px]"
                />
                <Button type="submit" className="w-full" disabled={sending}>
                  <SendHorizonal size={14} />
                  {sending ? "Submitting..." : "Send Complaint"}
                </Button>
                {status ? <p className="text-xs text-hubbay-secondary">{status}</p> : null}
              </form>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
