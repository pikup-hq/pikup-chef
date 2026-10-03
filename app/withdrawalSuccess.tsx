import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { formatAmount } from "@/utilities/format";
import { MediumText, SemiBoldText } from "@/components/common/AppText";

export default function WithdrawalSuccessScreen() {
  const { amount, reference, account } = useLocalSearchParams<{ amount?: string; reference?: string; account?: string }>();
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
          Withdrawal initiated
        </SemiBoldText>

        <MediumText
          style={{
            fontSize: 13,
            color: "#666",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          {amount ? `₦${formatAmount(Number(amount))} is on its way` : "Your withdrawal is on its way"}
          {account ? ` to ${account}` : ""}. Transfers usually arrive within minutes.
          You will get a notification when it completes.
          {reference ? `\n\nReference: ${reference}` : ""}
        </MediumText>

        <TouchableOpacity
          onPress={() => router.replace("/(tabs)/wallet")}
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
