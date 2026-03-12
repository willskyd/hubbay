"use client";

import { OrderStatus } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";

import { ORDER_STATUS_STEPS } from "@/lib/constants";

type TimelinePoint = {
  id: string;
  status: OrderStatus;
  note: string | null;
  createdAt: string;
};

type TrackerData = {
  id: string;
  status: OrderStatus;
  etaMinutes: number;
  updatedAt: string;
  timeline: TimelinePoint[];
};

const labels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PREPARING: "Preparing",
  READY: "Ready",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function OrderTracker({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [timeline, setTimeline] = useState<TimelinePoint[]>([]);
  const [eta, setEta] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const response = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as TrackerData;
      if (!mounted) return;
      setStatus(data.status);
      setTimeline(data.timeline);
      setEta(data.etaMinutes);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [orderId]);

  const currentStep = useMemo(
    () => ORDER_STATUS_STEPS.findIndex((step) => step === status),
    [status],
  );

  return (
    <div className="space-y-5 rounded-3xl border border-hubbay-gold/20 bg-hubbay-surface/70 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-hubbay-text">Live Tracking</h3>
        <p className="text-sm text-hubbay-secondary">ETA: {eta} mins</p>
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        {ORDER_STATUS_STEPS.map((step, index) => {
          const active = index <= currentStep;
          return (
            <div
              key={step}
              className={`rounded-2xl border px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider ${
                active
                  ? "border-hubbay-gold bg-hubbay-gold/15 text-hubbay-gold"
                  : "border-hubbay-gold/20 text-hubbay-secondary"
              }`}
            >
              {labels[step]}
            </div>
          );
        })}
      </div>
      <div className="space-y-2 text-sm">
        {timeline.map((entry) => (
          <div
            key={entry.id}
            className="rounded-xl border border-hubbay-gold/15 bg-hubbay-background/30 p-3"
          >
            <p className="font-semibold text-hubbay-text">{labels[entry.status]}</p>
            <p className="text-xs text-hubbay-secondary">
              {new Date(entry.createdAt).toLocaleString("en-NG")}
            </p>
            {entry.note ? <p className="mt-1 text-xs text-hubbay-secondary">{entry.note}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
