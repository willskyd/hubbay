export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-12 md:px-8">
      <div className="rounded-3xl border border-hubbay-divider bg-hubbay-surface/80 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-hubbay-gold">Legal</p>
        <h1 className="mt-2 text-4xl font-black text-hubbay-text">Terms & Conditions</h1>
        <p className="mt-4 text-sm leading-relaxed text-hubbay-secondary">
          By using HubBay, you agree to our ordering, payment, and delivery policies. Delivery
          windows are estimates and may vary with traffic and weather. Wallet deposits are
          non-cash and are used only for HubBay services. For disputes, contact support with your
          order details so our team can resolve quickly.
        </p>
      </div>
    </main>
  );
}
