import { useState } from "react";
import { router } from "expo-router";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import { authApi } from "@/services/auth";
import { getErrorMessage } from "@/services/api";
import { startSession } from "@/services/session";
import { isProfileComplete } from "@/store/authStore";
import useAuthStore from "@/store/authStore";

/**
 * Auth/contact actions for the onboarding screens.
 * Each action resolves to true on success so screens can navigate after awaiting it.
 */
export const UseAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await fn();
      return true;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ) =>
    run(async () => {
      try {
        const res = await authApi.register({ email, password, firstName, lastName, phone });
        SuccessToast(res.message || "Account created. Check your email for a code.");
      } catch (error) {
        ErrorToast(getErrorMessage(error, "Registration failed"));
        throw error;
      }
    });

  const login = (email: string, password: string) =>
    run(async () => {
      try {
        const { token, ...user } = await authApi.login(email.trim(), password);
        await startSession(token, user);
        const userInfo = useAuthStore.getState().userInfo;
        SuccessToast(`Welcome back Chef ${user.firstName || ""}!`.trim());
        router.replace(isProfileComplete(userInfo) ? "/(tabs)" : "/MoreDetails");
      } catch (error: any) {
        if (error?.response?.data?.user_verified === false) {
          ErrorToast("Please verify your email address");
          router.push({ pathname: "/VerifyMail", params: { mail: email } });
        } else {
          ErrorToast(getErrorMessage(error, "Login failed"));
        }
        throw error;
      }
    });

  const verifyUser = (otp: string, email: string) =>
    run(async () => {
      try {
        await authApi.verify(email, otp);
        SuccessToast("OTP Verification was successful");
      } catch (error) {
        ErrorToast(getErrorMessage(error, "Verification failed"));
        throw error;
      }
    });

  const resendOtp = async (email: string) => {
    try {
      await authApi.resendOtp(email);
      SuccessToast("An OTP code has been sent to your email address");
    } catch (error) {
      ErrorToast(getErrorMessage(error, "Could not resend code"));
    }
  };

  const reachUs = (message: string, email: string) =>
    run(async () => {
      try {
        await authApi.contact(message, email);
        SuccessToast("Message sent successfully");
      } catch (error) {
        ErrorToast(getErrorMessage(error, "Failed to send message"));
        throw error;
      }
    });

  return { isLoading, signup, login, verifyUser, resendOtp, reachUs };
};
