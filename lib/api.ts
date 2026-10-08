import axios from "axios";
import { useAuthStore } from "./auth-store";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  // Neon suspends idle compute; the first query after a pause can take a few seconds
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // A wrong password also returns 401 — don't reload the login page and lose the toast
    const isAuthCall = String(error.config?.url ?? "").startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthCall) {
      useAuthStore.getState().logout();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Server is taking too long (database may be waking up). Please try again.";
    }
    const data = error.response?.data;
    // Backend validation errors: { message: "Validation failed", errors: [{ message, path }] }
    const first = data?.errors?.[0];
    if (first?.message) {
      const field = Array.isArray(first.path) ? first.path.filter((p: string) => p !== "body").join(".") : "";
      return field ? `${field}: ${first.message}` : first.message;
    }
    return data?.message || error.message || "Something went wrong";
  }
  return "Something went wrong";
};
