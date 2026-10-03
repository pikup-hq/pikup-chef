import { format } from "date-fns";
import type { OrderLine, OrderStatus } from "@/types";

export const formatAmount = (amount: number | undefined | null): string =>
  new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

export const naira = (amount: number | undefined | null) => `₦${formatAmount(amount)}`;

export const formatDate = (value?: string) => {
  if (!value) return "";
  try {
    return format(new Date(value), "MMM dd, yyyy • HH:mm");
  } catch {
    return value;
  }
};

export const lineTotal = (line: OrderLine) => {
  const unit = line.unitPrice ?? line.product?.price ?? 0;
  const extras = (line.extras || []).reduce((sum, e) => sum + (e.price || 0), 0);
  return (unit + extras) * line.quantity;
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  created: "New order",
  in_the_kitchen: "In the kitchen",
  prepared: "Prepared",
  on_the_way: "On the way",
  completed: "Completed",
  cancelled: "Cancelled",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  created: "#FF7622",
  in_the_kitchen: "#2F80ED",
  prepared: "#9B51E0",
  on_the_way: "#F2994A",
  completed: "#27AE60",
  cancelled: "#828282",
  rejected: "#EB5757",
};

/** Statuses the vendor still has to act on or wait for. */
export const ACTIVE_STATUSES: OrderStatus[] = ["created", "in_the_kitchen", "prepared", "on_the_way"];
