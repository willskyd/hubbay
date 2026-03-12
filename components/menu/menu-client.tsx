"use client";

import { DishCategory } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { DishCard, type DishCardItem } from "@/components/menu/dish-card";
import { Input } from "@/components/ui/input";
import { categoryLabels } from "@/lib/constants";

type Props = {
  dishes: DishCardItem[];
  compact?: boolean;
};

export function MenuClient({ dishes, compact = false }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"ALL" | DishCategory>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishes.filter((dish) => {
      const categoryMatch = category === "ALL" ? true : dish.category === category;
      const queryMatch =
        q.length === 0
          ? true
          : `${dish.name} ${dish.description} ${dish.tags.join(" ")}`
              .toLowerCase()
              .includes(q);
      return categoryMatch && queryMatch;
    });
  }, [dishes, query, category]);

  const shown = compact ? filtered.slice(0, 8) : filtered;

  const categories: Array<"ALL" | DishCategory> = ["ALL", ...Object.values(DishCategory)];

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-4 rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/60 p-5 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-hubbay-secondary"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Search suya, jollof, bowls..."
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                category === item
                  ? "border-hubbay-gold bg-hubbay-gold/15 text-hubbay-gold"
                  : "border-hubbay-gold/20 text-hubbay-secondary hover:border-hubbay-gold/40"
              }`}
            >
              {item === "ALL" ? "All" : categoryLabels[item]}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </motion.div>
      </AnimatePresence>
      {compact && filtered.length > 8 ? (
        <p className="text-sm text-hubbay-secondary">
          Showing 8 of {filtered.length} dishes. Open full menu for more.
        </p>
      ) : null}
    </section>
  );
}
