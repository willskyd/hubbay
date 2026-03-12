/* eslint-disable no-console */
const { PrismaClient, DishCategory } = require("@prisma/client");

const prisma = new PrismaClient();

const dishes = [
  {
    slug: "jollof-truffle-prawns",
    name: "Smoked Jollof & Truffle Prawns",
    description:
      "Party jollof infused with smoke, crowned with butter-seared tiger prawns and truffle suya dust.",
    priceKobo: 14500,
    imageUrl:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.MAINS,
    spiceLevel: 3,
    prepTimeMin: 22,
    tags: ["Chef Pick", "Seafood", "Signature"],
    calories: 790,
  },
  {
    slug: "yaji-lamb-chops",
    name: "Yaji-Crusted Lamb Chops",
    description:
      "Charred premium lamb, suya-yaji crust, roasted sweet plantain glaze and mint atarodo drizzle.",
    priceKobo: 21200,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.GRILLS,
    spiceLevel: 4,
    prepTimeMin: 28,
    tags: ["Premium", "Grill", "Lagos Nights"],
    calories: 840,
  },
  {
    slug: "egusi-parmesan-arancini",
    name: "Egusi Parmesan Arancini",
    description:
      "Crispy rice spheres filled with egusi cream, parmesan and basil, served with peppered tomato veloute.",
    priceKobo: 9800,
    imageUrl:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.STARTERS,
    spiceLevel: 2,
    prepTimeMin: 16,
    tags: ["Fusion", "Vegetarian"],
    calories: 460,
  },
  {
    slug: "buka-ramen-bowl",
    name: "Buka Ramen Bowl",
    description:
      "Silky broth with slow-braised beef, ramen noodles, ugu, mushrooms and ajitama egg with iru oil.",
    priceKobo: 13200,
    imageUrl:
      "https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.BOWLS,
    spiceLevel: 2,
    prepTimeMin: 20,
    tags: ["Comfort", "Bowl"],
    calories: 710,
  },
  {
    slug: "peppered-snail-tempura",
    name: "Peppered Snail Tempura",
    description:
      "Tender snail in crisp tempura shells with ikoyi chili mayo and citrus kosho.",
    priceKobo: 11900,
    imageUrl:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.STARTERS,
    spiceLevel: 4,
    prepTimeMin: 19,
    tags: ["Adventurous", "Classic Reinvented"],
    calories: 520,
  },
  {
    slug: "ofada-risotto",
    name: "Ofada Saffron Risotto",
    description:
      "Creamy ofada risotto, confit turkey flakes, ata rodo reduction and crispy basil.",
    priceKobo: 12800,
    imageUrl:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.MAINS,
    spiceLevel: 3,
    prepTimeMin: 24,
    tags: ["Signature", "Chef Pick"],
    calories: 760,
  },
  {
    slug: "charcoal-tilapia",
    name: "Charcoal Tilapia Royale",
    description:
      "Whole tilapia charcoal-grilled, coconut ugba relish, lemon and smoked sea salt.",
    priceKobo: 16800,
    imageUrl:
      "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.GRILLS,
    spiceLevel: 2,
    prepTimeMin: 25,
    tags: ["Seafood", "Gluten Free"],
    calories: 640,
  },
  {
    slug: "suya-tacos-duo",
    name: "Suya Tacos Duo",
    description:
      "Two soft tacos with suya beef, caramelized onions, avocado and smoked garlic aioli.",
    priceKobo: 8700,
    imageUrl:
      "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.STARTERS,
    spiceLevel: 3,
    prepTimeMin: 14,
    tags: ["Street Luxe", "Fast Favorite"],
    calories: 430,
  },
  {
    slug: "abacha-salmon-bowl",
    name: "Abacha & Citrus Salmon Bowl",
    description:
      "Fresh abacha ribbons, torch-seared salmon, nkui vinaigrette and crunchy garden greens.",
    priceKobo: 14100,
    imageUrl:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.BOWLS,
    spiceLevel: 1,
    prepTimeMin: 17,
    tags: ["Healthy", "Seafood"],
    calories: 560,
  },
  {
    slug: "yam-fries-gold-aioli",
    name: "Yam Fries with Gold Aioli",
    description:
      "Triple-cooked yam fries, parmesan dust and golden roasted garlic aioli.",
    priceKobo: 4600,
    imageUrl:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.SIDES,
    spiceLevel: 1,
    prepTimeMin: 12,
    tags: ["Crispy", "Shareable"],
    calories: 390,
  },
  {
    slug: "fire-plantain-mosaic",
    name: "Fire Plantain Mosaic",
    description:
      "Caramelized ripe plantain tiles, peanut crumble and fiery tamarind glaze.",
    priceKobo: 5200,
    imageUrl:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.SIDES,
    spiceLevel: 2,
    prepTimeMin: 10,
    tags: ["Sweet Heat"],
    calories: 330,
  },
  {
    slug: "egusi-lasagna",
    name: "Egusi Lasagna Supreme",
    description:
      "Layered spinach pasta, creamy egusi bechamel, minced turkey and smoked mozzarella.",
    priceKobo: 15400,
    imageUrl:
      "https://images.unsplash.com/photo-1619894991209-18b5f8e85f2d?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.MAINS,
    spiceLevel: 2,
    prepTimeMin: 23,
    tags: ["Fusion", "Comfort"],
    calories: 820,
  },
  {
    slug: "coconut-catfish-pepper-soup",
    name: "Coconut Catfish Pepper Soup",
    description:
      "Brothy catfish pepper soup, coconut milk finish, scent leaves and fresh spice bloom.",
    priceKobo: 12400,
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.BOWLS,
    spiceLevel: 4,
    prepTimeMin: 18,
    tags: ["Hot", "Seafood"],
    calories: 480,
  },
  {
    slug: "zobo-mojito",
    name: "Zobo Mojito",
    description:
      "Cold hibiscus zobo, mint, lime and sparkling notes with optional white rum.",
    priceKobo: 4300,
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.DRINKS,
    spiceLevel: 0,
    prepTimeMin: 6,
    tags: ["Signature", "Refreshing"],
    calories: 170,
  },
  {
    slug: "baobab-vanilla-shake",
    name: "Baobab Vanilla Shake",
    description:
      "Creamy baobab blend with vanilla bean and roasted coconut topping.",
    priceKobo: 3900,
    imageUrl:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.DRINKS,
    spiceLevel: 0,
    prepTimeMin: 7,
    tags: ["Dessert Drink"],
    calories: 290,
  },
  {
    slug: "banga-bbq-ribs",
    name: "Banga BBQ Beef Ribs",
    description:
      "Slow-cooked ribs lacquered in banga palm reduction, charred onions and lime.",
    priceKobo: 19400,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.GRILLS,
    spiceLevel: 3,
    prepTimeMin: 30,
    tags: ["Premium", "Smoky"],
    calories: 930,
  },
  {
    slug: "chin-chin-cheesecake",
    name: "Chin Chin Cheesecake",
    description:
      "Silk cheesecake with buttery chin chin crust and salted caramel drizzle.",
    priceKobo: 5600,
    imageUrl:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.DESSERTS,
    spiceLevel: 0,
    prepTimeMin: 8,
    tags: ["Dessert", "Best Seller"],
    calories: 370,
  },
  {
    slug: "puffpuff-creme-brulee",
    name: "Puff-Puff Creme Brulee",
    description:
      "Warm puff-puff, vanilla custard center and torched sugar crust.",
    priceKobo: 4900,
    imageUrl:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.DESSERTS,
    spiceLevel: 0,
    prepTimeMin: 9,
    tags: ["Dessert", "Fusion"],
    calories: 350,
  },
  {
    slug: "asa-burger",
    name: "Asa Burger Deluxe",
    description:
      "Chargrilled beef patty, aged cheddar, ata spread, caramelized onions and brioche bun.",
    priceKobo: 11200,
    imageUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.MAINS,
    spiceLevel: 2,
    prepTimeMin: 16,
    tags: ["Urban", "Popular"],
    calories: 780,
  },
  {
    slug: "udala-garden-salad",
    name: "Udala Garden Salad",
    description:
      "Crisp greens, udala fruit, cucumber ribbons, almonds and roasted sesame dressing.",
    priceKobo: 6800,
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    category: DishCategory.STARTERS,
    spiceLevel: 0,
    prepTimeMin: 8,
    tags: ["Healthy", "Vegan"],
    calories: 260,
  },
];

async function main() {
  await prisma.complaint.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dish.deleteMany();

  for (const dish of dishes) {
    await prisma.dish.create({ data: dish });
  }

  console.log(`Seeded ${dishes.length} dishes for HubBay.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
