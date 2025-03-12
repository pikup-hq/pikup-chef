// This file contains functions to interact with the Paystack API
import Constants from "expo-constants";

/**
 * Fetches the list of banks from Paystack API
 */
export async function getBanks() {
  try {
    const response = await fetch("https://api.paystack.co/bank", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Constants.expoConfig?.extra?.paystackSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.status) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch banks");
    }
  } catch (error) {
    console.error("Error fetching banks:", error);
    throw error;
  }
}

/**
 * Verifies an account number with a bank code
 * @param accountNumber - The account number to verify
 * @param bankCode - The bank code
 */
export async function verifyAccountNumber(
  accountNumber: string,
  bankCode: string
) {
  try {
    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Constants.expoConfig?.extra?.paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error verifying account:", error);
    throw error;
  }
}
