import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Sen-Medium": require("../assets/fonts/BeVietnamPro-Medium.ttf"),
    "Sen-Regular": require("../assets/fonts/BeVietnamPro-Regular.ttf"),
    "Sen-Italic": require("../assets/fonts/BeVietnamPro-MediumItalic.ttf"),
    "Sen-Bold": require("../assets/fonts/BeVietnamPro-Bold.ttf"),
    "Sen-SemiBold": require("../assets/fonts/BeVietnamPro-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
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
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingOne" options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingTwo" options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="Login" options={{ headerShown: false }} />
        <Stack.Screen name="VerifyMail" options={{ headerShown: false }} />
        <Stack.Screen name="MoreDetails" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="order" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
