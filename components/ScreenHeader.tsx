import React from "react";
import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { SemiBoldText, SmallText } from "@/components/common/AppText";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, showBack = true, right }) => (
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
    {showBack && (
      <TouchableOpacity
        onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
        style={{ marginRight: 16 }}
        hitSlop={10}
        accessibilityLabel="Go back"
      >
        <ArrowLeft size={24} color="#000000" />
      </TouchableOpacity>
    )}
    <View style={{ flex: 1 }}>
      <SemiBoldText style={{ fontSize: 16 }}>{title}</SemiBoldText>
      {!!subtitle && (
        <SmallText style={{ color: "#666666", fontSize: 13 }}>{subtitle}</SmallText>
      )}
    </View>
    {right}
  </View>
);

export default ScreenHeader;
