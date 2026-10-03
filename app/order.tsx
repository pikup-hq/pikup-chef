import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { SmallText } from "@/components/common/AppText";
import OrderItem from "@/components/OrderItem";
import NoDataView from "@/components/NoDataView";
import ScreenHeader from "@/components/ScreenHeader";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import useAuthStore from "@/store/authStore";
import { ordersApi } from "@/services/orders";
import { getErrorMessage } from "@/services/api";
import { ErrorToast } from "@/components/common/Toasts";
import { ACTIVE_STATUSES } from "@/utilities/format";
import type { Order } from "@/types";

type Tab = "pending" | "completed" | "rejected";

const TAB_STATUS: Record<Tab, string> = {
  pending: ACTIVE_STATUSES.join(","),
  completed: "completed",
  rejected: "rejected,cancelled",
};

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const userInfo = useAuthStore((s) => s.userInfo);

  const load = useCallback(
    async (tab: Tab, isRefresh = false) => {
      if (!userInfo?._id) return;
      isRefresh ? setRefreshing(true) : setLoading(true);
      try {
        setOrders(await ordersApi.list(userInfo._id, { status: TAB_STATUS[tab], limit: 100 }));
      } catch (error) {
        ErrorToast(getErrorMessage(error, "Failed to fetch orders"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userInfo?._id]
  );

  useFocusEffect(
    useCallback(() => {
      load(activeTab);
    }, [load, activeTab])
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <ScreenHeader title="My Orders" />

      <View style={{ flexDirection: "row", gap: 12, paddingVertical: 16 }}>
        {(Object.keys(TAB_STATUS) as Tab[]).map((tab) => (
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
                {tab[0].toUpperCase() + tab.slice(1)}
              </SmallText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(activeTab, true)} />
          }
          ListEmptyComponent={<NoDataView message={`No ${activeTab} orders at the moment.`} />}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              onViewOrder={() =>
                router.push({ pathname: "/orderDetail", params: { id: item._id } })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
