import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import {
  ApiResponse,
  BloodGroup,
  BloodRequest,
  DonationMatch,
  MatchStatus,
  RequestStatus,
  UrgencyLevel,
} from "../types";

interface RequestFilters {
  status?: string;
  bloodGroup?: string;
  city?: string;
}

export const useBloodRequests = (filters: RequestFilters = {}) => {
  return useQuery({
    queryKey: ["blood-requests", filters],
    queryFn: async () => {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get<ApiResponse<BloodRequest[]>>("/blood-requests", { params });
      return data.data;
    },
  });
};

export const useBloodRequest = (id: string) => {
  return useQuery({
    queryKey: ["blood-request", id],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<BloodRequest>>(`/blood-requests/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export interface CreateRequestInput {
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  city: string;
  urgency: UrgencyLevel;
  requiredBy: string; // yyyy-mm-dd from <input type="date">
  notes?: string;
}

export const useCreateBloodRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateRequestInput) => {
      const { data } = await api.post<ApiResponse<BloodRequest>>("/blood-requests", {
        ...input,
        // backend validates z.string().datetime() → needs a full ISO timestamp
        requiredBy: new Date(input.requiredBy).toISOString(),
        notes: input.notes || undefined,
      });
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blood-requests"] }),
  });
};

// Donor volunteers → creates a DonationMatch and flips the request to MATCHED
export const useVolunteer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      const { data } = await api.post<ApiResponse<DonationMatch>>(
        `/blood-requests/${requestId}/volunteer`
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blood-requests"] }),
  });
};

// Requester/Admin: ACCEPTED | REJECTED | COMPLETED (COMPLETED also logs the donation)
export const useRespondToMatch = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ matchId, status }: { matchId: string; status: Exclude<MatchStatus, "PENDING"> }) => {
      const { data } = await api.patch<ApiResponse<DonationMatch>>(
        `/blood-requests/matches/${matchId}`,
        { status }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["blood-requests"] });
      qc.invalidateQueries({ queryKey: ["my-donations"] });
    },
  });
};

export const useUpdateRequestStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, status }: { requestId: string; status: RequestStatus }) => {
      const { data } = await api.patch<ApiResponse<BloodRequest>>(
        `/blood-requests/${requestId}/status`,
        { status }
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blood-requests"] }),
  });
};
