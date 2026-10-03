import React, { useState } from "react";
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { MediumText, SemiBoldText, SmallText } from "@/components/common/AppText";
import ScreenHeader from "@/components/ScreenHeader";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { authApi } from "@/services/auth";
import { getErrorMessage } from "@/services/api";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
import Spacing from "@/constants/Spacing";

export default function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    if (!password) return ErrorToast("Enter your password to confirm");
    setBusy(true);
    try {
      await authApi.deleteAccount(password);
      // The account no longer exists, so clear the session locally only.
      useNotificationStore.getState().reset();
      await useAuthStore.getState().logout();
      SuccessToast("Your account has been deleted");
      router.replace("/Login");
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not delete your account"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <ScreenHeader title="Delete account" />
      <View style={{ marginTop: 24 }}>
        <SemiBoldText style={{ fontSize: 18 }}>This can't be undone</SemiBoldText>
        <MediumText style={{ color: "#666666", marginTop: 10, lineHeight: 22 }}>
          Deleting your account removes your restaurant and personal details from Pikup. Customers won't be able to
          find or order from you.
        </MediumText>
        <MediumText style={{ color: "#666666", marginTop: 10, lineHeight: 22 }}>
          Withdraw any wallet balance and finish open orders first. Past order records are kept for
          accounting.
        </MediumText>

        <SmallText style={{ marginTop: 24, marginBottom: 6 }}>Password</SmallText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Enter your password"
          style={{ backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, fontFamily: "Sen-Regular", fontSize: 15 }}
        />

        <TouchableOpacity
          onPress={confirm}
          disabled={busy}
          style={{ backgroundColor: "#EA3131", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 24 }}
        >
          {busy ? <ActivityIndicator color="#FFF" /> : <SemiBoldText style={{ color: "#FFF" }}>Delete my account</SemiBoldText>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={{ alignItems: "center", marginTop: 16 }}>
          <MediumText>Cancel</MediumText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
