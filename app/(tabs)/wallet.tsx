import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Eye, EyeOff, ArrowDownLeft, ArrowUpRight, HandCoins, Landmark } from "lucide-react-native";
import { LargeText, MediumText, SmallText, SemiBoldText } from "@/components/common/AppText";
import ScreenHeader from "@/components/ScreenHeader";
import NoDataView from "@/components/NoDataView";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import { ErrorToast } from "@/components/common/Toasts";
import { walletApi } from "@/services/wallet";
import { getErrorMessage } from "@/services/api";
import { formatAmount, formatDate } from "@/utilities/format";
import type { WalletSummary, WalletTransaction } from "@/types";

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  pending: { color: "#F2994A", label: "Pending" },
  success: { color: "#27AE60", label: "Successful" },
  failed: { color: "#EB5757", label: "Failed" },
  reversed: { color: "#828282", label: "Reversed" },
};

const TransactionRow: React.FC<{ txn: WalletTransaction }> = ({ txn }) => {
  const isCredit = txn.type === "credit";
  const status = STATUS_STYLE[txn.status] || { color: "#666", label: txn.status };
  const title =
    txn.description ||
    (txn.source === "withdrawal" ? "Withdrawal" : `Order #${txn.orderId || txn.reference}`);
  const subtitle =
    txn.source === "order" && txn.status === "pending" ? "Released when the order is delivered" : formatDate(txn.createdAt);

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
          backgroundColor: isCredit ? "#EAF7EF" : "#FDECEC",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        {isCredit ? <ArrowDownLeft size={18} color="#27AE60" /> : <ArrowUpRight size={18} color="#EB5757" />}
      </View>
      <View style={{ flex: 1, marginRight: 8 }}>
        <SmallText numberOfLines={1} style={{ fontSize: 13 }}>
          {title}
        </SmallText>
        <SmallText style={{ color: "#666666", marginTop: 2, fontSize: 11 }} numberOfLines={1}>
          {subtitle}
        </SmallText>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <MediumText style={{ color: isCredit ? "#27AE60" : "#EB5757", fontSize: 13 }}>
          {isCredit ? "+" : "-"}₦{formatAmount(txn.amount)}
        </MediumText>
        <SmallText style={{ color: status.color, marginTop: 2, fontSize: 11 }}>{status.label}</SmallText>
      </View>
    </View>
  );
};

export default function WalletScreen() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      setWallet(await walletApi.summary());
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Failed to load wallet"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const balance = wallet?.balance || 0;
  const hidden = "₦ ****";

  const header = (
    <View>
      <View style={{ backgroundColor: "#1A1A1A", borderRadius: 12, paddingHorizontal: 20, paddingVertical: 24, marginTop: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <SmallText style={{ color: "#FFFFFF", marginRight: 8 }}>Available balance</SmallText>
          <TouchableOpacity onPress={() => setShowBalance(!showBalance)} hitSlop={10}>
            {showBalance ? <EyeOff size={16} color="#FFFFFF" /> : <Eye size={16} color="#FFFFFF" />}
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <LargeText style={{ color: "#FFFFFF", fontSize: 22 }}>
            {showBalance ? `₦${formatAmount(balance)}` : hidden}
          </LargeText>
          <TouchableOpacity
            style={{
              backgroundColor: balance > 0 ? "#FFFFFF" : "#555",
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
            }}
            onPress={() => router.push("/withdraw")}
          >
            <SmallText style={{ color: balance > 0 ? "#000" : "#CCC" }}>Withdraw</SmallText>
          </TouchableOpacity>
        </View>
        <SmallText style={{ color: "#BBBBBB", marginTop: 12, fontSize: 12 }}>
          Pending: {showBalance ? `₦${formatAmount(wallet?.pendingBalance)}` : hidden} • paid out when orders are delivered
        </SmallText>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/withdraw")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: COLORS.lightBlue,
          borderRadius: 12,
          padding: 14,
          marginTop: 14,
        }}
      >
        <Landmark size={20} color={COLORS.primary} />
        <View style={{ flex: 1 }}>
          {wallet?.payoutAccount ? (
            <>
              <SmallText style={{ fontSize: 13 }}>{wallet.payoutAccount.accountName}</SmallText>
              <SmallText style={{ color: "#666", fontSize: 12 }}>
                {wallet.payoutAccount.bankName} • ****{wallet.payoutAccount.accountNumber.slice(-4)}
              </SmallText>
            </>
          ) : (
            <>
              <SmallText style={{ fontSize: 13 }}>Add a payout bank account</SmallText>
              <SmallText style={{ color: "#666", fontSize: 12 }}>Required before you can withdraw</SmallText>
            </>
          )}
        </View>
        <SmallText style={{ color: COLORS.secondary, fontSize: 12 }}>
          {wallet?.payoutAccount ? "Change" : "Add"}
        </SmallText>
      </TouchableOpacity>

      <SemiBoldText style={{ marginTop: 24, marginBottom: 4 }}>Transaction history</SemiBoldText>
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <ScreenHeader title="Wallet" showBack={false} />
      {loading ? (
        <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={wallet?.transactions || []}
          keyExtractor={(t) => t._id}
          ListHeaderComponent={header}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
          ListEmptyComponent={
            <NoDataView message="No transactions yet" icon={<HandCoins size={48} color="#CCCCCC" />} />
          }
          renderItem={({ item }) => <TransactionRow txn={item} />}
        />
      )}
    </SafeAreaView>
  );
}
