import axios, { AxiosError } from "axios";
import { router } from "expo-router";
import { BASE_URL } from "@/config";
import useAuthStore from "@/store/authStore";

const api = axios.create({ baseURL: BASE_URL, timeout: 30000 });

api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let loggingOut = false;
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = String(error.response?.data?.error || "");
    const sessionInvalid =
      status === 401 ||
      (status === 400 && message === "Account not found") ||
      (status === 403 && message === "Account has been suspended");

    if (sessionInvalid && useAuthStore.getState().token && !loggingOut) {
      loggingOut = true;
      try {
        await useAuthStore.getState().logout();
        router.replace("/Login");
      } finally {
        loggingOut = false;
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  const err = error as AxiosError<any>;
  if (err?.response?.data) {
    const data = err.response.data;
    return data.error || data.message || fallback;
  }
  if (err?.code === "ECONNABORTED") return "The request timed out. Check your connection.";
  if (err?.message === "Network Error") return "No internet connection";
  return fallback;
};

export default api;
