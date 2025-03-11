import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
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
import { ordersData, Order } from "@/hooks/data/order";
import COLORS from "../../constants/colors";
import Banner from "@/assets/svg/banner.svg";

export default function index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "ongoing"
  );
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

  const filteredOrders = orders.filter((order) => order.status === activeTab);
  const completedOrdersCount = orders.filter(
    (order) => order.status === "completed"
  ).length;

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Spinner visible={loading} overlayColor="rgba(0, 0, 0, 0.7)" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#F4F4F4",
          marginTop: 10,
        }}
      >
        <Image
          source={{ uri: userData.logo }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
          }}
        />
        <View style={{ flex: 1 }}>
          <SemiBoldText style={{ marginBottom: -2 }}>
            {userData.businessName}
          </SemiBoldText>
          <SmallText style={{ color: "#666666", fontSize: 12 }}>
            {userData.email}
          </SmallText>
        </View>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <MapPin size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/notifications")}>
          <Bell size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 20 }}
      >
        {/* Welcome Banner */}
        <Banner/>

        {/* Orders Section */}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
              marginTop: 20
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
                    ongoing
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
                <SmallText style={{ color: COLORS.primary, fontSize: 12 }}>
                  View all
                </SmallText>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            {/* Orders List */}
            {!loading && filteredOrders.length === 0 ? (
              <NoDataView
                message={`No ${activeTab} orders at the moment. New orders will appear here.`}
              />
            ) : (
              filteredOrders.map((order) => (
                <OrderItem
                  key={order.id}
                  foodName={order.foodName}
                  description={order.description}
                  price={order.price}
                  image={order.image}
                  timestamp={order.timestamp}
                  // onViewOrder={() => router.push(`/orders/${order.id}`)}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </AppSafeAreaView>
  );
}
