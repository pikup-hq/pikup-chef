import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AppView } from "@/components/common/AppViews";
import { ArrowLeft } from "iconsax-react-native";
import { responsiveText } from "@/utilities/helper";
import { MediumText, SemiBoldText } from "@/components/common/AppText";
import Spacing from "@/constants/Spacing";
import COLORS from "@/constants/colors";
import { router } from "expo-router";

export default function Faq() {
  return (
    <AppView>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size="32" color="black" />
        </TouchableOpacity>
        <MediumText style={{ fontSize: responsiveText(15), marginLeft: 7 }}>
          Frequently Asked Questions
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
          1. What is Pikup?
        </SemiBoldText>
        <MediumText style={{ fontSize: responsiveText(12), marginBottom: 20 }}>
          Answer: Pikup is a platform that empowers student entrepreneurs to
          create and manage their own food delivery services on campus. It
          connects hungry students with local food vendors or student-run
          kitchens, making food delivery more affordable and accessible.
        </MediumText>

        <SemiBoldText
          style={{ fontSize: responsiveText(12), marginBottom: 15 }}
        >
          2. Is Pikup available on my campus?
        </SemiBoldText>
        <MediumText style={{ fontSize: responsiveText(12), marginBottom: 20 }}>
          Answer: We are currently expanding to different campuses. Check our
          app or website to see if Pikup is available in your area. If we’re not
          yet there, stay tuned—we're coming soon!
        </MediumText>

        <SemiBoldText
          style={{ fontSize: responsiveText(12), marginBottom: 15 }}
        >
          3. How do I know if a restaurant or vendor is open for delivery?
        </SemiBoldText>
        <MediumText style={{ fontSize: responsiveText(12), marginBottom: 20 }}>
          Answer: Each vendor's availability is listed in real-time on the app.
          You can check the opening hours, available days, and whether they're
          accepting orders at the moment.
        </MediumText>

        <SemiBoldText
          style={{ fontSize: responsiveText(12), marginBottom: 15 }}
        >
          4. What if I have an issue with my order?
        </SemiBoldText>
        <MediumText style={{ fontSize: responsiveText(12), marginBottom: 20 }}>
          Answer: If you encounter any problems with your order (e.g., late
          delivery, incorrect items), you can report the issue through the app,
          and our support team will assist you.
        </MediumText>
      </View>
    </AppView>
  );
}
