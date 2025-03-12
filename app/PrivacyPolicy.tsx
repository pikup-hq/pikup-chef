import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AppView } from "@/components/common/AppViews";
import { ArrowLeft } from "iconsax-react-native";
import { responsiveText } from "@/utilities/helper";
import { MediumText, SemiBoldText } from "@/components/common/AppText";
import Spacing from "@/constants/Spacing";
import COLORS from "@/constants/colors";
import { router } from "expo-router";

export default function PrivacyPolicy() {
  return (
    <AppView>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size="32" color="black" />
        </TouchableOpacity>
        <MediumText style={{ fontSize: responsiveText(15), marginLeft: 7 }}>
          Privacy Policy
        </MediumText>
      </View>
      <MediumText style={{ marginBottom: 30, fontSize: 12, marginTop: 5 }}>
        How We Handle and Protect Your Personal Information
      </MediumText>

      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 8,
          borderRadius: Spacing,
          backgroundColor: COLORS.grey,
        }}
      >
        <SemiBoldText
          style={{ fontSize: responsiveText(12), marginBottom: 15 }}
        >
          1. What information does Pikup collect?
        </SemiBoldText>
        <MediumText style={{ fontSize: responsiveText(12), marginBottom: 20 }}>
          Answer: We collect personal information such as your name, email
          address, phone number, delivery address, and payment details when you
          create an account or place an order. We may also collect non-personal
          information like device information, IP addresses, and app usage data
          to improve our services.
        </MediumText>

        <SemiBoldText
          style={{ fontSize: responsiveText(12), marginBottom: 15 }}
        >
          2. How does Pikup use my information?
        </SemiBoldText>
        <MediumText style={{ fontSize: responsiveText(12), marginBottom: 20 }}>
          Answer: Your information helps us provide, maintain, and improve our
          services. This includes processing orders, personalizing your
          experience, offering customer support, and sending updates or
          promotional materials. We also use data for security, fraud detection,
          and analytics.
        </MediumText>

        <SemiBoldText
          style={{ fontSize: responsiveText(12), marginBottom: 15 }}
        >
          3. Does Pikup share my information with third parties?
        </SemiBoldText>
        <MediumText style={{ fontSize: responsiveText(12), marginBottom: 20 }}>
          Answer: We only share your information with trusted third parties to
          facilitate your orders (such as delivery services and payment
          processors). We may also share data with partners for marketing
          purposes, but we never sell your personal information to third
          parties.
        </MediumText>
      </View>
    </AppView>
  );
}
