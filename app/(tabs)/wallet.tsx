import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  Eye,
  EyeOff,
  CircleDollarSign,
  MoveUpIcon,
  MoveDown,
} from "lucide-react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  LargeText,
  MediumText,
  SmallText,
  SemiBoldText,
} from "@/components/common/AppText";
import { userData, Transaction } from "@/hooks/data/user";
import COLORS from "../../constants/colors";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F4F4F4",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#FFF5F1",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        {transaction.type === "credit" ? (
          <MoveUpIcon size={15} color="green" />
        ) : (
          <MoveDown size={15} color="red" />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <SmallText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 13 }}
            >
              {transaction.description} {transaction.recipient}
            </SmallText>
            <SmallText style={{ color: "#666666", marginTop: 2, fontSize: 12 }}>
              {transaction.date}
            </SmallText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <MediumText
              style={{
                color: transaction.type === "credit" ? "#4CAF50" : "#FF4040",
                fontSize: 13,
              }}
            >
              {transaction.type === "credit" ? "+" : "-"}₦
              {transaction.amount.toFixed(2)}
            </MediumText>
            <SmallText
              style={{
                color: "#4CAF50",
                marginTop: 4,
              }}
            >
              {transaction.status}
            </SmallText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function WalletScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [walletData, setWalletData] = useState(userData.wallet);

  // Simulate API fetch
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setWalletData(userData.wallet);
      } catch (error) {
        Alert.alert("Error", "Failed to load wallet data");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleWithdraw = () => {
    router.push({
      pathname: "/withdraw",
      params: { walletBalance: `${walletData.balance}` },
    });
    router.push("/withdraw");
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Spinner visible={loading} overlayColor="rgba(0, 0, 0, 0.7)" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 16,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#F4F4F4",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeft size={24} color="#000000" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <SemiBoldText style={{ fontSize: 16 }}>Wallet</SemiBoldText>
        </View>
      </View>

      {/* Balance Card */}
      <View style={{ paddingTop: 16, marginTop: 20, marginBottom: 20 }}>
        <View
          style={{
            backgroundColor: "#1A1A1A",
            borderRadius: 12,
            paddingHorizontal: 20,
            paddingVertical: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <SmallText style={{ color: "#FFFFFF", marginRight: 8 }}>
              My Balance
            </SmallText>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              {showBalance ? (
                <EyeOff size={16} color="#FFFFFF" />
              ) : (
                <Eye size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <LargeText style={{ color: "#FFFFFF", fontSize: 20 }}>
              {showBalance ? `₦${walletData.balance.toFixed(2)}` : "****"}
            </LargeText>
            <TouchableOpacity
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 20,
              }}
              onPress={handleWithdraw}
            >
              <SmallText style={{}}>Withdraw</SmallText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Transaction History */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 16,
          }}
        >
          <MediumText style={{}}>Transaction history</MediumText>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 5 }}
        >
          {walletData.transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
}
