import React, { useCallback, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  Linking,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Phone, MapPin, Bike, User as UserIcon } from "lucide-react-native";
import { MediumText, SmallText, SemiBoldText, LargeText } from "@/components/common/AppText";
import ScreenHeader from "@/components/ScreenHeader";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { ordersApi } from "@/services/orders";
import { getErrorMessage } from "@/services/api";
import { STATUS_COLORS, STATUS_LABELS, formatDate, lineTotal, naira } from "@/utilities/format";
import type { Order, OrderStatus, Person } from "@/types";

const NEXT_ACTION: Partial<Record<OrderStatus, { status: OrderStatus; label: string; confirm: string }>> = {
  created: {
    status: "in_the_kitchen",
    label: "Accept & start cooking",
    confirm: "Accept this order and move it to the kitchen?",
  },
  in_the_kitchen: {
    status: "prepared",
    label: "Mark as prepared",
    confirm: "Is this order ready for the rider to pick up?",
  },
};

const STATUS_HINT: Partial<Record<OrderStatus, string>> = {
  prepared: "Waiting for the rider to pick up this order.",
  on_the_way: "The rider is delivering this order.",
  completed: "Delivered. Your earnings have been added to your wallet.",
  rejected: "You rejected this order. The customer is being refunded.",
  cancelled: "This order was cancelled.",
};

const STAGES: OrderStatus[] = ["created", "in_the_kitchen", "prepared", "on_the_way", "completed"];

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
    {bold ? <SemiBoldText>{label}</SemiBoldText> : <SmallText style={{ color: "#666" }}>{label}</SmallText>}
    {bold ? <SemiBoldText>{value}</SemiBoldText> : <SmallText>{value}</SmallText>}
  </View>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={{ marginBottom: 20 }}>
    <SemiBoldText style={{ marginBottom: 10, fontSize: 13 }}>{title}</SemiBoldText>
    <View style={{ backgroundColor: "#F8F8F8", padding: 12, borderRadius: 12 }}>{children}</View>
  </View>
);

const call = (phone?: string) => {
  if (!phone) return ErrorToast("No phone number available");
  Linking.openURL(`tel:${phone}`);
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [rider, setRider] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [working, setWorking] = useState(false);

  const load = useCallback(
    async (isRefresh = false) => {
      if (!id) return;
      if (isRefresh) setRefreshing(true);
      try {
        const data = await ordersApi.get(String(id));
        setOrder(data.order);
        setRider(data.rider);
      } catch (error) {
        ErrorToast(getErrorMessage(error, "Could not load order"));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
        <ActivityIndicator color={COLORS.secondary} />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingHorizontal: Spacing * 2, paddingTop: (StatusBar.currentHeight ?? 20) + 5 }}>
        <ScreenHeader title="View order" />
        <MediumText style={{ marginTop: 40, textAlign: "center" }}>Order not found</MediumText>
      </SafeAreaView>
    );
  }

  const action = NEXT_ACTION[order.status];
  const canReject = order.status === "created" || order.status === "in_the_kitchen";

  const advance = () => {
    if (!action) return;
    Alert.alert(action.label, action.confirm, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          setWorking(true);
          try {
            const updated = await ordersApi.updateStatus(order.orderId, action.status);
            setOrder((prev) => (prev ? { ...prev, status: updated?.status || action.status } : prev));
            SuccessToast(`Order is now ${STATUS_LABELS[action.status].toLowerCase()}`);
          } catch (error) {
            ErrorToast(getErrorMessage(error, "Failed to update order status"));
            load();
          } finally {
            setWorking(false);
          }
        },
      },
    ]);
  };

  const reject = () => {
    Alert.alert(
      "Reject order",
      "The customer will be refunded and the order cancelled. This can't be undone.",
      [
        { text: "Keep order", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            setWorking(true);
            try {
              await ordersApi.reject(order.orderId);
              setOrder((prev) => (prev ? { ...prev, status: "rejected" } : prev));
              SuccessToast("Order rejected. The customer will be refunded.");
            } catch (error) {
              ErrorToast(getErrorMessage(error, "Failed to reject order"));
            } finally {
              setWorking(false);
            }
          },
        },
      ]
    );
  };

  const stageIndex = STAGES.indexOf(order.status);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <ScreenHeader title={`Order #${order.orderId}`} subtitle={formatDate(order.createdAt)} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
      >
        {/* Status */}
        <View
          style={{
            backgroundColor: `${STATUS_COLORS[order.status]}15`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 20,
          }}
        >
          <SemiBoldText style={{ color: STATUS_COLORS[order.status] }}>
            {STATUS_LABELS[order.status]}
          </SemiBoldText>
          {!!STATUS_HINT[order.status] && (
            <SmallText style={{ color: "#555", marginTop: 4 }}>{STATUS_HINT[order.status]}</SmallText>
          )}
          {stageIndex >= 0 && (
            <View style={{ flexDirection: "row", gap: 4, marginTop: 10 }}>
              {STAGES.map((stage, i) => (
                <View
                  key={stage}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: i <= stageIndex ? STATUS_COLORS[order.status] : "#E0E0E0",
                  }}
                />
              ))}
            </View>
          )}
        </View>

        {/* Items */}
        <Card title="Food ordered">
          {order.items.map((item, index) => (
            <View
              key={`${item.product?._id || "item"}-${index}`}
              style={{
                flexDirection: "row",
                paddingVertical: 8,
                borderBottomWidth: index === order.items.length - 1 ? 0 : 1,
                borderBottomColor: "#EEE",
              }}
            >
              <Image
                source={item.product?.image ? { uri: item.product.image } : undefined}
                style={{ width: 56, height: 56, borderRadius: 8, marginRight: 12, backgroundColor: COLORS.grey }}
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <SemiBoldText style={{ flex: 1, fontSize: 14 }} numberOfLines={2}>
                    {item.quantity} × {item.product?.name || "Item unavailable"}
                  </SemiBoldText>
                  <MediumText style={{ fontSize: 13 }}>{naira(lineTotal(item))}</MediumText>
                </View>
                {(item.extras || []).map((extra, i) => (
                  <SmallText key={`${extra.name}-${i}`} style={{ color: "#666", fontSize: 12 }}>
                    + {extra.name} ({naira(extra.price)})
                  </SmallText>
                ))}
              </View>
            </View>
          ))}
          <View style={{ borderTopWidth: 1, borderTopColor: "#E5E5E5", marginTop: 8, paddingTop: 4 }}>
            {!!order.subtotal && <Row label="Food subtotal" value={naira(order.subtotal)} />}
            {!!order.deliveryFee && <Row label="Delivery" value={naira(order.deliveryFee)} />}
            {!!order.serviceFee && <Row label="Service fee" value={naira(order.serviceFee)} />}
            {!!order.discountAmount && <Row label="Discount" value={`-${naira(order.discountAmount)}`} />}
            <Row label="Customer paid" value={naira(order.totalAmount)} bold />
            {!!order.vendorPayout && (
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
                <SmallText style={{ color: "#27AE60" }}>Your earnings</SmallText>
                <LargeText style={{ fontSize: 16, color: "#27AE60" }}>{naira(order.vendorPayout)}</LargeText>
              </View>
            )}
          </View>
        </Card>

        {/* Customer */}
        <Card title="Customer">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <UserIcon size={16} color="#666" />
            <SmallText style={{ fontSize: 15 }}>{order.user?.name || "Customer"}</SmallText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 8 }}>
            <MapPin size={16} color="#666" />
            <SmallText style={{ flex: 1, fontSize: 14 }}>{order.address}</SmallText>
          </View>
          {!!order.user?.phone && (
            <TouchableOpacity
              onPress={() => call(order.user?.phone)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}
            >
              <Phone size={16} color={COLORS.secondary} />
              <SmallText style={{ fontSize: 15, color: COLORS.secondary }}>{order.user.phone}</SmallText>
            </TouchableOpacity>
          )}
        </Card>

        {/* Rider */}
        <Card title="Rider">
          {rider ? (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Bike size={16} color="#666" />
                <SmallText style={{ fontSize: 15 }}>{rider.name}</SmallText>
              </View>
              {!!rider.phone && (
                <TouchableOpacity
                  onPress={() => call(rider.phone)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}
                >
                  <Phone size={16} color={COLORS.secondary} />
                  <SmallText style={{ fontSize: 15, color: COLORS.secondary }}>{rider.phone}</SmallText>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <SmallText style={{ color: "#666" }}>
              No rider assigned yet. Contact Pikup support to get a rider.
            </SmallText>
          )}
        </Card>
      </ScrollView>

      {(action || canReject) && (
        <View style={{ paddingVertical: 12, gap: 10, borderTopWidth: 1, borderTopColor: "#F4F4F4" }}>
          {action && (
            <TouchableOpacity
              onPress={advance}
              disabled={working}
              style={{
                backgroundColor: COLORS.primary,
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                opacity: working ? 0.7 : 1,
              }}
            >
              {working ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <SemiBoldText style={{ color: "#FFF" }}>{action.label}</SemiBoldText>
              )}
            </TouchableOpacity>
          )}
          {canReject && (
            <TouchableOpacity onPress={reject} disabled={working} style={{ alignItems: "center", padding: 8 }}>
              <SemiBoldText style={{ color: "#EB5757" }}>Reject order</SemiBoldText>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
