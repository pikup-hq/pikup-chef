import { SafeAreaView, StatusBar, View } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import Spinner from "react-native-loading-spinner-overlay";
import { MediumText } from "@/components/common/AppText";
import { EditEmail, EditInput, EditNum } from "@/components/common/AppInput";
import { DefaultButton } from "@/components/common/Button";
import ScreenHeader from "@/components/ScreenHeader";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { authApi } from "@/services/auth";
import { getErrorMessage } from "@/services/api";
import useAuthStore from "@/store/authStore";
import Spacing from "@/constants/Spacing";

export default function EditInfo() {
  const userInfo = useAuthStore((s) => s.userInfo);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [name, setName] = useState(
    userInfo?.name || [userInfo?.firstName, userInfo?.lastName].filter(Boolean).join(" ")
  );
  const [email, setEmail] = useState(userInfo?.email || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) return ErrorToast("Please fill in all fields");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return ErrorToast("Enter a valid email address");

    setSaving(true);
    try {
      const res = await authApi.editVendor({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      });
      const account = res.profile?.account || {};
      await updateUser({
        name: account.name || name.trim(),
        email: account.email || email.trim().toLowerCase(),
        phone: account.phone || phone.trim(),
      });
      SuccessToast("Your details have been updated");
      router.back();
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not update your details"));
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
      <ScreenHeader title="Edit Info" />
      <MediumText style={{ marginBottom: 30, fontSize: 12, marginTop: 10 }}>
        Keep your store name and contact details up to date.
      </MediumText>
      <EditInput
        style={{ marginBottom: 16 }}
        title="Store Name"
        placeholder="Enter your store name"
        value={name}
        onChangeText={setName}
      />
      <EditEmail
        style={{ marginBottom: 16 }}
        title="Email"
        placeholder="Enter your email address"
        value={email}
        onChangeText={setEmail}
      />
      <EditNum
        style={{ marginBottom: 16 }}
        title="Phone Number"
        placeholder="08012345678"
        val={phone}
        onChangeText={setPhone}
      />
      <View style={{ flex: 1 }} />
      <DefaultButton onPress={save} style={{ marginBottom: 24 }} title="Save Changes" />
    </SafeAreaView>
  );
}
