import { View, Text, TouchableOpacity } from "react-native";
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

export default function Login() {
  // const { navigate, replace, goBack } = UseNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const { isLoading, isSuccess, login } = UseAuth();

  // const handleLogin = () => {
  //   if (email === "" || password === "") {
  //     ErrorToast("Please fill in all required fields.");
  //   } else {
  //     login(email, password);
  //   }
  // };

  // if (isSuccess) {
  //   replace("Tab");
  // }

  return (
    <AppSafeAreaView>
      <Spinner color="#181C2E" visible={false} />
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
          onPress={() => router.push('/MoreDetails')}
        />
        <TouchableOpacity
          onPress={() => router.push('/SignUp')}
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
    </AppSafeAreaView>
  );
}
