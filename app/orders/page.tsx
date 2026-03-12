import Link from "next/link";
import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { resolveSessionUserId } from "@/lib/session-user";
import { formatNairaFromKobo } from "@/lib/utils";

export const metadata = {
  title: "Orders | HubBay",
};

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const dbUserId = await resolveSessionUserId(session.user);
  if (isDatabaseConfigured && !dbUserId) {
    redirect("/auth/signin");
  }

  const orders = isDatabaseConfigured
    ? await prisma.order.findMany({
        where: { userId: dbUserId! },
        include: {
          items: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Orders</p>
      <h1 className="mt-2 text-4xl font-black text-hubbay-text">Order History</h1>
      {!isDatabaseConfigured ? (
        <p className="mt-3 text-sm text-hubbay-gold">
          Demo mode active: configure `DATABASE_URL` to enable persistent order history.
        </p>
      ) : null}
      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <p className="text-sm text-hubbay-secondary">You have no orders yet.</p>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-5 transition hover:border-hubbay-gold/40"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-hubbay-secondary">{order.orderNumber}</p>
                  <h3 className="text-lg font-semibold text-hubbay-text">{order.status}</h3>
                  <p className="text-sm text-hubbay-secondary">
                    {order.items.length} item(s) •{" "}
                    {new Date(order.createdAt).toLocaleString("en-NG")}
                  </p>
                </div>
                <p className="text-xl font-bold text-hubbay-gold">
                  {formatNairaFromKobo(order.totalKobo)}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
