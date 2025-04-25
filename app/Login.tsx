import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useState } from "react";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  MediumBlueText,
  MediumText,
  SemiBoldText,
} from "@/components/common/AppText";
import {
  DefaultInput,
  EmailInput,
  PasswordInput,
} from "@/components/common/AppInput";
import { DefaultButton } from "@/components/common/Button";
// import { UseAuth } from "../../lib/hooks/auth";
import { ErrorToast } from "@/components/common/Toasts";
import Spinner from "react-native-loading-spinner-overlay";
import { router } from "expo-router";
import { UseAuth } from "@/hooks/apis";
import Spacing from "@/constants/Spacing";
import { StatusBar } from "react-native";

export default function Login() {
  // const { navigate, replace, goBack } = UseNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, isSuccess, login } = UseAuth();

  const handleLogin = () => {
    if (email === "" || password === "") {
      ErrorToast("Please fill in all required fields.");
    } else {
      login(email.toLowerCase(), password);
    }
  };

  if (isSuccess) {
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <Spinner color="#181C2E" visible={isLoading} />
      <SemiBoldText style={{ fontSize: 23, marginTop: 30, marginBottom: 2 }}>
        Welcome Back!
      </SemiBoldText>
      <MediumText style={{ marginBottom: 45 }}>
        Let's get cooking, shall we?👌
      </MediumText>
      <EmailInput
        style={{ marginBottom: 16 }}
        title="Email Address"
        placeholder="Enter your email address"
        onChangeText={(val: string) => setEmail(val)}
      />

      <PasswordInput
        title="Password"
        onChangeText={(val: string) => setPassword(val)}
      />
      <View style={{ marginTop: 300 }}>
        <DefaultButton
          style={{ marginTop: 35 }}
          title="Login"
          onPress={handleLogin}
        />
        <TouchableOpacity
          onPress={() => router.push("/SignUp")}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          <MediumText style={{ fontSize: 12 }}>New here? </MediumText>
          <MediumBlueText style={{ fontSize: 12 }}>Sign Up</MediumBlueText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
