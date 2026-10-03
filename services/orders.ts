import api from "./api";
import type { Order, OrderStatus, Person } from "@/types";

export const ordersApi = {
  list: (vendorId: string, params: { status?: string; page?: number; limit?: number } = {}) =>
    api
      .get(`/order/vendor/${vendorId}`, { params })
      .then((r) => (r.data.order || []) as Order[]),
  get: (id: string) =>
    api
      .get(`/order/${id}`)
      .then((r) => r.data as { order: Order; rider: Person | null }),
  updateStatus: (orderId: string, status: OrderStatus) =>
    api.put(`/order/${orderId}/status`, { status }).then((r) => r.data.order as Order),
  reject: (orderId: string) =>
    api.put(`/order/${orderId}/reject-order`).then((r) => r.data.order as Order),
};
