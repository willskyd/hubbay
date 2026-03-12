const faqs = [
  {
    q: "How does wallet payment work?",
    a: "Wallet balance is used first at checkout. If balance is not enough, remaining amount is paid via Paystack.",
  },
  {
    q: "Can I track my order in real time?",
    a: "Yes. Each order includes timeline stages from pending to delivered, with progress updates.",
  },
  {
    q: "Do you support pickup and delivery?",
    a: "Yes. You can choose pickup or door delivery before placing your order.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-12 md:px-8">
      <div className="rounded-3xl border border-hubbay-divider bg-hubbay-surface/80 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-hubbay-gold">Support</p>
        <h1 className="mt-2 text-4xl font-black text-hubbay-text">Frequently Asked Questions</h1>
        <div className="mt-6 space-y-3">
          {faqs.map((item) => (
            <div key={item.q} className="rounded-2xl border border-hubbay-divider bg-hubbay-background p-4">
              <h2 className="text-sm font-semibold text-hubbay-text">{item.q}</h2>
              <p className="mt-2 text-sm text-hubbay-secondary">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
