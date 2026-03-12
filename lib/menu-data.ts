import { DishCategory } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type PublicDish = {
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

const fallbackDishes: PublicDish[] = [
  {
    id: "fallback-1",
    name: "Smoked Jollof & Truffle Prawns",
    description:
      "Party jollof infused with smoke, crowned with butter-seared tiger prawns.",
    imageUrl:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    priceKobo: 14500,
    category: DishCategory.MAINS,
    spiceLevel: 3,
    prepTimeMin: 22,
    tags: ["Chef Pick", "Seafood", "Signature"],
  },
  {
    id: "fallback-2",
    name: "Yaji-Crusted Lamb Chops",
    description: "Charred premium lamb, suya-yaji crust and sweet plantain glaze.",
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    priceKobo: 21200,
    category: DishCategory.GRILLS,
    spiceLevel: 4,
    prepTimeMin: 28,
    tags: ["Premium", "Grill"],
  },
  {
    id: "fallback-3",
    name: "Buka Ramen Bowl",
    description: "Silky broth with slow-braised beef, ramen noodles and ugu.",
    imageUrl:
      "https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=1200&q=80",
    priceKobo: 13200,
    category: DishCategory.BOWLS,
    spiceLevel: 2,
    prepTimeMin: 20,
    tags: ["Comfort", "Bowl"],
  },
  {
    id: "fallback-4",
    name: "Suya Tacos Duo",
    description: "Two soft tacos with suya beef, avocado and garlic aioli.",
    imageUrl:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1200&q=80",
    priceKobo: 8700,
    category: DishCategory.STARTERS,
    spiceLevel: 3,
    prepTimeMin: 14,
    tags: ["Street Luxe"],
  },
  {
    id: "fallback-5",
    name: "Coconut Catfish Pepper Soup",
    description: "Brothy catfish pepper soup with coconut milk finish.",
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    priceKobo: 12400,
    category: DishCategory.BOWLS,
    spiceLevel: 4,
    prepTimeMin: 18,
    tags: ["Hot", "Seafood"],
  },
  {
    id: "fallback-6",
    name: "Chin Chin Cheesecake",
    description: "Silk cheesecake with buttery chin chin crust and caramel drizzle.",
    imageUrl:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
    priceKobo: 5600,
    category: DishCategory.DESSERTS,
    spiceLevel: 0,
    prepTimeMin: 8,
    tags: ["Dessert", "Best Seller"],
  },
];

const BROKEN_IMAGE_FRAGMENT = "photo-1604908177522-fc26fd1f6f30";
const REPLACEMENT_IMAGE_URL =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80";

function normalizeDishImage<T extends { imageUrl: string }>(dish: T): T {
  if (dish.imageUrl.includes(BROKEN_IMAGE_FRAGMENT)) {
    return { ...dish, imageUrl: REPLACEMENT_IMAGE_URL };
  }
  return dish;
}

export function filterDishes(
  dishes: PublicDish[],
  q?: string,
  category?: string | null,
) {
  const normalizedQuery = q?.trim().toLowerCase() || "";
  const parsedCategory =
    category && Object.values(DishCategory).includes(category as DishCategory)
      ? (category as DishCategory)
      : null;

  return dishes.filter((dish) => {
    const matchesCategory = parsedCategory ? dish.category === parsedCategory : true;
    const matchesQuery =
      normalizedQuery.length === 0
        ? true
        : `${dish.name} ${dish.description} ${dish.tags.join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}

export async function getPublicDishes() {
  if (!process.env.DATABASE_URL) {
    return {
      dishes: fallbackDishes.map((dish) => normalizeDishImage(dish)),
      usingFallback: true,
    };
  }

  try {
    const dishes = await prisma.dish.findMany({
      where: { isAvailable: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    return {
      dishes: dishes.map((dish) => normalizeDishImage(dish)),
      usingFallback: false,
    };
  } catch (error) {
    console.warn("HubBay fallback menu activated:", error);
    return {
      dishes: fallbackDishes.map((dish) => normalizeDishImage(dish)),
      usingFallback: true,
    };
  }
}
