import api from "./api";
import type { Bank, PayoutAccount, WalletSummary } from "@/types";

export const walletApi = {
  summary: (page = 1) =>
    api.get("/wallet", { params: { page, limit: 30 } }).then((r) => r.data as WalletSummary),
  banks: () => api.get("/wallet/banks").then((r) => (r.data.banks || []) as Bank[]),
  resolveAccount: (accountNumber: string, bankCode: string) =>
    api
      .get("/wallet/resolve-account", {
        params: { account_number: accountNumber, bank_code: bankCode },
      })
      .then((r) => r.data.accountName as string),
  savePayoutAccount: (input: { accountNumber: string; bankCode: string; bankName: string }) =>
    api.put("/wallet/payout-account", input).then((r) => r.data.payoutAccount as PayoutAccount),
  withdraw: (amount: number) =>
    api
      .post("/wallet/withdraw", { amount })
      .then((r) => r.data as { reference: string; amount: number; status: string; balance: number }),
};
