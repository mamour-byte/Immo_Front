// hooks/useProperties.js
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import * as api from "../services/propertiesApi";
import toast from "react-hot-toast";

const DEFAULT_PAGE_SIZE = 10;

function getErrorMessage(error, fallback) {
  const msg =
    error?.response?.data?.message ||
    error?.message ||
    fallback;
  return Array.isArray(msg) ? msg[0] : msg;
}

// ----- Cities -----
export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: api.fetchCities,
    staleTime: 60 * 60 * 1000,
  });
}

// ----- Districts -----
export function useDistricts() {
  return useQuery({
    queryKey: ["districts"],
    queryFn: api.fetchDistricts,
    staleTime: 60 * 60 * 1000,
  });
}

// ----- Properties -----
export function useProperties(params) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => api.fetchProperties(params),
    staleTime: 10_000,
    placeholderData: keepPreviousData,
  });
}

export function useMyProperties(params) {
  return useQuery({
    queryKey: ["my-properties", params],
    queryFn: () => api.fetchMyProperties(params),
    staleTime: 10_000,
    placeholderData: keepPreviousData,
  });
}

// ----- Create -----
export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createProperty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"], exact: false });
      toast.success("Bien créé");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erreur lors de la création")),
  });
}

// ----- Update -----
export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => api.updateProperty(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"], exact: false });
      toast.success("Bien mis à jour");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erreur lors de la mise à jour")),
  });
}

// ----- Delete -----
export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteProperty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"], exact: false });
      toast.success("Bien supprimé");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erreur lors de la suppression")),
  });
}

// ----- Upload Images -----
export function useUploadImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ propertyId, files }) =>
      api.uploadPropertyImages(propertyId, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["properties"], exact: false });
      toast.success("Images uploadées");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Erreur upload images")),
  });
}

// ----- Create Property WITH IMAGES (Unified route) -----
export function useCreatePropertyWithImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, files }) => api.createPropertyWithImages(payload, files),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["properties"], exact: false });
      toast.success(data?.message || "Bien créé avec images");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Erreur lors de la création"));
    },
  });
}
