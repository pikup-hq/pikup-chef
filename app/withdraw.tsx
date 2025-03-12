"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getBanks, verifyAccountNumber } from "@/utilities/paystack";
import { MediumText } from "@/components/common/AppText";
import COLORS from "@/constants/colors";
import { ErrorToast } from "@/components/common/Toasts";

interface Bank {
  id: number;
  name: string;
  code: string;
}

export default function WithdrawScreen() {
  const { walletBalance } = useLocalSearchParams();

  // Format amount with commas
  const formatAmount = (value: string) => {
    // Remove non-numeric characters
    const numbers = value.replace(/[^\d]/g, "");
    // Format with commas
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Validate amount against wallet balance
  const validateAmount = (value: string) => {
    const numericAmount = Number(value.replace(/[^\d]/g, ""));
    if (numericAmount > Number(walletBalance)) {
      ErrorToast("Amount exceeds available balance");
      return false;
    }
    return true;
  };

  // Modify amount input handler
  const handleAmountChange = (value: string) => {
    const formattedAmount = formatAmount(value);
    if (validateAmount(value)) {
      setAmount(formattedAmount);
    }
  };

  const [amount, setAmount] = useState("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedBankName, setSelectedBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const banksData = await getBanks();
        setBanks(banksData);
      } catch (error) {
        console.error("Failed to fetch banks:", error);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const verifyAccount = async () => {
      if (accountNumber.length === 10 && selectedBank) {
        setIsVerifying(true);
        setAccountName("");
        try {
          const data = await verifyAccountNumber(accountNumber, selectedBank);
          if (data.status) {
            setAccountName(data.data.account_name);
          }
        } catch (error) {
          console.error("Failed to verify account:", error);
        } finally {
          setIsVerifying(false);
        }
      }
    };

    verifyAccount();
  }, [accountNumber, selectedBank]);

  const handleWithdraw = async () => {
    if (!amount || !selectedBank || !accountNumber || !accountName) return;

    setIsLoading(true);
    try {
      // Here you would implement the actual withdrawal logic
      // using Paystack's transfer API or your backend
      console.log("Processing withdrawal", {
        amount,
        bank: selectedBank,
        accountNumber,
        accountName,
      });

      // Simulate success
      setTimeout(() => {
        router.push("/withdrawalSuccess");
      }, 2000);
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankSelect = (bankCode: string) => {
    setSelectedBank(bankCode);
    const bank = banks.find((b) => b.code === bankCode);
    if (bank) {
      setSelectedBankName(bank.name);
    }
    setShowPicker(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingTop: 40,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <MediumText style={{ fontSize: 18, fontWeight: "500" }}>
          Withdraw
        </MediumText>
        <View></View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Form */}
        <View style={{ marginTop: 20 }}>
          <MediumText
            style={{ fontSize: 14, fontWeight: "500", marginBottom: 8 }}
          >
            Amount
          </MediumText>
          <TextInput
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="₦10,000"
            keyboardType="numeric"
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: 8,
              fontFamily: "Sen-Regular",
              padding: 16,
              fontSize: 14,
              marginBottom: 20,
            }}
          />

          <MediumText
            style={{ fontSize: 14, fontWeight: "500", marginBottom: 8 }}
          >
            Bank Name
          </MediumText>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: 8,
              padding: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <MediumText
              style={{ color: selectedBank ? "black" : "#999", fontSize: 14 }}
            >
              {selectedBankName || "Please select your bank"}
            </MediumText>
            <Ionicons name="chevron-down" size={20} color="#999" />
          </TouchableOpacity>

          {showPicker && (
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#eee",
                marginBottom: 20,
                maxHeight: 200,
              }}
            >
              <ScrollView>
                {banks.map((bank) => (
                  <TouchableOpacity
                    key={bank.id}
                    onPress={() => handleBankSelect(bank.code)}
                    style={{
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                  >
                    <Text>{bank.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <MediumText
            style={{ fontSize: 14, fontWeight: "500", marginBottom: 8 }}
          >
            Account No
          </MediumText>
          <TextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Please enter your account number"
            keyboardType="numeric"
            maxLength={10}
            style={{
              backgroundColor: "#F5F5F5",
              borderRadius: 8,
              fontFamily: "Sen-Regular",
              padding: 13,
              fontSize: 16,
              marginBottom: 20,
            }}
          />

          {isVerifying && (
            <View style={{ marginBottom: 20 }}>
              <MediumText style={{ color: "#666", fontSize: 13 }}>
                Verifying account...
              </MediumText>
            </View>
          )}

          {accountName ? (
            <View
              style={{
                backgroundColor: `${COLORS.lightOrange}50`,
                padding: 16,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <MediumText style={{ fontSize: 13, fontWeight: "500" }}>
                Account Name: {accountName}
              </MediumText>
              <MediumText style={{ fontSize: 13, marginTop: 4 }}>
                Account Number: {accountNumber}
              </MediumText>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Withdraw Button */}
      <View style={{ padding: 16 }}>
        <TouchableOpacity
          onPress={handleWithdraw}
          disabled={
            !amount ||
            !selectedBank ||
            Number(amount.replace(/[^\d]/g, "")) > Number(walletBalance) ||
            !accountNumber ||
            !accountName ||
            isLoading
          }
          style={{
            backgroundColor:
              !amount ||
              !selectedBank ||
              Number(amount.replace(/[^\d]/g, "")) > Number(walletBalance) ||
              !accountNumber ||
              !accountName ||
              isLoading
                ? "#999"
                : "#1A1A1A",
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              Withdraw
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
