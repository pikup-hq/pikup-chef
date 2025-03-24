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
        console.log("New Device Token Generated:", deviceToken);
      } else {
        deviceToken = existingToken;
        console.log("Using Existing Device Token:", deviceToken);
      }

      const config = {
        method: "post",
        url: `${BASE_URL}/auth/login`,
        data: {
          email,
          password,
          deviceToken,
        },
      };

      const response = await axios.request(config);

      if (response.data.user_verified === false) {
        console.log("Verified?:", response.data?.user_verified);
        WarningToast("Verify your Email address");
        router.push({
          pathname: "/VerifyMail",
          params: { mail: email },
        });
        return;
      }

      let token = response.data.token;
      let user = response.data;

      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("user", JSON.stringify(user));

      setUserInfo(JSON.stringify(user));
      setToken(token);

      console.log("Auth token:", token);
      console.log("User data:", user);

      SuccessToast(`Welcome back Chef ${user.firstName}!`);
      setIsSuccess(true);
    } catch (error: any) {
      ErrorToast(error.response?.data?.error || "Login failed");
      console.error("Login error:", error.response?.data);
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
