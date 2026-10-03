import { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { MediumText, SemiBoldText, SmallText } from "@/components/common/AppText";
import ScreenHeader from "@/components/ScreenHeader";
import COLORS from "@/constants/colors";
import Spacing from "@/constants/Spacing";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { walletApi } from "@/services/wallet";
import { getErrorMessage } from "@/services/api";
import { formatAmount } from "@/utilities/format";
import type { Bank, WalletSummary } from "@/types";

const inputStyle = {
  backgroundColor: "#F5F5F5",
  borderRadius: 8,
  fontFamily: "Sen-Regular",
  padding: 14,
  fontSize: 15,
};

const digits = (value: string) => value.replace(/[^\d]/g, "");
const withCommas = (value: string) => digits(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function WithdrawScreen() {
  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Payout account form
  const [editingAccount, setEditingAccount] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bankQuery, setBankQuery] = useState("");
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [bank, setBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);

  // Withdrawal
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadWallet = useCallback(async () => {
    try {
      const data = await walletApi.summary();
      setWallet(data);
      setEditingAccount(!data.payoutAccount);
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Failed to load wallet"));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWallet();
    }, [loadWallet])
  );

  useEffect(() => {
    if (!editingAccount || banks.length) return;
    walletApi
      .banks()
      .then(setBanks)
      .catch((error) => ErrorToast(getErrorMessage(error, "Failed to load banks")));
  }, [editingAccount, banks.length]);

  useEffect(() => {
    setAccountName("");
    if (accountNumber.length !== 10 || !bank) return;
    let active = true;
    setResolving(true);
    walletApi
      .resolveAccount(accountNumber, bank.code)
      .then((name) => active && setAccountName(name))
      .catch((error) => active && ErrorToast(getErrorMessage(error, "Could not verify account")))
      .finally(() => active && setResolving(false));
    return () => {
      active = false;
    };
  }, [accountNumber, bank]);

  const filteredBanks = useMemo(() => {
    const q = bankQuery.trim().toLowerCase();
    return q ? banks.filter((b) => b.name.toLowerCase().includes(q)) : banks;
  }, [banks, bankQuery]);

  const saveAccount = async () => {
    if (!bank || !accountName) return;
    setSavingAccount(true);
    try {
      const payoutAccount = await walletApi.savePayoutAccount({
        accountNumber,
        bankCode: bank.code,
        bankName: bank.name,
      });
      setWallet((w) => (w ? { ...w, payoutAccount } : w));
      setEditingAccount(false);
      SuccessToast("Payout account saved");
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not save account"));
    } finally {
      setSavingAccount(false);
    }
  };

  const balance = wallet?.balance || 0;
  const minWithdrawal = wallet?.minWithdrawal || 0;
  const numericAmount = Number(digits(amount)) || 0;
  const amountError =
    numericAmount > balance
      ? "Amount exceeds your available balance"
      : numericAmount > 0 && numericAmount < minWithdrawal
        ? `Minimum withdrawal is ₦${formatAmount(minWithdrawal)}`
        : "";
  const canWithdraw =
    !!wallet?.payoutAccount && !editingAccount && numericAmount > 0 && !amountError && !submitting;

  const withdraw = () => {
    const payout = wallet?.payoutAccount;
    if (!canWithdraw || !payout) return;
    Alert.alert(
      "Confirm withdrawal",
      `Send ₦${formatAmount(numericAmount)} to ${payout.accountName} (${payout.bankName} ****${payout.accountNumber.slice(-4)})?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Withdraw",
          onPress: async () => {
            setSubmitting(true);
            try {
              const result = await walletApi.withdraw(numericAmount);
              router.replace({
                pathname: "/withdrawalSuccess",
                params: {
                  amount: String(result.amount),
                  reference: result.reference,
                  account: `${payout.bankName} ****${payout.accountNumber.slice(-4)}`,
                },
              });
            } catch (error) {
              ErrorToast(getErrorMessage(error, "Withdrawal failed"));
              loadWallet();
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: Spacing * 2,
        paddingTop: (StatusBar.currentHeight ?? 20) + 5,
      }}
    >
      <ScreenHeader title="Withdraw" subtitle="Send your earnings to your bank" />

      {loading ? (
        <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 40 }} />
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 24 }}>
            <View style={{ backgroundColor: COLORS.lightOrange, borderRadius: 10, padding: 14, marginTop: 20 }}>
              <SmallText style={{ color: "#555" }}>Available balance</SmallText>
              <SemiBoldText style={{ fontSize: 20, marginTop: 2 }}>₦{formatAmount(balance)}</SemiBoldText>
            </View>

            {/* Payout account */}
            <SemiBoldText style={{ marginTop: 24, marginBottom: 10 }}>Payout account</SemiBoldText>
            {!editingAccount && wallet?.payoutAccount ? (
              <View style={{ backgroundColor: "#F5F5F5", borderRadius: 10, padding: 14, flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 1 }}>
                  <MediumText style={{ fontSize: 14 }}>{wallet.payoutAccount.accountName}</MediumText>
                  <SmallText style={{ color: "#666", marginTop: 2 }}>
                    {wallet.payoutAccount.bankName} • {wallet.payoutAccount.accountNumber}
                  </SmallText>
                </View>
                <TouchableOpacity onPress={() => setEditingAccount(true)}>
                  <SmallText style={{ color: COLORS.secondary }}>Change</SmallText>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => setShowBankPicker(true)}
                  style={[inputStyle, { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }]}
                >
                  <MediumText style={{ color: bank ? "black" : "#999", fontSize: 14 }}>
                    {bank?.name || "Select your bank"}
                  </MediumText>
                  <Ionicons name="chevron-down" size={20} color="#999" />
                </TouchableOpacity>

                <TextInput
                  value={accountNumber}
                  onChangeText={(v) => setAccountNumber(digits(v))}
                  placeholder="10-digit account number"
                  keyboardType="number-pad"
                  maxLength={10}
                  style={[inputStyle, { marginBottom: 12 }]}
                />

                {resolving && <SmallText style={{ color: "#666", marginBottom: 12 }}>Verifying account…</SmallText>}
                {!!accountName && (
                  <View style={{ backgroundColor: "#EAF7EF", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                    <MediumText style={{ fontSize: 13, color: "#1E7E45" }}>{accountName}</MediumText>
                  </View>
                )}

                <View style={{ flexDirection: "row", gap: 10 }}>
                  {!!wallet?.payoutAccount && (
                    <TouchableOpacity
                      onPress={() => setEditingAccount(false)}
                      style={{ flex: 1, borderRadius: 8, padding: 14, alignItems: "center", borderWidth: 1, borderColor: "#DDD" }}
                    >
                      <MediumText>Cancel</MediumText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={saveAccount}
                    disabled={!accountName || savingAccount}
                    style={{
                      flex: 1,
                      borderRadius: 8,
                      padding: 14,
                      alignItems: "center",
                      backgroundColor: accountName ? COLORS.primary : "#999",
                    }}
                  >
                    {savingAccount ? <ActivityIndicator color="#FFF" /> : <MediumText style={{ color: "#FFF" }}>Save account</MediumText>}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Amount */}
            <SemiBoldText style={{ marginTop: 28, marginBottom: 10 }}>Amount</SemiBoldText>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <TextInput
                value={amount ? `₦${amount}` : ""}
                onChangeText={(v) => setAmount(withCommas(v))}
                placeholder="₦10,000"
                keyboardType="number-pad"
                editable={!editingAccount}
                style={[inputStyle, { flex: 1 }]}
              />
              <TouchableOpacity
                onPress={() => setAmount(withCommas(String(Math.floor(balance))))}
                disabled={editingAccount || balance <= 0}
                style={{ paddingHorizontal: 14, paddingVertical: 14, borderRadius: 8, backgroundColor: COLORS.lightBlue }}
              >
                <SmallText>Max</SmallText>
              </TouchableOpacity>
            </View>
            {!!amountError && <SmallText style={{ color: "#EB5757", marginTop: 6 }}>{amountError}</SmallText>}
            {editingAccount && (
              <SmallText style={{ color: "#666", marginTop: 6 }}>Save a payout account to continue.</SmallText>
            )}
          </ScrollView>

          <View style={{ paddingVertical: 16 }}>
            <TouchableOpacity
              onPress={withdraw}
              disabled={!canWithdraw}
              style={{
                backgroundColor: canWithdraw ? "#1A1A1A" : "#999",
                borderRadius: 8,
                padding: 16,
                alignItems: "center",
              }}
            >
              {submitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <SemiBoldText style={{ color: "white" }}>Withdraw</SemiBoldText>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      <Modal visible={showBankPicker} animationType="slide" onRequestClose={() => setShowBankPicker(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF", paddingTop: (StatusBar.currentHeight ?? 20) + 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 12 }}>
            <TouchableOpacity onPress={() => setShowBankPicker(false)} hitSlop={10}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <TextInput
              value={bankQuery}
              onChangeText={setBankQuery}
              placeholder="Search banks"
              autoFocus
              style={[inputStyle, { flex: 1, padding: 12 }]}
            />
          </View>
          {banks.length === 0 ? (
            <ActivityIndicator color={COLORS.secondary} style={{ marginTop: 30 }} />
          ) : (
            <FlatList
              data={filteredBanks}
              keyExtractor={(b) => `${b.id}-${b.code}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setBank(item);
                    setShowBankPicker(false);
                    setBankQuery("");
                  }}
                  style={{ paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#EEE" }}
                >
                  <MediumText>{item.name}</MediumText>
                </TouchableOpacity>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
