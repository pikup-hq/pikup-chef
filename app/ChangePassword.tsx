import { SafeAreaView, StatusBar, View } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import { MediumText } from "@/components/common/AppText";
import { EditPassword } from "@/components/common/AppInput";
import { DefaultButton } from "@/components/common/Button";
import ScreenHeader from "@/components/ScreenHeader";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { authApi } from "@/services/auth";
import { getErrorMessage } from "@/services/api";
import Spacing from "@/constants/Spacing";

export default function ChangePassword() {
  const [prev, setPrev] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!prev || !password || !confirm) return ErrorToast("Please fill in all fields");
    if (password.length < 8) return ErrorToast("New password must be at least 8 characters");
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      return ErrorToast("Use upper and lower case letters and a number");
    }
    if (password !== confirm) return ErrorToast("New passwords do not match");
    if (password === prev) return ErrorToast("Choose a password different from your current one");

    setSaving(true);
    try {
      await authApi.changePassword(prev, password);
      SuccessToast("Password changed successfully");
      router.back();
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not change password"));
    } finally {
      setSaving(false);
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
      <Spinner visible={saving} overlayColor="rgba(0, 0, 0, 0.5)" />
      <ScreenHeader title="Change Password" />
      <MediumText style={{ marginBottom: 30, fontSize: 12, marginTop: 10 }}>
        Secure your account by updating your password below.
      </MediumText>
      <EditPassword style={{ marginBottom: 16 }} title="Current Password" onChangeText={setPrev} />
      <EditPassword style={{ marginBottom: 16 }} title="New Password" onChangeText={setPassword} />
      <EditPassword style={{ marginBottom: 16 }} title="Confirm New Password" onChangeText={setConfirm} />
      <View style={{ flex: 1 }} />
      <DefaultButton onPress={save} style={{ marginBottom: 24 }} title="Save Password" />
    </SafeAreaView>
  );
}
