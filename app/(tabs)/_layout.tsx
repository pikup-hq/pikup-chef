import { Tabs } from "expo-router";
import { Home, ShoppingBag, Bell, User, ComputerIcon, Zap } from "lucide-react-native";
import COLORS from './../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F4F4F4",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#AAAAAA",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "Sen-Regular",
          fontSize: 11,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <ShoppingBag size={20} color={color}  />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "AI",
          tabBarIcon: ({ color, size }) => (
            <Zap size={20} color={color}  />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}