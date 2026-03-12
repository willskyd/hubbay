import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter a valid email." }, { status: 400 });
  }

  return NextResponse.json({
    message: `Thanks! ${parsed.data.email} is now subscribed to HubBay updates.`,
  });
}
