import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config";
import { ErrorToast, SuccessToast } from "@/components/common/Toasts";
import useAuthStore from "@/store/authStore";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { registerForPushNotifications } from "./notification";

export const UseAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const setToken = useAuthStore((state) => state.setToken);
  const token = useAuthStore((state) => state.token);
  const userInfo = useAuthStore((state) => state.userInfo);

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string
  ) => {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      const existingToken = await SecureStore.getItemAsync("deviceToken");
      let deviceToken;

      if (!existingToken) {
        deviceToken = await registerForPushNotifications();
        if (deviceToken) {
          await SecureStore.setItemAsync("deviceToken", deviceToken);
        }
        console.log("New Device Token Generated:", deviceToken);
      } else {
        deviceToken = existingToken;
        console.log("Using Existing Device Token:", deviceToken);
      }

      let user_role = "vendor";
      let data = {
        email,
        password,
        firstName,
        lastName,
        phone,
        user_role,
        deviceToken,
      };

      let config = {
        method: "post",
        url: `${BASE_URL}/auth/register`,
        data,
      };

      const response = await axios.request(config);
      const res = JSON.parse(JSON.stringify(response.data));

      // Store moreDetails status
      await SecureStore.setItemAsync("moreDetails", "false");

      SuccessToast(res.message);
      setIsSuccess(true);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(true);
      const response = error.response?.data;
      ErrorToast(response?.error || "Registration failed");
      setError(response?.error);
      console.log(response?.error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setIsSuccess(false);

      // Get or generate device token
      const existingToken = await SecureStore.getItemAsync("deviceToken");
      let deviceToken;

      if (!existingToken) {
        deviceToken = await registerForPushNotifications();
        if (deviceToken) {
          await SecureStore.setItemAsync("deviceToken", deviceToken);
        }
        console.log("[Login] New Device Token:", deviceToken);
      } else {
        deviceToken = existingToken;
        console.log("[Login] Using Existing Device Token:", deviceToken);
      }

      const loginPayload = {
        email,
        password,
        role: "vendor",
      };

      console.log(
        "[Login] Request Payload:",
        JSON.stringify(loginPayload, null, 2)
      );

      const config = {
        method: "post",
        url: `${BASE_URL}/auth/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: loginPayload,
      };

      console.log("[Login] API URL:", config.url);
      console.log("[Login] Headers:", config.headers);

      const response = await axios.request(config);
      console.log(
        "[Login] Response Data:",
        JSON.stringify(response.data, null, 2)
      );

      // Handle email verification
      if (!response.data.user_verified) {
        ErrorToast("Please verify your email address");
        router.push({
          pathname: "/VerifyMail",
          params: { mail: email },
        });
        return;
      }

      const { token, ...userData } = response.data;

      // Store user data and token
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(userData));

      // Update global state
      setUserInfo(JSON.stringify(userData));
      setToken(token);

      // // Check moreDetails status
      // if (
      //   !userData.moreDetails ||
      //   Object.keys(userData.moreDetails).length === 0
      // ) {
      //   console.log("Profile incomplete - redirecting to MoreDetails");
      //   router.push("/MoreDetails");
      //   return;
      // }

      SuccessToast(`Welcome back Chef ${userData.firstName}!`);
      setIsSuccess(true);
      router.push("/(tabs)");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      console.error("Login Error:", error.response?.data);
      ErrorToast(errorMessage);

      if (error.response?.data?.user_verified === false) {
        router.push({
          pathname: "/VerifyMail",
          params: { mail: email },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyUser = async (otp: any, mail: string) => {
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

  const getOrders = async () => {
    setIsLoading(true);
    setIsSuccess(false);

    const config = {
      method: "get",
      url: `${BASE_URL}order/vendor/${userInfo._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);
      setData(response.data.order);
      setIsLoading(false);
      setIsSuccess(true);
      return response.data;
    } catch (error: any) {
      ErrorToast(error.response?.data?.error || "Failed to fetch orders");
      setIsLoading(false);
      console.error("Get Orders Error:", error.response?.data);
      throw error;
    }
  };

  const getMenu = async () => {
    setIsLoading(true);
    setIsSuccess(false);

    const config = {
      method: "get",
      url: `${BASE_URL}/product/get/${userInfo._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.request(config);
      setData(response.data.data);
      setIsLoading(false);
      setIsSuccess(true);
      return response.data;
    } catch (error: any) {
      ErrorToast(error.response?.data?.error || "Failed to fetch menu");
      setIsLoading(false);
      console.error("Get Menu Error:", error.response?.data);
      throw error;
    }
  };

  interface MenuData {
    name: string;
    description: string;
    price: any;
    image?: string;
  }

  const addMenu = async (menuData: MenuData) => {
    setIsLoading(true);
    setIsSuccess(false);

    const formData = new FormData();
    formData.append("name", menuData.name);
    formData.append("description", menuData.description);
    formData.append("price", menuData.price);
    formData.append("available", "false"); // Add available as false by default

    if (menuData.image) {
      const response = await fetch(menuData.image);
      const blob = await response.blob();
      formData.append("image", blob, "menu_image.jpg");
    }

    const config = {
      method: "post",
      url: `${BASE_URL}/menu`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      const response = await axios.request(config);
      SuccessToast(`${menuData.name} added successfully`);
      setIsLoading(false);
      setIsSuccess(true);
      return response.data;
    } catch (error: any) {
      ErrorToast(error.response?.data?.error || "Failed to add menu item");
      setIsLoading(false);
      console.error("Add Menu Error:", error.response?.data);
      throw error;
    }
  };

  const editMenu = async (menuId: any, menuData: any) => {
    setIsLoading(true);
    setIsSuccess(false);

    const formData = new FormData();
    formData.append("name", menuData.name);
    formData.append("description", menuData.description);
    formData.append("price", menuData.price);

    if (menuData.image) {
      const response = await fetch(menuData.image);
      const blob = await response.blob();
      formData.append("image", blob, "menu_image.jpg");
    }

    const config = {
      method: "put",
      url: `${BASE_URL}/menu/${menuId}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      const response = await axios.request(config);
      SuccessToast("Menu item updated successfully");
      setIsLoading(false);
      setIsSuccess(true);
      return response.data;
    } catch (error: any) {
      ErrorToast(error.response?.data?.error || "Failed to update menu item");
      setIsLoading(false);
      console.error("Edit Menu Error:", error.response?.data);
      throw error;
    }
  };

  const getTransactions = async (id: any) => {
    setIsLoading(true);
    setIsSuccess(false);

    const config = {
      method: "get",
      url: `${BASE_URL}/transactions/wallet-transaction/vendor/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
        setIsSuccess(true);
        return response.data;
      })
      .catch((error) => {
        ErrorToast(
          error.response?.data?.error || "Failed to fetch transactions"
        );
        console.log("Transaction error:", error.response);
        setIsLoading(false);
      });
  };

  interface BusinessHours {
    day: string;
    openingTime: string;
    closingTime: string;
  }

  interface RestaurantDetails {
    profileImage: string;
    restaurantName: string;
    description: string;
    address: string;
    city: string;
    businessHours: BusinessHours[];
  }

  const addRestaurantDetails = async (details: RestaurantDetails) => {
    setIsLoading(true);
    setIsSuccess(false);

    const formData = new FormData();
    formData.append("restaurantName", details.restaurantName);
    formData.append("description", details.description);
    formData.append("address", details.address);
    formData.append("city", details.city);
    formData.append("businessHours", JSON.stringify(details.businessHours));

    if (details.profileImage) {
      const response = await fetch(details.profileImage);
      const blob = await response.blob();
      formData.append("profileImage", blob, "profile_image.jpg");
    }

    const config = {
      method: "post",
      url: `${BASE_URL}/restaurant`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      const response = await axios.request(config);
      SuccessToast("Restaurant details added successfully");
      setIsLoading(false);
      setIsSuccess(true);
      return response.data;
    } catch (error: any) {
      ErrorToast(
        error.response?.data?.error || "Failed to add restaurant details"
      );
      setIsLoading(false);
      console.error("Add Restaurant Error:", error.response?.data);
      throw error;
    }
  };

  return {
    isLoading,
    isSuccess,
    error,
    data, // This is the shared state that components can use
    signup,
    login,
    verifyUser,
    resendOtp,
    reachUs,
    getOrders,
    getMenu,
    addMenu,
    editMenu,
    getTransactions,
    addRestaurantDetails,
  };
};
