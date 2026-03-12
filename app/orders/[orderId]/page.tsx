import { OrderStatus } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { OrderTracker } from "@/components/orders/order-tracker";
import { ReviewForm } from "@/components/orders/review-form";
import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { resolveSessionUserId } from "@/lib/session-user";
import { formatNairaFromKobo } from "@/lib/utils";

type Props = {
  params: Promise<{ orderId: string }>;
};

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: Props) {
  const { orderId } = await params;
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const dbUserId = await resolveSessionUserId(session.user);
  if (isDatabaseConfigured && !dbUserId) {
    redirect("/auth/signin");
  }

  if (!isDatabaseConfigured) {
    return (
      <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 md:px-8">
        <div className="rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
          <h1 className="text-3xl font-black text-hubbay-text">Order Details</h1>
          <p className="mt-3 text-sm text-hubbay-gold">
            Demo mode active. Configure `DATABASE_URL` to enable live order tracking and reviews.
          </p>
        </div>
      </main>
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      timeline: { orderBy: { createdAt: "asc" } },
      review: true,
    },
  });

  if (!order || order.userId !== dbUserId) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 md:px-8">
      <div className="rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-6">
        <p className="text-xs text-hubbay-secondary">{order.orderNumber}</p>
        <h1 className="mt-1 text-3xl font-black text-hubbay-text">Order Details</h1>
        <p className="mt-2 text-sm text-hubbay-secondary">
          {order.orderType} • {new Date(order.createdAt).toLocaleString("en-NG")}
        </p>
        <div className="mt-5 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-hubbay-secondary">
              <span>
                {item.quantity}x {item.dishName}
              </span>
              <span>{formatNairaFromKobo(item.lineTotalKobo)}</span>
            </div>
          ))}
          <div className="border-t border-hubbay-gold/20 pt-2 text-base font-bold text-hubbay-gold">
            Total: {formatNairaFromKobo(order.totalKobo)}
          </div>
        </div>
      </div>

      <OrderTracker orderId={order.id} initialStatus={order.status} />

      {order.status === OrderStatus.DELIVERED ? (
        <ReviewForm
          orderId={order.id}
          existingRating={order.review?.rating}
          existingComment={order.review?.comment}
        />
      ) : null}
    </main>
  );
}
