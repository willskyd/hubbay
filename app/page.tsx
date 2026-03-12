import { MenuClient } from "@/components/menu/menu-client";
import { getPublicDishes } from "@/lib/menu-data";
import { HeroSection } from "@/components/site/hero-section";
import { Highlights } from "@/components/site/highlights";
import { PostFooterShowcase } from "@/components/site/post-footer-showcase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { dishes, usingFallback } = await getPublicDishes();

  return (
    <main className="pb-10">
      <HeroSection />
      <Highlights />
      <section className="mx-auto mt-16 w-full max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">
              HubBay Signature Menu
            </p>
            <h2 className="mt-2 bg-emerald-gold bg-clip-text text-4xl font-semibold leading-[1.02] tracking-[0.01em] text-transparent md:text-5xl">
              Crafted for Lagos Taste Royalty
            </h2>
          </div>
        </div>
        {usingFallback ? (
          <p className="mb-4 text-sm text-hubbay-gold">
            Running in fallback mode. Add `DATABASE_URL` in `.env.local` and run Prisma `db push` +
            seed to enable full live menu data.
          </p>
        ) : null}
        <MenuClient dishes={dishes} compact />
      </section>
      <PostFooterShowcase />
    </main>
  );
}
