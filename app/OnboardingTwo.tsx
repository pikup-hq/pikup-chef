import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  MediumText,
  SemiBoldText,
  SmallText,
} from "@/components/common/AppText";
import { responsiveText } from "@/utilities/helper";
import { DefaultButton } from "@/components/common/Button";
import COLORS from "@/constants/colors";
import Logo from "@/assets/svg/pikup-logo.svg";
import OnboardTwo from "@/assets/svg/onboard-man.svg";
import SliderTwo from "@/assets/svg/slider-three.svg";
import { router } from "expo-router";

export default function OnboardingTwo() {
  return (
    <AppSafeAreaView>
      <View style={{ alignItems: "center", marginTop: responsiveText(50) }}>
        <Logo />
      </View>
      <SemiBoldText
        style={{
          fontSize: responsiveText(20),
          textAlign: "center",
          marginTop: 30,
          marginBottom: 15,
        }}
      >
        Easy Order Management
      </SemiBoldText>
      <MediumText
        style={{
          textAlign: "center",
        }}
      >
        Our intuitive dashboard makes it simple to manage orders and communicate
        with customers.
      </MediumText>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            marginTop: 70,
            marginBottom: 90,
          }}
        >
          <OnboardTwo />
        </View>
        <View
          style={{
            marginBottom: 30,
          }}
        >
          <SliderTwo />
        </View>
      </View>
      <DefaultButton title="Next" onPress={() => router.push("/SignUp")} />
    </AppSafeAreaView>
  );
}
