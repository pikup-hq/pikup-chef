import React, { useCallback } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Bell } from "lucide-react-native";
import useNotificationStore from "@/store/notificationStore";
import COLORS from "@/constants/colors";

const NotificationBell: React.FC<{ color?: string }> = ({ color = "#000000" }) => {
  const unread = useNotificationStore((s) => s.unreadCount);
  const refreshUnread = useNotificationStore((s) => s.refreshUnread);

  useFocusEffect(
    useCallback(() => {
      refreshUnread();
    }, [refreshUnread])
  );

  return (
    <TouchableOpacity
      onPress={() => router.push("/notifications")}
      hitSlop={10}
      accessibilityLabel={`Notifications${unread ? `, ${unread} unread` : ""}`}
    >
      <Bell size={22} color={color} />
      {unread > 0 && (
        <View
          style={{
            position: "absolute",
            top: -6,
            right: -8,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: COLORS.secondary,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 4,
          }}
        >
          <Text style={{ color: "#FFF", fontSize: 10, fontFamily: "Sen-Bold" }}>
            {unread > 99 ? "99+" : unread}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationBell;
