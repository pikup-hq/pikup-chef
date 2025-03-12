import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { ArrowLeft } from "iconsax-react-native";
import { AppView } from "@/components/common/AppViews";
import { MediumText } from "@/components/common/AppText";
import {
  DefaultInput,
  EditEmail,
  EditInput,
  EditNum,
  EditPassword,
  EmailInput,
  NumInput,
} from "@/components/common/AppInput";
import { DefaultButton } from "@/components/common/Button";
import { router } from "expo-router";

export default function ChangePassword() {
  const [fullName, setFullName] = useState("");
  const [prev, setPrev] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <AppView>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 20 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size="32" color="black" />
        </TouchableOpacity>
        <MediumText style={{ fontSize: 15, marginLeft: 5 }}>
          Change Password
        </MediumText>
      </View>
      <MediumText style={{ marginBottom: 30, fontSize: 12, marginTop: 10 }}>
        Secure your account by updating your password below.
      </MediumText>
      <EditPassword
        style={{ marginBottom: 16 }}
        title="Previous Password"
        onChangeText={(val: string) => setPrev(val)}
      />

      <EditPassword
        style={{ marginBottom: 16 }}
        title="New Password"
        onChangeText={(val: string) => setPassword(val)}
      />

      <EditPassword
        style={{ marginBottom: 16 }}
        title="Confirm Password"
        onChangeText={(val: string) => setConfirm(val)}
      />

      <DefaultButton
        // onPress={handleOtp}
        style={{ marginTop: 300 }}
        title="Save Password"
      />
    </AppView>
  );
}
