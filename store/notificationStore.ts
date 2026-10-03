import { create } from "zustand";
import { notificationsApi } from "@/services/notifications";

export interface OrderAlert {
  orderId: string; // human order number
  orderObjectId?: string; // Mongo _id, used for navigation when present
  title: string;
  message: string;
}

interface NotificationState {
  unreadCount: number;
  orderAlert: OrderAlert | null;
  seenOrderIds: Set<string>;
  refreshUnread: () => Promise<void>;
  setUnread: (count: number) => void;
  showOrderAlert: (alert: OrderAlert) => void;
  dismissOrderAlert: () => void;
  markOrdersSeen: (ids: string[]) => void;
  reset: () => void;
}

const useNotificationStore = create<NotificationState>((set, get) => ({
  unreadCount: 0,
  orderAlert: null,
  seenOrderIds: new Set(),

  refreshUnread: async () => {
    try {
      set({ unreadCount: await notificationsApi.unreadCount() });
    } catch {
      // Non-critical; keep the previous count.
    }
  },

  setUnread: (count) => set({ unreadCount: Math.max(0, count) }),

  showOrderAlert: (alert) => {
    const seen = new Set(get().seenOrderIds);
    seen.add(alert.orderObjectId || alert.orderId);
    seen.add(alert.orderId);
    set({ orderAlert: alert, seenOrderIds: seen });
  },

  dismissOrderAlert: () => set({ orderAlert: null }),

  markOrdersSeen: (ids) => {
    const seen = new Set(get().seenOrderIds);
    ids.forEach((id) => seen.add(id));
    set({ seenOrderIds: seen });
  },

  reset: () => set({ unreadCount: 0, orderAlert: null, seenOrderIds: new Set() }),
}));

export default useNotificationStore;
