import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import { ApiResponse } from "../types";

export interface Donation {
  id: string;
  donorId: string;
  requestId?: string | null;
  unitsDonated: number;
  donatedAt: string;
  location?: string | null;
  request?: {
    patientName: string;
    hospitalName: string;
    city: string;
    bloodGroup: string;
  } | null;
}

export const useMyDonations = () => {
  return useQuery({
    queryKey: ["my-donations"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Donation[]>>("/donations/mine");
      return data.data;
    },
  });
};
