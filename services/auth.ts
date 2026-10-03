import api from "./api";
import type { UserInfo, VendorDetails } from "@/types";

const pickVendorDetails = (vendor: any): VendorDetails | null =>
  vendor
    ? {
        address: vendor.address,
        city: vendor.city,
        state: vendor.state,
        website: vendor.website,
        operation: vendor.operation,
        description: vendor.description,
        operatingDay: vendor.operatingDay,
        operatingTime: vendor.operatingTime,
        rating: vendor.rating,
        hasPayoutAccount: vendor.hasPayoutAccount ?? !!vendor.payoutAccount?.recipientCode,
      }
    : null;

export const normalizeUser = (data: any): UserInfo => ({
  _id: data._id,
  name: data.name || [data.firstName, data.lastName].filter(Boolean).join(" "),
  firstName: data.firstName,
  lastName: data.lastName,
  email: data.email,
  phone: data.phone,
  avatar: data.avatar,
  user_verified: data.user_verified,
  moreDetails: pickVendorDetails(data.moreDetails),
});

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password, role: "vendor" }).then((r) => r.data),
  register: (payload: Record<string, any>) =>
    api.post("/auth/register", { ...payload, user_role: "vendor" }).then((r) => r.data),
  verify: (email: string, otp: string) =>
    api.post("/auth/verify", { email, otp }).then((r) => r.data),
  resendOtp: (email: string) => api.post("/auth/resend-otp", { email }).then((r) => r.data),
  me: () => api.get("/auth/me").then((r) => normalizeUser(r.data)),
  editVendor: (payload: Record<string, any>) =>
    api.patch("/auth/edit-vendor", payload).then((r) => r.data),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.patch("/auth/change-password", { oldPassword, newPassword }).then((r) => r.data),
  saveDeviceToken: (deviceToken: string | null) =>
    api.post("/auth/save-device-token", { deviceToken }).then((r) => r.data),
  contact: (message: string, email: string) =>
    api.post("/message", { message, email }).then((r) => r.data),
};
