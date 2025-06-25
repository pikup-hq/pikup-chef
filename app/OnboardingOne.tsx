import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
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
import OnboardTwo from "@/assets/svg/onboard-food.svg";
import SliderTwo from "@/assets/svg/slider-two.svg";
import { router } from "expo-router";
import Spacing from "@/constants/Spacing";

export default function OnboardingOne() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
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
        Reach more customers
      </SemiBoldText>
      <MediumText
        style={{
          textAlign: "center",
        }}
      >
        Connect with thousands of customers in your area looking for great food.
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
      <DefaultButton
        title="Next"
        onPress={() => router.push("/OnboardingTwo")}
      />
      <TouchableOpacity onPress={() => router.push("/Login")}>
        <SmallText
          style={{
            color: COLORS.greyText,
            marginTop: 15,
            textAlign: "center",
          }}
        >
          Login
        </SmallText>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
