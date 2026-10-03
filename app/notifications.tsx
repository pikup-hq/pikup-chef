import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Bell, ShoppingBag, Wallet, Info } from "lucide-react-native";
import { SmallText, SemiBoldText } from "@/components/common/AppText";
import ScreenHeader from "@/components/ScreenHeader";
import NoDataView from "@/components/NoDataView";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import { ErrorToast } from "@/components/common/Toasts";
import { notificationsApi } from "@/services/notifications";
import { getErrorMessage } from "@/services/api";
import useNotificationStore from "@/store/notificationStore";
import { formatDate } from "@/utilities/format";
import type { AppNotification } from "@/types";

const iconFor = (type: string) => {
  if (type.startsWith("order") || type === "delivery_update") return ShoppingBag;
  if (type === "wallet_credit" || type === "withdrawal_update" || type.startsWith("payment")) return Wallet;
  return Info;
};

export default function NotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const { refreshUnread, setUnread } = useNotificationStore.getState();

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const result = await notificationsApi.list(1);
      setItems(result.data);
      setPage(1);
      setPages(result.pages);
      refreshUnread();
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not load notifications"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshUnread]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const loadMore = async () => {
    if (loadingMore || page >= pages) return;
    setLoadingMore(true);
    try {
      const next = await notificationsApi.list(page + 1);
      setItems((prev) => [...prev, ...next.data]);
      setPage(page + 1);
      setPages(next.pages);
    } catch {
      // ignore; user can scroll again
    } finally {
      setLoadingMore(false);
    }
  };

  const open = async (item: AppNotification) => {
    if (!item.read) {
      setItems((prev) => prev.map((n) => (n._id === item._id ? { ...n, read: true } : n)));
      setUnread(useNotificationStore.getState().unreadCount - 1);
      notificationsApi.markRead(item._id).catch(() => {});
    }
    if (item.entityType === "Order" && item.relatedEntity) {
      router.push({ pathname: "/orderDetail", params: { id: item.relatedEntity } });
    } else if (item.type === "wallet_credit" || item.type === "withdrawal_update") {
      router.push("/(tabs)/wallet");
    }
  };

  const markAll = async () => {
    try {
      await notificationsApi.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnread(0);
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not mark notifications as read"));
    }
  };

  const hasUnread = items.some((n) => !n.read);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <ScreenHeader
        title="Notifications"
        right={
          hasUnread ? (
            <TouchableOpacity onPress={markAll} hitSlop={10}>
              <SmallText style={{ color: COLORS.secondary, fontSize: 13 }}>Mark all read</SmallText>
            </TouchableOpacity>
          ) : undefined
        }
      />

      {loading ? (
        <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => n._id}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={COLORS.secondary} /> : null}
          ListEmptyComponent={
            <NoDataView message="You're all caught up" icon={<Bell size={48} color="#CCCCCC" />} />
          }
          renderItem={({ item }) => {
            const Icon = iconFor(item.type);
            return (
              <TouchableOpacity
                onPress={() => open(item)}
                style={{
                  flexDirection: "row",
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 10,
                  backgroundColor: item.read ? "#FFFFFF" : COLORS.lightOrange,
                  borderWidth: 1,
                  borderColor: item.read ? "#F0F0F0" : "transparent",
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "#FFFFFF",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Icon size={18} color={COLORS.secondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <SemiBoldText style={{ fontSize: 14 }}>{item.title}</SemiBoldText>
                  <SmallText style={{ color: "#555", fontSize: 13, marginTop: 2 }}>{item.message}</SmallText>
                  <SmallText style={{ color: "#999", fontSize: 11, marginTop: 4 }}>{formatDate(item.createdAt)}</SmallText>
                </View>
                {!item.read && (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary, marginTop: 6 }} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
