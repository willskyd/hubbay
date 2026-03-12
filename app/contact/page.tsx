import { PhoneCall } from "lucide-react";

import { HUBBAY_PHONE, LAGOS_ADDRESS } from "@/lib/constants";

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-12 md:px-8">
      <div className="rounded-3xl border border-hubbay-divider bg-hubbay-surface/80 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-hubbay-gold">Contact HubBay</p>
        <h1 className="mt-2 text-4xl font-black text-hubbay-text">Customer Support</h1>
        <p className="mt-4 text-sm text-hubbay-secondary">
          Reach us for order support, catering inquiries, wallet issues, or private dining bookings.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <a
            href={`tel:${HUBBAY_PHONE}`}
            className="rounded-2xl border border-hubbay-divider bg-hubbay-background px-4 py-3 text-sm text-hubbay-text transition hover:border-hubbay-gold/60"
          >
            <span className="inline-flex items-center gap-2 font-semibold">
              <PhoneCall size={15} className="text-hubbay-gold" />
              Call Us
            </span>
            <p className="mt-1 text-hubbay-secondary">{HUBBAY_PHONE}</p>
          </a>
          <div className="rounded-2xl border border-hubbay-divider bg-hubbay-background px-4 py-3 text-sm">
            <p className="font-semibold text-hubbay-text">Lagos Address</p>
            <p className="mt-1 text-hubbay-secondary">{LAGOS_ADDRESS}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
