import { MenuClient } from "@/components/menu/menu-client";
import { getPublicDishes } from "@/lib/menu-data";

export const metadata = {
  title: "Menu | HubBay",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const { dishes, usingFallback } = await getPublicDishes();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Menu</p>
      <h1 className="mt-2 text-4xl font-black text-hubbay-text">All Dishes</h1>
      <p className="mt-2 max-w-2xl text-sm text-hubbay-secondary">
        Search, filter, and build your custom luxury meal. Every dish can be personalized in cart.
      </p>
      {usingFallback ? (
        <p className="mt-3 text-sm text-hubbay-gold">
          Database not configured yet. You are viewing fallback premium menu data.
        </p>
      ) : null}
      <div className="mt-8">
        <MenuClient dishes={dishes} />
      </div>
    </main>
  );
}
