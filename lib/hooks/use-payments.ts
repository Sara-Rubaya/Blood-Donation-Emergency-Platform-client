import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { ApiResponse, Payment } from "../types";

interface InitiatePaymentInput {
  requestId: string;
  purpose: Payment["purpose"];
}

interface InitiatePaymentResponse {
  transactionId: string;
  payment: Payment;
  gatewayUrl?: string; // set when a real gateway (Stripe) is wired in
}

// Amount is decided by the server, never sent from the browser
export const useInitiatePayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: InitiatePaymentInput) => {
      const { data } = await api.post<ApiResponse<InitiatePaymentResponse>>(
        "/payments/initiate",
        input
      );
      return data.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my-payments"] }),
  });
};

export const useMyPayments = () => {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Payment[]>>("/payments/mine");
      return data.data;
    },
  });
};
