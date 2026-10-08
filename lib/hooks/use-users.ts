import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { ApiResponse, User } from "../types";
import { useAuthStore } from "../auth-store";

export const useMyProfile = () => {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>("/users/me");
      return data.data;
    },
    enabled: !!token,
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const { data } = await api.patch<ApiResponse<User>>(
        "/users/me",
        updates
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
};

export const useDonorSearch = (filters: {
  bloodGroup?: string;
  city?: string;
}) => {
  return useQuery({
    queryKey: ["donors", filters],
    queryFn: async () => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v)
      );
      const { data } = await api.get<ApiResponse<User[]>>("/users/donors", {
        params,
      });
      return data.data;
    },
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>("/users");
      return data.data;
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-users"] }),
  });
};
