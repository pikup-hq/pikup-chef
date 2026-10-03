import React, { useState, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { SmallText, SemiBoldText } from "@/components/common/AppText";
import OrderItem from "@/components/OrderItem";
import NoDataView from "@/components/NoDataView";
import NotificationBell from "@/components/NotificationBell";
import { AdvertisementBanner } from "@/components/AdvertismentBanner";
import { vendorAdvertisements } from "@/hooks/data/advert";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
import { ordersApi } from "@/services/orders";
import { getErrorMessage } from "@/services/api";
import { authApi } from "@/services/auth";
import { ErrorToast } from "@/components/common/Toasts";
import { naira } from "@/utilities/format";
import type { Order } from "@/types";

// Backup for missed pushes: check for new orders while Home is on screen.
const POLL_INTERVAL_MS = 20 * 1000;

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">("ongoing");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const initialised = useRef(false);

  const userInfo = useAuthStore((s) => s.userInfo);

  const detectNewOrders = (list: Order[]) => {
    const store = useNotificationStore.getState();
    const created = list.filter((o) => o.status === "created");
    if (!initialised.current) {
      // First load: don't ring for orders that were already waiting.
      store.markOrdersSeen(created.flatMap((o) => [o._id, o.orderId]));
      initialised.current = true;
      return;
    }
    const fresh = created.filter((o) => !store.seenOrderIds.has(o._id));
    if (fresh.length && !store.orderAlert) {
      const newest = fresh[0];
      const items = newest.items.reduce((sum, i) => sum + i.quantity, 0);
      store.showOrderAlert({
        orderId: newest.orderId,
        orderObjectId: newest._id,
        title: "New order received",
        message: `Order #${newest.orderId} • ${items} item${items === 1 ? "" : "s"} • ${naira(newest.totalAmount)}`,
      });
    }
    store.markOrdersSeen(fresh.flatMap((o) => [o._id, o.orderId]));
  };

  const loadOrders = useCallback(
    async (mode: "initial" | "refresh" | "silent" = "initial") => {
      if (!userInfo?._id) return;
      if (mode === "refresh") setRefreshing(true);
      try {
        const list = await ordersApi.list(userInfo._id, { limit: 50 });
        setOrders(list);
        detectNewOrders(list);
      } catch (error) {
        if (mode !== "silent") ErrorToast(getErrorMessage(error, "Failed to fetch orders"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userInfo?._id]
  );

  // Refresh the profile so an admin approval shows up without signing in again.
  useFocusEffect(
    useCallback(() => {
      authApi
        .me()
        .then((me) => useAuthStore.getState().updateUser({ moreDetails: me.moreDetails }))
        .catch(() => {});
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      loadOrders(orders.length ? "silent" : "initial");
      const timer = setInterval(() => loadOrders("silent"), POLL_INTERVAL_MS);
      return () => clearInterval(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadOrders])
  );

  const visibleOrders = orders.filter((order) => {
    if (order.status === "rejected" || order.status === "cancelled") return false;
    return activeTab === "ongoing" ? order.status !== "completed" : order.status === "completed";
  });
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const newCount = orders.filter((o) => o.status === "created").length;

  const displayName =
    userInfo?.name || [userInfo?.firstName, userInfo?.lastName].filter(Boolean).join(" ");

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
      edges={["left", "right"]}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#F4F4F4",
          marginTop: 10,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          style={{ marginRight: 7, borderRadius: 20, overflow: "hidden" }}
        >
          <Image
            source={{ uri: userInfo?.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.grey }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <SemiBoldText style={{ marginBottom: -2 }} numberOfLines={1}>
            {displayName}
          </SemiBoldText>
          <SmallText style={{ color: "#666666", fontSize: 12 }} numberOfLines={1}>
            {userInfo?.email}
          </SmallText>
        </View>
        <NotificationBell />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadOrders("refresh")} />
        }
      >
        {userInfo?.moreDetails && userInfo.moreDetails.verified === false && (
          <View
            style={{
              backgroundColor: "#FFF7E6",
              borderColor: "#F5C26B",
              borderWidth: 1,
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
            }}
          >
            <SemiBoldText style={{ color: "#8A5300" }}>Waiting for verification</SemiBoldText>
            <SmallText style={{ color: "#8A5300", marginTop: 4, lineHeight: 18 }}>
              The Pikup team is reviewing your restaurant. Customers can&apos;t see you until you&apos;re approved. Add your
              menu now so you&apos;re ready to go.
            </SmallText>
          </View>
        )}

        <AdvertisementBanner
          advertisements={vendorAdvertisements}
          autoScroll={true}
          scrollInterval={5000}
          height={150}
          borderRadius={12}
        />

        {newCount > 0 && (
          <View
            style={{
              marginTop: 16,
              backgroundColor: COLORS.lightOrange,
              borderRadius: 10,
              padding: 12,
            }}
          >
            <SmallText style={{ color: COLORS.secondary }}>
              {newCount} new order{newCount === 1 ? "" : "s"} waiting for you to accept
            </SmallText>
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            marginTop: 20,
          }}
        >
          <View style={{ flexDirection: "row", gap: 16 }}>
            {(["ongoing", "completed"] as const).map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <View
                  style={{
                    backgroundColor: activeTab === tab ? COLORS.primary : "transparent",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}
                >
                  <SmallText style={{ color: activeTab === tab ? "#FFFFFF" : "#000000" }}>
                    {tab === "ongoing" ? "Ongoing" : `Completed (${completedCount})`}
                  </SmallText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => router.push("/order")}>
            <SmallText style={{ color: COLORS.secondary, fontSize: 12 }}>View all</SmallText>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 30 }} />
        ) : visibleOrders.length === 0 ? (
          <NoDataView
            message={`No ${activeTab} orders at the moment. New orders will appear here.`}
          />
        ) : (
          visibleOrders.map((order) => (
            <OrderItem
              key={order._id}
              order={order}
              onViewOrder={() =>
                router.push({ pathname: "/orderDetail", params: { id: order._id } })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
