import { OrderStatus, OrderType } from "@prisma/client";

export const DELIVERY_FEE_KOBO = 2500;

export function estimateEtaMinutes(orderType: OrderType, dishCount: number) {
  const base = orderType === OrderType.DELIVERY ? 45 : 25;
  return base + Math.min(20, dishCount * 3);
}

export function nextOrderStatus(status: OrderStatus): OrderStatus {
  if (status === OrderStatus.PENDING) return OrderStatus.PREPARING;
  if (status === OrderStatus.PREPARING) return OrderStatus.READY;
  if (status === OrderStatus.READY) return OrderStatus.DELIVERED;
  return status;
}
