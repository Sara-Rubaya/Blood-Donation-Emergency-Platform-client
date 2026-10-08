import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
import { ApiResponse, AuthResponse, BloodGroup } from "../types";
import { useAuthStore } from "../auth-store";

interface LoginInput {
  email: string;
  password: string;
}

// Field names must match the backend zod schema exactly (it forwards them to Prisma)
interface RegisterInput extends LoginInput {
  name: string;
  role: "DONOR" | "REQUESTER";
  bloodGroup?: BloodGroup;
  phone?: string;
  city?: string;
}

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", input);
      return data.data;
    },
    onSuccess: (data) => setAuth(data),
  });
};

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/register", input);
      return data.data;
    },
    onSuccess: (data) => setAuth(data),
  });
};
