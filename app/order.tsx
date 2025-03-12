import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Bell } from "lucide-react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  MediumText,
  SmallText,
  SemiBoldText,
} from "@/components/common/AppText";
import OrderItem from "../components/OrderItem";
import NoDataView from "../components/NoDataView";
import { ordersData, Order } from "@/hooks/data/order";
import COLORS from "../constants/colors";

type OrderStatus = "pending" | "completed";

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOrders(ordersData);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") {
      return order.status !== "done";
    }
    return order.status === "done";
  });

  const pendingCount = orders.filter((order) => order.status !== "done").length;

  const handlePress = () => {};

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Spinner visible={loading} overlayColor="rgba(0, 0, 0, 0.7)" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 16,
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

        <View style={{ flex: 1, paddingBottom: 10 }}>
          <SemiBoldText style={{ fontSize: 16 }}>My Orders</SemiBoldText>
        </View>
      </View>

      {/* Order Status Tabs */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 20,
          paddingBottom: 0,
        }}
      >
        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity onPress={() => setActiveTab("pending")}>
            <View
              style={{
                backgroundColor:
                  activeTab === "pending" ? COLORS.primary : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <SmallText
                style={{
                  color: activeTab === "pending" ? "#FFFFFF" : "#000000",
                }}
              >
                Pending({pendingCount})
              </SmallText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab("completed")}>
            <View
              style={{
                backgroundColor:
                  activeTab === "completed" ? COLORS.primary : "transparent",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <SmallText
                style={{
                  color: activeTab === "completed" ? "#FFFFFF" : "#000000",
                }}
              >
                Completed
              </SmallText>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        {!loading && filteredOrders.length === 0 ? (
          <NoDataView message={`No ${activeTab} orders at the moment.`} />
        ) : (
          filteredOrders.map((order) => (
            <OrderItem
              key={order.id}
              foodName={order.items[0].name}
              description={order.items[0].description}
              price={order.items[0].price}
              image={order.items[0].image}
              timestamp={order.timestamp}
              onViewOrder={() =>
                router.push({
                  pathname: "/orderDetail",
                  params: { id: `${order.id}` },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
}
