"use client";

import { OrderStatus, OrderType } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatNairaFromKobo } from "@/lib/utils";

type AdminOrder = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  orderType: OrderType;
  totalKobo: number;
  createdAt: string | Date;
  user: { name: string | null; email: string | null };
  items: { id: string; dishName: string; quantity: number }[];
};

export function AdminOrders({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setLoadingId(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) return;
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (orders.length === 0) {
    return <p className="text-sm text-hubbay-secondary">No orders yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-hubbay-gold/25 bg-hubbay-surface/80">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-hubbay-background/90">
            <tr className="border-b border-hubbay-divider">
              <th className="px-4 py-3 text-left font-semibold text-hubbay-secondary">Order</th>
              <th className="px-4 py-3 text-left font-semibold text-hubbay-secondary">Customer</th>
              <th className="px-4 py-3 text-left font-semibold text-hubbay-secondary">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-hubbay-secondary">Items</th>
              <th className="px-4 py-3 text-left font-semibold text-hubbay-secondary">Total</th>
              <th className="px-4 py-3 text-left font-semibold text-hubbay-secondary">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-hubbay-secondary">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-hubbay-divider/70 align-top last:border-b-0">
                <td className="px-4 py-4">
                  <p className="font-semibold text-hubbay-text">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-hubbay-secondary">{order.id}</p>
                </td>
                <td className="px-4 py-4 text-hubbay-text">
                  {order.user.name || order.user.email || "Guest"}
                </td>
                <td className="px-4 py-4 text-hubbay-text">{order.orderType}</td>
                <td className="px-4 py-4">
                  <div className="flex max-w-xs flex-wrap gap-1.5">
                    {order.items.map((item) => (
                      <span
                        key={item.id}
                        className="rounded-full border border-hubbay-gold/25 bg-hubbay-background px-2 py-0.5 text-xs text-hubbay-secondary"
                      >
                        {item.quantity}x {item.dishName}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-hubbay-gold">
                  {formatNairaFromKobo(order.totalKobo)}
                </td>
                <td className="px-4 py-4 text-hubbay-secondary">
                  {new Date(order.createdAt).toLocaleString("en-NG")}
                </td>
                <td className="px-4 py-4">
                  <div className="mb-2 rounded-full border border-hubbay-gold/30 bg-hubbay-background px-2 py-0.5 text-center text-xs font-semibold text-hubbay-emerald">
                    {order.status}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.values(OrderStatus).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={order.status === status ? "default" : "outline"}
                        disabled={loadingId === order.id}
                        onClick={() => updateStatus(order.id, status)}
                        className="h-7 px-2 text-[10px]"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
