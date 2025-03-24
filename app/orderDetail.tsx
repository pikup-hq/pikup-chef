import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
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

const ORDER_STAGES: OrderStatus[] = [
  "about_to_prepare",
  "in_preparation",
  "done",
  "on_the_way",
];

const getStageLabel = (stage: OrderStatus): string => {
  switch (stage) {
    case "about_to_prepare":
      return "About to be prepared";
    case "in_preparation":
      return "In preparation";
    case "done":
      return "Done";
    case "on_the_way":
      return "On the way";
    default:
      return stage;
  }
};

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id, orderData } = useLocalSearchParams();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order>(
    JSON.parse(orderData as string)
  );

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
      setCurrentOrder((prev) => ({
        ...prev,
        status: newStatus,
      }));
      SuccessToast("Order status updated");
    } catch (error) {
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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            router.back();
          } catch (error) {
            Alert.alert("Error", "Failed to reject order");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
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
            {ORDER_STAGES.map((stage) => (
              <TouchableOpacity
                key={stage}
                style={{
                  backgroundColor:
                    currentOrder.status === stage ? COLORS.primary : "#F8F8F8",
                  padding: 12,
                  borderRadius: 20,
                  opacity: updatingStatus ? 0.7 : 1,
                }}
                onPress={() => handleUpdateStatus(stage)}
                disabled={updatingStatus}
              >
                <SmallText
                  style={{
                    color:
                      currentOrder.status === stage ? "#FFFFFF" : "#000000",
                  }}
                >
                  {getStageLabel(stage)}
                </SmallText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}
