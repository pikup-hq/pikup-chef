import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Bell, Phone } from "lucide-react-native";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  LargeText,
  MediumText,
  SmallText,
  SemiBoldText,
} from "@/components/common/AppText";
import { Order, OrderStatus } from "@/hooks/data/order";
import COLORS from "@/constants/colors";
import { User } from "iconsax-react-native";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import axios from "axios";
import { BASE_URL } from "@/config";
import useAuthStore from "@/store/authStore";
import Spacing from "@/constants/Spacing";

const ORDER_STAGES: OrderStatus[] = [
  "created",
  "in_the_kitchen",
  "prepared",
  "completed",
];

const getStageLabel = (stage: OrderStatus): string => {
  switch (stage) {
    case "created":
      return "Order Created";
    case "in_the_kitchen":
      return "In the kitchen";
    case "prepared":
      return "Prepared";
    case "completed":
      return "Completed";
    default:
      return stage;
  }
};

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id, orderData, orderID } = useLocalSearchParams();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order>(() => {
    const parsedOrder = JSON.parse(orderData as string);
    return {
      ...parsedOrder,
      orderId: parsedOrder.orderId || orderID, // Parse orderID
      status: parsedOrder.status || "in_the_kitchen",
    };
  });

  const user = useAuthStore((state) => state.userInfo);
  const token = useAuthStore((state) => state.token);

  if (!currentOrder) {
    return (
      <AppSafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <MediumText style={{}}>Order not found</MediumText>
      </AppSafeAreaView>
    );
  }

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(true);
      console.log("Updating order:", currentOrder.orderId);

      const response = await axios({
        method: "put",
        url: `${BASE_URL}/order/${currentOrder.orderId}/status`,
        data: { status: newStatus },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Status Update Response:", response.data);

      setCurrentOrder((prev) => ({
        ...prev,
        status: newStatus,
      }));

      SuccessToast("Order status updated");
    } catch (error: any) {
      console.error("Status Update Error:", error.response?.data);
      ErrorToast("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleRejectOrder = async () => {
    Alert.alert("Reject Order", "Are you sure you want to reject this order?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reject",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);

            const response = await axios({
              method: "put",
              url: `${BASE_URL}/order/${currentOrder.orderId}/status`,
              data: { status: "rejected" },
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            console.log("Status Update Response:", response.data);
            SuccessToast("Order rejected successfully");
            router.back();
          } catch (error: any) {
            console.error("Reject Order Error:", error.response?.data);
            ErrorToast(error.response?.data?.error || "Failed to reject order");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 16,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#F4F4F4",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <SemiBoldText style={{ fontSize: 16 }}>View order</SemiBoldText>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16 }}
      >
        {/* Order Items */}
        <View style={{ marginBottom: 15 }}>
          <SemiBoldText style={{ marginBottom: 12, fontSize: 13 }}>
            Food ordered
          </SemiBoldText>
          {currentOrder.items.map((item) => (
            <View
              key={item.product.id}
              style={{
                flexDirection: "row",
                marginBottom: 16,
                backgroundColor: "#F8F8F8",
                padding: 12,
                borderRadius: 12,
              }}
            >
              <Image
                source={{ uri: item.product.image }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  marginRight: 12,
                }}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <SemiBoldText style={{ fontSize: 15 }}>
                    {item.product.name}
                  </SemiBoldText>
                  <MediumText style={{ fontSize: 14 }}>
                    {item.quantity} {item.quantity > 1 ? "pieces" : "piece"}
                  </MediumText>
                </View>
                <SmallText style={{ color: "#666666", fontSize: 13 }}>
                  {item.product.description}
                </SmallText>
                <MediumText style={{ marginTop: 5, fontSize: 14 }}>
                  ₦{item.product.price}
                </MediumText>
              </View>
            </View>
          ))}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingTop: 5,
              borderTopWidth: 1,
              borderTopColor: "#F4F4F4",
            }}
          >
            <SemiBoldText style={{}}>Total Amount</SemiBoldText>
            <LargeText style={{ fontSize: 17 }}>
              ₦{currentOrder.totalAmount.toFixed(2)}
            </LargeText>
          </View>
        </View>

        {/* Rider's Info */}
        <View style={{ marginBottom: 24 }}>
          <SemiBoldText style={{ marginBottom: 12 }}>Rider's info</SemiBoldText>
          <View
            style={{
              backgroundColor: "#F8F8F8",
              padding: 8,
              borderRadius: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <User size={16} color="#666666" />
              {/* Hello world */}
              <SmallText style={{ fontSize: 15 }}>Pikup</SmallText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Phone size={16} color="#666666" />
              <SmallText style={{ marginLeft: 8, fontSize: 15 }}>
                0808 851 3703
              </SmallText>
            </View>
          </View>
        </View>

        {/* Reject Order Button */}
        <View style={{ marginBottom: 24 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              padding: 10,
              borderRadius: 8,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
            onPress={handleRejectOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <SemiBoldText style={{ color: "#FFFFFF" }}>
                Reject Order
              </SemiBoldText>
            )}
          </TouchableOpacity>
        </View>

        {/* Order Stages */}
        <View>
          <MediumText style={{ marginBottom: 12 }}>Stage of order</MediumText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {ORDER_STAGES.map((stage) => {
              const isCurrentStage = currentOrder.status === stage;
              const isPastStage =
                ORDER_STAGES.indexOf(stage) <=
                ORDER_STAGES.indexOf(currentOrder.status);

              return (
                <TouchableOpacity
                  key={stage}
                  style={{
                    backgroundColor: isCurrentStage
                      ? COLORS.primary
                      : "#F8F8F8",
                    padding: 12,
                    borderRadius: 20,
                    opacity: updatingStatus ? 0.7 : 1,
                  }}
                  onPress={() => handleUpdateStatus(stage)}
                  disabled={
                    updatingStatus || currentOrder.status === "rejected"
                  }
                >
                  <SmallText
                    style={{
                      color: isCurrentStage ? "#FFFFFF" : "#000000",
                    }}
                  >
                    {getStageLabel(stage)}
                  </SmallText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
