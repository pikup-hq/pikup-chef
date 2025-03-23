import useAuthStore from "@/store/authStore";
import * as SecureStore from "expo-secure-store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Sen-Medium": require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    "Sen-Regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    "Sen-Italic": require("../assets/fonts/BeVietnamPro-MediumItalic.ttf"),
    "Sen-Bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    "Sen-SemiBold": require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });

  const token = useAuthStore((state) => state.token);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const initializeApp = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
        await getUserInfo();
      }
    };

    initializeApp();
  }, [loaded, token]);

  if (!loaded) {
    return null;
  }

  const getUserInfo = async () => {
    try {
      const tok = await SecureStore.getItemAsync("token");
      const user = await SecureStore.getItemAsync("user");
      setUserInfo(user);
      if (tok) {
        setToken(tok);
      }
    } catch (e) {
      console.log("Error while getting user data", e);
    }
  };

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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingOne" options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingTwo" options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="VerifyMail" options={{ headerShown: false }} />
        <Stack.Screen name="MoreDetails" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="order" options={{ headerShown: false }} />
        <Stack.Screen name="orderDetail" options={{ headerShown: false }} />
        <Stack.Screen name="AddMenu" options={{ headerShown: false }} />
        <Stack.Screen name="withdraw" options={{ headerShown: false }} />
        <Stack.Screen
          name="withdrawalSuccess"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar style="dark" />
      <Toast />
    </View>
  );
}
