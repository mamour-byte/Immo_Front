import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as api from "../services/adminApi";

function getErrorMessage(error, fallback) {
  const msg = error?.response?.data?.message || error?.message || fallback;
  return Array.isArray(msg) ? msg[0] : msg;
}

export function useUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: api.fetchUsers,
    staleTime: 10_000,
    placeholderData: keepPreviousData,
  });
}

export function useAgentApplications(status) {
  return useQuery({
    queryKey: ["agent-applications", status || "ALL"],
    queryFn: () => api.fetchAgentApplications(status),
    staleTime: 10_000,
    placeholderData: keepPreviousData,
  });
}

export function useApproveApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decisionNote }) => api.approveAgentApplication(id, decisionNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent-applications"], exact: false });
      qc.invalidateQueries({ queryKey: ["admin-users"], exact: false });
      toast.success("Demande approuvée");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erreur lors de l'approbation")),
  });
}

export function useRejectApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decisionNote }) => api.rejectAgentApplication(id, decisionNote),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent-applications"], exact: false });
      toast.success("Demande refusée");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erreur lors du refus")),
  });
}

