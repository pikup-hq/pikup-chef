import { useEffect } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import useAuthStore from "@/store/authStore";
import useNotificationStore from "@/store/notificationStore";
import { configureNotifications, registerPushToken } from "@/services/notifications";
import { useNotificationListeners } from "@/hooks/useNotificationListeners";
import NewOrderAlert from "@/components/NewOrderAlert";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Sen-Medium": require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    "Sen-Regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    "Sen-Italic": require("../assets/fonts/BeVietnamPro-MediumItalic.ttf"),
    "Sen-Bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    "Sen-SemiBold": require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });

  const hydrated = useAuthStore((s) => s.hydrated);
  const hydrate = useAuthStore((s) => s.hydrate);
  const token = useAuthStore((s) => s.token);

  useNotificationListeners();

  useEffect(() => {
    configureNotifications().catch((e) => console.log("Notification setup failed", e));
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (fontsLoaded && hydrated) SplashScreen.hideAsync();
  }, [fontsLoaded, hydrated]);

  // Re-register on every launch: Expo push tokens can rotate.
  useEffect(() => {
    if (!token) return;
    registerPushToken();
    useNotificationStore.getState().refreshUnread();
  }, [token]);

  if (!fontsLoaded || !hydrated) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal",
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="OnboardingOne" />
        <Stack.Screen name="OnboardingTwo" />
        <Stack.Screen name="SignUp" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="VerifyMail" />
        <Stack.Screen name="MoreDetails" />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="order" />
        <Stack.Screen name="orderDetail" />
        <Stack.Screen name="AddMenu" />
        <Stack.Screen name="extras" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="withdraw" />
        <Stack.Screen name="withdrawalSuccess" options={{ gestureEnabled: false }} />
        <Stack.Screen name="ChangePassword" />
        <Stack.Screen name="EditInfo" />
        <Stack.Screen name="DeleteAccount" />
      </Stack>
      <NewOrderAlert />
      <StatusBar style="dark" />
      <Toast />
    </View>
  );
}
