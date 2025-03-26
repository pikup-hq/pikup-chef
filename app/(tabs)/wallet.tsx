import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ArrowLeft,
  Bell,
  Eye,
  EyeOff,
  CircleDollarSign,
  MoveUpIcon,
  MoveDown,
  Hand,
  HandCoins,
} from "lucide-react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { AppSafeAreaView } from "@/components/common/AppViews";
import {
  LargeText,
  MediumText,
  SmallText,
  SemiBoldText,
} from "@/components/common/AppText";
// import { userData, Transaction } from "@/hooks/data/user";
import COLORS from "../../constants/colors";
import { UseAuth } from "@/hooks/apis";
import useAuthStore from "@/store/authStore";
import { BASE_URL } from "@/config";
import axios from "axios";
import { ErrorToast } from "@/components/common/Toasts";
import { format } from "date-fns";
import NoDataView from "@/components/NoDataView";
import { Coin } from "iconsax-react-native";

// Add this helper function at the top of the file
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Update the Transaction interface to match API response
interface Transaction {
  _id: string;
  reference: string;
  status: string;
  user: string;
  vendor: string;
  orderId: string;
  amount: number;
  channel: string;
  others: { data: { created_at: string } };
  type?: "credit" | "debit"; // Add this for UI rendering
  description?: string; // Add this for UI rendering
  date?: string; // Add this for UI rendering
}

interface WalletData {
  balance: number;
  transactions: Transaction[];
}

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy • HH:mm");
    } catch (error) {
      console.log("Date parsing error:", error);
      return dateString;
    }
  };

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
        <MoveUpIcon size={15} color="green" />
        {/* {transaction.type === "credit" ? (
          <MoveUpIcon size={15} color="green" />
        ) : (
          <MoveDown size={15} color="red" />
        )} */}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <SmallText
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 13 }}
            >
              Transaction {transaction.orderId}
            </SmallText>
            <SmallText style={{ color: "#666666", marginTop: 2, fontSize: 12 }}>
              {formatDate(transaction.others.data.created_at)}
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
              {formatAmount(transaction.amount)}
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
  const [showBalance, setShowBalance] = useState(true);
  const [balance, setBalance] = useState(0);
  const [wallet, setWallet] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuthStore((state) => state.userInfo);
  const token = useAuthStore((state) => state.token);
  const userInfo = JSON.parse(user);

  const getTransactions = () => {
    setIsLoading(true);

    axios
      .get(
        `${BASE_URL}/transactions/wallet-transaction/vendor/${userInfo._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log("Transactions:", response.data);
        // Add type field to each transaction
        const transactionsWithType = response.data.data.map(
          (transaction: any) => ({
            ...transaction,
            type: "credit", // Setting all transactions as credit for now
          })
        );
        setWallet(transactionsWithType || []);
      })
      .catch(() => ErrorToast("Failed to fetch transactions"))
      .finally(() => setIsLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      getTransactions();
    }, [])
  );

  // Update handleWithdraw to use actual balance
  const handleWithdraw = () => {
    router.push({
      pathname: "/withdraw",
      params: { walletBalance: `${balance}` },
    });
  };

  return (
    <AppSafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Spinner visible={isLoading} overlayColor="rgba(0, 0, 0, 0.7)" />

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
              {showBalance ? `₦${formatAmount(balance)}` : "****"}
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
          {wallet.length === 0 ? (
            <NoDataView
              message="No transactions yet"
              icon={<HandCoins size={48} color="#CCCCCC" />}
            />
          ) : (
            wallet.map((transaction) => (
              <TransactionItem
                key={transaction._id}
                transaction={transaction}
              />
            ))
          )}
        </ScrollView>
      </View>
    </AppSafeAreaView>
  );
}
