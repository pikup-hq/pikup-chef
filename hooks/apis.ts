import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";
import {
  ErrorToast,
  SuccessToast,
  WarningToast,
} from "@/components/common/Toasts";
import useAuthStore from "@/store/authStore";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export const UseAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ) => {
    setIsLoading(true);
    setIsSuccess(false);

    let user_role = "vendor";

    let data = {
      email,
      password,
      firstName,
      lastName,
      phone,
      user_role,
    };

    let config = {
      method: "post",
      url: `${BASE_URL}/auth/register`,
      data,
    };

    axios
      .request(config)
      .then((response) => {
        const res = JSON.parse(JSON.stringify(response.data));
        SuccessToast(res.message);

        console.log("RESPONSE:", res);
        console.log("SUCCESS");

        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(true);

        const response = error.response.data;

        ErrorToast(response.error);
        setError(response.error);

        console.log(response.error);
        setIsLoading(false);
      });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setIsSuccess(false);

    console.log(email);
    console.log(password);

    let data = {
      email,
      password,
    };

    let config = {
      method: "post",
      url: `${BASE_URL}/auth/login`,
      data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.user_verified === false) {
          console.log("Verified?:", response.data?.user_verified);
          WarningToast("Verify your Email address");
          router.push({
            pathname: "/VerifyMail",
            params: { mail: `${email}` },
          });
        } else {
          let token = response.data.token;
          let user = response.data;

          SecureStore.setItemAsync("token", token);
          SecureStore.setItemAsync("user", JSON.stringify(user));

          console.log(token);
          console.log(response.data.user.addresses);
          console.log(user);

          console.log(JSON.stringify(user.email));

          setUserInfo(JSON.stringify(user));
          setToken(token);

          SuccessToast("Login successful");

          setIsLoading(false);
          setIsSuccess(true);
        }
      })
      .catch((error) => {
        ErrorToast(`${error.response.data.error}`);
        console.log(error.response);
        setIsLoading(false);
      });
  };

  const verifyUser = async (otp: number, mail: string) => {
    console.log("OTP:", otp);
    console.log("E-mail:", mail);

    setIsLoading(true);
    setIsSuccess(false);

    let data = { otp, email: mail };

    let config = {
      method: "post",
      url: `${BASE_URL}/auth/verify`,
      data,
    };

    axios
      .request(config)
      .then((res) => {
        console.log(res);
        setIsLoading(false);
        setIsSuccess(true);

        SuccessToast("OTP Verification was successful");
      })
      .catch((error) => {
        ErrorToast(`${error.response.data.error}`);
        console.log(error.response.data);

        setIsLoading(false);
      });
  };

  const resendOtp = async (email: string) => {
    let payload = {
      email,
    };

    let config1 = {
      method: "post",
      url: `${BASE_URL}/auth/resend-otp`,
      data: payload,
    };

    axios
      .request(config1)
      .then((res) => {
        console.log(res);
        SuccessToast("An OTP code has been sent to your email address");
      })
      .catch((error) => {
        ErrorToast(`${error.response.data.error}`);
        console.log(error.response.data);
      });
  };

  const reachUs = async (message: string, email: string) => {
    setIsLoading(true);
    setIsSuccess(false);

    const config = {
      method: "post",
      url: `${BASE_URL}/message`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        message,
        email,
      },
    };

    try {
      const response = await axios.request(config);
      SuccessToast("Message sent successfully");
      setIsLoading(false);
      setIsSuccess(true);
      return response.data;
    } catch (error: any) {
      ErrorToast(error.response?.data?.error || "Failed to send message");
      setIsLoading(false);
      console.error("Reach Us Error:", error.response?.data);
      throw error;
    }
  };

  return {
    isLoading,
    isSuccess,
    error,
    data,
    signup,
    login,
    verifyUser,
    resendOtp,
    reachUs,
  };
};
