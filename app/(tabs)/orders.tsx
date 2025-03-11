import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { AppRareBgView } from "@/components/common/AppViews";
import { LargeText, MediumText } from "@/components/common/AppText";
import { Info } from "lucide-react-native";
import COLORS from "@/constants/colors";
import { useRouter } from "expo-router";

// Mock data for orders
type Order = {
  id: string;
  restaurantName: string;
  date: string;
  time: string;
  image: string;
  status: "ongoing" | "completed";
};

const orders: Order[] = [
  {
    id: "1",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "completed",
  },
  {
    id: "2",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "completed",
  },
  {
    id: "3",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "completed",
  },
  {
    id: "4",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "ongoing",
  },
  {
    id: "5",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "ongoing",
  },
  {
    id: "1",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "completed",
  },
  {
    id: "2",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "completed",
  },
  {
    id: "3",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "completed",
  },
  {
    id: "4",
    restaurantName: "Chicken Republic",
    date: "08/09/2024",
    time: "9:00am",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=2070&auto=format&fit=crop",
    status: "ongoing",
  },
];

// Order Card Component
const OrderCard = ({ order }: { order: Order }) => {
  const router = useRouter();

  return (
    <Pressable
      style={{
        flexDirection: "row",
        backgroundColor: COLORS.grey,
        padding: 7,
        borderRadius: 12,
      }}
      // onPress={() => router.push(`/order/${order.id}`)}
    >
      <Image
        source={{ uri: order.image }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 12,
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 12,
        }}
      >
        <View>
          <MediumText
            style={{
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            {order.restaurantName}
          </MediumText>
          <MediumText
            style={{
              fontSize: 12,
              color: "#666666",
            }}
          >
            {order.date}, {order.time}
          </MediumText>
        </View>
        <View
          style={{
            alignItems: "center",
            gap: 8,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.primary,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#1A1A1A",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 6,
            }}
          >
            <MediumText
              style={{
                color: "#FFFFFF",
                fontSize: 12,
              }}
            >
              Open
            </MediumText>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<"ongoing" | "completed">(
    "completed"
  );

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  return (
    <AppRareBgView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <LargeText
          style={{
            fontSize: 20,
          }}
        >
          Orders
        </LargeText>
        <TouchableOpacity>
          <Info size={20} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            backgroundColor: activeTab === "ongoing" ? "#1A1A1A" : "#F5F5F5",
            borderRadius: activeTab === "ongoing" ? 8 : 0,
          }}
          onPress={() => setActiveTab("ongoing")}
        >
          <MediumText
            style={{
              color: activeTab === "ongoing" ? "#FFFFFF" : "#1A1A1A",
              fontSize: 14,
            }}
          >
            Ongoing
          </MediumText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: "center",
            backgroundColor: activeTab === "completed" ? "#1A1A1A" : "#F5F5F5",
            borderRadius: activeTab === "completed" ? 8 : 0,
          }}
          onPress={() => setActiveTab("completed")}
        >
          <MediumText
            style={{
              color: activeTab === "completed" ? "#FFFFFF" : "#1A1A1A",
              fontSize: 14,
            }}
          >
            Completed
          </MediumText>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          gap: 16,
        }}
      >
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </ScrollView>
    </AppRareBgView>
  );
}
