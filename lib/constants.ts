import {
  DishCategory,
  OrderStatus,
  OrderType,
  PaymentStatus,
} from "@prisma/client";

export const LAGOS_ADDRESS =
  "27B Admiralty Way, Lekki Phase 1, Lagos, Nigeria";
export const HUBBAY_PHONE = "+2348123456789";

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.DELIVERED,
];

export const categoryLabels: Record<DishCategory, string> = {
  STARTERS: "Starters",
  MAINS: "Mains",
  GRILLS: "Grills",
  BOWLS: "Bowls",
  SIDES: "Sides",
  DESSERTS: "Desserts",
  DRINKS: "Drinks",
};

export const orderTypeLabel: Record<OrderType, string> = {
  PICKUP: "Pickup",
  DELIVERY: "Delivery",
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  UNPAID: "Unpaid",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
  FAILED: "Failed",
};
