import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthResponse } from "./types";

interface AuthState {
  user: AuthResponse["user"] | null;
  token: string | null;
  setAuth: (data: AuthResponse) => void;
  logout: () => void;
}

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (data) => {
        setCookie("bd_token", data.token);
        setCookie("bd_role", data.user.role);
        set({ user: data.user, token: data.token });
      },
      logout: () => {
        deleteCookie("bd_token");
        deleteCookie("bd_role");
        set({ user: null, token: null });
      },
    }),
    // new key: old Mongo-era state (accessToken / _id) must not be reused
    { name: "bd-auth-storage-v2" }
  )
);
