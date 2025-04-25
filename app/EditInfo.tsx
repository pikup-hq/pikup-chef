import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { ArrowLeft } from "iconsax-react-native";
import { AppView } from "@/components/common/AppViews";
import { MediumText } from "@/components/common/AppText";
import { formatPhoneNumber, responsiveText } from "@/utilities/helper";
import {
  DefaultInput,
  EditEmail,
  EditInput,
  EditNum,
  EmailInput,
  NumInput,
} from "@/components/common/AppInput";
import { DefaultButton } from "@/components/common/Button";
import { router } from "expo-router";
import Spacing from "@/constants/Spacing";
import { StatusBar } from "react-native";

export default function EditInfo() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (val: string) => {
    const formattedPhone = formatPhoneNumber(val);
    setPhone(formattedPhone);
  };

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: "#FFFFFF",
      paddingHorizontal: Spacing * 2,
      paddingTop: (StatusBar.currentHeight ?? 20) + 5,
    }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size="32" color="black" />
        </TouchableOpacity>
        <MediumText style={{ fontSize: responsiveText(15), marginLeft: 5 }}>
          Edit Info
        </MediumText>
      </View>
      <MediumText style={{ marginBottom: 30, fontSize: 12, marginTop: 10 }}>
        Edit your information here to ensure everything stays current and
        correct.
      </MediumText>
      <EditInput
        style={{ marginBottom: 16 }}
        title="Store Name"
        placeholder="Enter your store name"
        onChangeText={(val: string) => setFullName(val)}
      />
      <EditEmail
        style={{ marginBottom: 16 }}
        title="Email"
        placeholder="Enter your email address"
        onChangeText={(val: string) => setEmail(val)}
      />
      <EditNum
        style={{ marginBottom: 16 }}
        title="Phone Number"
        placeholder="+234 80 851 3703"
        onChangeText={handlePhoneChange}
        val={phone}
      />

      <DefaultButton style={{ marginTop: 300 }} title="Save Changes" />
    </SafeAreaView>
  );
}
