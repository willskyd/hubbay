"use client";

import { DishCategory } from "@prisma/client";
import { motion } from "framer-motion";
import { Flame, ShoppingBasket } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryLabels } from "@/lib/constants";
import { formatNairaFromKobo } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export type DishCardItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceKobo: number;
  category: DishCategory;
  spiceLevel: number;
  prepTimeMin: number;
  tags: string[];
};

export function DishCard({ dish }: { dish: DishCardItem }) {
  const addItem = useCartStore((state) => state.addItem);
  const setOpen = useCartStore((state) => state.setOpen);

  return (
    <motion.div layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="h-full overflow-hidden p-0">
        <div className="relative h-52">
          <Image src={dish.imageUrl} alt={dish.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
          <div className="absolute left-3 top-3">
            <Badge>{categoryLabels[dish.category]}</Badge>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-hubbay-text">{dish.name}</h3>
            <p className="line-clamp-2 text-sm text-hubbay-secondary">{dish.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted">{dish.prepTimeMin} min</Badge>
            <Badge variant="emerald">
              <Flame size={12} />
              Spice {dish.spiceLevel}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-hubbay-gold">
              {formatNairaFromKobo(dish.priceKobo)}
            </p>
            <Button
              size="sm"
              onClick={() => {
                addItem({
                  dishId: dish.id,
                  name: dish.name,
                  priceKobo: dish.priceKobo,
                  imageUrl: dish.imageUrl,
                });
                setOpen(true);
              }}
            >
              <ShoppingBasket size={14} />
              Add
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
