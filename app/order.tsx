import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
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
import { Order } from "@/hooks/data/order";
import COLORS from "../constants/colors";
import { UseAuth } from "@/hooks/apis";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import { BASE_URL } from "@/config";
import { ErrorToast } from "@/components/common/Toasts";
import Spacing from "@/constants/Spacing";

type OrderStatus = "pending" | "completed";

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OrderStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  const user = useAuthStore((state) => state.userInfo);
  const token = useAuthStore((state) => state.token);
  const userInfo = JSON.parse(user);

  const getOrders = () => {
    setLoading(true);
    console.log("Token:", token);
    console.log("ID:", userInfo._id);

    axios
      .get(`${BASE_URL}/order/vendor/${userInfo._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Orders:", response.data);
        setOrders(response.data.order || []);
      })
      .catch((error) => {
        ErrorToast("Failed to fetch orders");
        console.error("Get Orders Error:", error.response?.data);
      })
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, [])
  );

  const filteredOrders = orders.filter((order) => {
    // First check if order is rejected
    if (order.status === "rejected") {
      return false;
    }

    // Then filter by tab status
    if (activeTab === "pending") {
      return order.status !== "completed";
    }
    return order.status === "completed";
  });

  // Update pending count to exclude rejected orders
  const pendingCount = orders.filter(
    (order) => order.status !== "completed" && order.status !== "rejected"
  ).length;

  const handlePress = () => {};

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
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
              key={order._id}
              foodName={order.items[0].name}
              description={order.items[0].description}
              price={order.items[0].price}
              image={order.items[0].image}
              timestamp={order.createdAt}
              onViewOrder={() =>
                router.push({
                  pathname: "/orderDetail",
                  params: {
                    id: order._id,
                    orderData: JSON.stringify(order),
                    orderID: order.orderId, // Pass the full order data
                  },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
