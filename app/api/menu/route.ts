import { NextResponse } from "next/server";

import { filterDishes, getPublicDishes } from "@/lib/menu-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase() || "";
  const category = searchParams.get("category");

  const { dishes, usingFallback } = await getPublicDishes();
  const filtered = filterDishes(dishes, q, category);

  return NextResponse.json({ dishes: filtered, usingFallback });
}
