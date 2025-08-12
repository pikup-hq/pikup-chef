import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { MapPin, Bell } from "lucide-react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  LargeText,
  MediumText,
  SmallText,
  SemiBoldText,
} from "@/components/common/AppText";
import OrderItem from "@/components/OrderItem";
import NoDataView from "@/components/NoDataView";
import { userData } from "@/hooks/data/user";
import { Order } from "@/hooks/data/order";
import COLORS from "../../constants/colors";
import Banner from "@/assets/svg/banner.svg";
import useAuthStore from "@/store/authStore";
import { UseAuth } from "@/hooks/apis";
import axios from "axios";
import { BASE_URL } from "@/config";
import { ErrorToast } from "@/components/common/Toasts";
import { format } from "date-fns";
import { AdvertisementBanner } from "@/components/AdvertismentBanner";
import { vendorAdvertisements } from "@/hooks/data/advert";
import { SafeAreaView } from "react-native-safe-area-context";
import Spacing from "@/constants/Spacing";

// Add this helper function at the top of the file
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export default function index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
    // First exclude rejected orders
    if (order.status === "rejected") {
      return false;
    }

    // Then filter by tab
    if (activeTab === "ongoing") {
      return order.status !== "completed";
    }
    return order.status === "completed";
  });
  const completedOrdersCount = orders.filter(
    (order) => order.status === "completed"
  ).length;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy • HH:mm");
    } catch (error) {
      console.log("Date parsing error:", error);
      return dateString;
    }
  };

  // Sort filteredOrders by createdAt (most recent first)
  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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
      <Spinner visible={loading} overlayColor="rgba(0, 0, 0, 0.7)" />

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
        <View style={{ marginRight: 7, borderRadius: 20, overflow: "hidden" }}>
          <Image
            source={{ uri: userInfo.avatar }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            resizeMode="cover"
          />
        </View>
        <View style={{ flex: 1 }}>
          <SemiBoldText style={{ marginBottom: -2 }}>
            {userInfo.firstName
              ? userInfo.firstName + " " + userInfo.lastName
              : userInfo.name}
          </SemiBoldText>
          <SmallText style={{ color: "#666666", fontSize: 12 }}>
            {userInfo.email}
          </SmallText>
        </View>
        <TouchableOpacity onPress={() => router.push("/order")}>
          <Bell size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 20 }}
      >
        {/* <Banner /> */}
        <AdvertisementBanner
          advertisements={vendorAdvertisements}
          autoScroll={true}
          scrollInterval={5000}
          height={150}
          borderRadius={12}
        />

        {/* Orders Section */}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              marginTop: 20,
            }}
          >
            {/* Tabs */}
            <View style={{ flexDirection: "row", gap: 16 }}>
              <TouchableOpacity onPress={() => setActiveTab("ongoing")}>
                <View
                  style={{
                    backgroundColor:
                      activeTab === "ongoing" ? COLORS.primary : "transparent",
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                  }}
                >
                  <SmallText
                    style={{
                      color: activeTab === "ongoing" ? "#FFFFFF" : "#000000",
                    }}
                  >
                    Ongoing
                  </SmallText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab("completed")}>
                <View
                  style={{
                    backgroundColor:
                      activeTab === "completed"
                        ? COLORS.primary
                        : "transparent",
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
                    Completed({completedOrdersCount})
                  </SmallText>
                </View>
              </TouchableOpacity>
            </View>

            {/* View All */}
            <View>
              <TouchableOpacity onPress={() => router.push("/order")}>
                <SmallText style={{ color: COLORS.secondary, fontSize: 12 }}>
                  View all
                </SmallText>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            {/* Orders List */}
            {!loading && sortedOrders.length === 0 ? (
              <NoDataView
                message={`No ${activeTab} orders at the moment. New orders will appear here.`}
              />
            ) : (
              sortedOrders.map((order) => (
                <OrderItem
                  key={order._id}
                  foodName={order.items[0].product.name}
                  description={order.items[0].product.description}
                  price={formatAmount(order.totalAmount)}
                  image={order.items[0].product.image}
                  timestamp={formatDate(order.createdAt)}
                  onViewOrder={() =>
                    router.push({
                      pathname: "/orderDetail",
                      params: {
                        id: order._id,
                        orderData: JSON.stringify(order),
                        orderID: order.orderId,
                      },
                    })
                  }
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
