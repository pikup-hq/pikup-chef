import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MediumText, SemiBoldText } from "@/components/common/AppText";

export default function WithdrawalSuccessScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#E6F9EE",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Ionicons name="checkmark-circle" size={48} color="#10B981" />
        </View>

        <SemiBoldText
          style={{
            fontSize: 24,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Withdrawal Successful
        </SemiBoldText>

        <MediumText
          style={{
            fontSize: 13,
            color: "#666",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          Your withdrawal request has been processed successfully. The funds
          will be credited to your account shortly.
        </MediumText>

        <TouchableOpacity
          onPress={() => router.push("/wallet")}
          style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 8,
            padding: 16,
            width: "100%",
            alignItems: "center",
          }}
        >
          <MediumText
            style={{ color: "white", fontSize: 16, fontWeight: "500" }}
          >
            Back to Wallet
          </MediumText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
