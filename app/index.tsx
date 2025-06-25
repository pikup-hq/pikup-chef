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
import OnboardingPicOne from "@/assets/svg/onboard-truck.svg";
import SliderOne from "@/assets/svg/slider-one.svg";
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
        Welcome to Pikup
      </SemiBoldText>
      <MediumText
        style={{
          textAlign: "center",
        }}
      >
        Welcome to Pikup vendor. Let's do some cooking Chef🧑‍🍳.
      </MediumText>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            marginTop: 70,
            marginBottom: 90,
          }}
        >
          <OnboardingPicOne />
        </View>
        <View
          style={{
            marginBottom: 30,
          }}
        >
          <SliderOne />
        </View>
      </View>

      <DefaultButton
        title="Next"
        onPress={() => router.push("/OnboardingOne")}
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
