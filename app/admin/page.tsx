import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

import { AdminOrders } from "@/components/admin/admin-orders";
import { getAuthSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin | HubBay",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@hubbay.com").toLowerCase();
  const isAdmin =
    session.user.role === Role.ADMIN ||
    (session.user.email && session.user.email.toLowerCase() === adminEmail);

  if (!isAdmin) {
    redirect("/");
  }

  const orders = isDatabaseConfigured
    ? await prisma.order.findMany({
        include: {
          user: true,
          items: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      })
    : [];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <p className="text-xs uppercase tracking-[0.25em] text-hubbay-gold">Admin Console</p>
      <h1 className="mt-2 text-4xl font-black text-hubbay-text">Live Order Control</h1>
      <p className="mt-2 text-sm text-hubbay-secondary">
        Update statuses in real time. Customers see these changes instantly on their tracker.
      </p>
      {!isDatabaseConfigured ? (
        <p className="mt-3 text-sm text-hubbay-gold">
          Demo mode active: connect `DATABASE_URL` to view and manage live orders.
        </p>
      ) : null}
      <div className="mt-8">
        <AdminOrders initialOrders={orders} />
      </div>
    </main>
  );
}
