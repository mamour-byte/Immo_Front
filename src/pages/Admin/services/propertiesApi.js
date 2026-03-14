// services/propertiesApi.js
import axios from "axios";
import { clearSession } from "../../../utils/authUtils";

const API_URL = import.meta.env.VITE_API_URL || "https://immo-backend-b2x5.onrender.com";

function getJwt() {
  return localStorage.getItem("jwt") || sessionStorage.getItem("jwt") || null;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Accept": "application/json",
  },
});

// Interceptor pour ajouter le token automatiquement
api.interceptors.request.use((cfg) => {
  const token = getJwt();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Interceptor global: si 401/403 -> logout + redirect login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      clearSession();
      // éviter d'empiler l'historique
      window.location.replace("/login");
    }
    return Promise.reject(err);
  }
);

export async function fetchProperties(params = {}) {
  // Mapper les paramètres frontend vers ceux attendus par le backend
  // Ne garder que les valeurs non vides
  const backendParams = {
    page: params.page || 1,
    limit: params.pageSize || 10,
  };
  
  if (params.query && params.query.trim()) {
    backendParams.search = params.query.trim();
  }
  if (params.type && params.type.trim()) {
    backendParams.type = params.type;
  }
  if (params.purpose && params.purpose.trim()) {
    backendParams.purpose = params.purpose;
  }
  if (params.cityId && params.cityId !== "") {
    backendParams.cityId = Number(params.cityId);
  }
  if (params.districtId && params.districtId !== "") {
    backendParams.districtId = Number(params.districtId);
  }
  if (params.status && params.status.trim()) {
    backendParams.status = params.status;
  }
  if (params.sortField && params.sortField.trim()) {
    backendParams.sortBy = params.sortField;
  }
  if (params.sortDir && params.sortDir.trim()) {
    backendParams.order = params.sortDir;
  }
  
  const res = await api.get("/properties", { params: backendParams });
  // Le backend renvoie { items: [], total: N, page: X, totalPages: Y }
  return res.data;
}

export async function fetchMyProperties(params = {}) {
  const backendParams = {
    page: params.page || 1,
    limit: params.pageSize || 10,
  };

  if (params.query && params.query.trim()) {
    backendParams.search = params.query.trim();
  }
  if (params.type && params.type.trim()) {
    backendParams.type = params.type;
  }
  if (params.purpose && params.purpose.trim()) {
    backendParams.purpose = params.purpose;
  }
  if (params.cityId && params.cityId !== "") {
    backendParams.cityId = Number(params.cityId);
  }
  if (params.districtId && params.districtId !== "") {
    backendParams.districtId = Number(params.districtId);
  }
  if (params.status && params.status.trim()) {
    backendParams.status = params.status;
  }
  if (params.sortField && params.sortField.trim()) {
    backendParams.sortBy = params.sortField;
  }
  if (params.sortDir && params.sortDir.trim()) {
    backendParams.order = params.sortDir;
  }

  const res = await api.get("/properties/mine", { params: backendParams });
  return res.data;
}

export async function fetchCities() {
  const res = await api.get("/cities");
  return res.data;
}

export async function fetchDistricts() {
  const res = await api.get("/districts");
  return res.data;
}

export async function createProperty(payload) {
  // Correction mapping surface et ajout toilettes
  const mappedPayload = { ...payload };
  if (payload.surface) {
    mappedPayload.surfaceM2 = Number(payload.surface);
    delete mappedPayload.surface;
  }
  if (payload.toilets) {
    mappedPayload.toilets = Number(payload.toilets);
  }
  const res = await api.post("/properties", mappedPayload);
  return res.data;
}

export async function updateProperty(id, payload) {
  // Correction mapping surface et ajout toilettes
  const mappedPayload = { ...payload };
  if (payload.surface) {
    mappedPayload.surfaceM2 = Number(payload.surface);
    delete mappedPayload.surface;
  }
  if (payload.toilets) {
    mappedPayload.toilets = Number(payload.toilets);
  }
  const res = await api.patch(`/properties/${id}`, mappedPayload);
  return res.data;
}

export async function deleteProperty(id) {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
}

// Nouvelle route unifiée : crée la propriété ET upload les images en une seule requête
export async function createPropertyWithImages(payload, files = []) {
  const form = new FormData();
  
  // Correction mapping surface et ajout toilettes
  const mappedPayload = { ...payload };
  if (payload.surface) {
    mappedPayload.surfaceM2 = Number(payload.surface);
    delete mappedPayload.surface;
  }
  if (payload.toilets) {
    mappedPayload.toilets = Number(payload.toilets);
  }
  // Ajouter tous les champs du payload
  Object.keys(mappedPayload).forEach((key) => {
    const value = mappedPayload[key];
    if (value === null || value === undefined || value === "") return;
    
    if (Array.isArray(value)) {
      // Pour les arrays (features, assets3D, etc.)
      if (value.length === 0) return;
      if (typeof value[0] === "object") {
        form.append(key, JSON.stringify(value));
      } else {
        value.forEach((v) => form.append(`${key}[]`, v));
      }
    } else if (typeof value === "object") {
      form.append(key, JSON.stringify(value));
    } else {
      form.append(key, String(value));
    }
  });
  
  // Ajouter les fichiers images
  files.forEach((f) => form.append("images", f));
  
  const res = await api.post(`/properties/with-images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Route legacy : upload les images pour une propriété existante
export async function uploadPropertyImages(propertyId, files = []) {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));
  form.append("propertyId", String(propertyId));
  const res = await api.post(`/properties/upload-images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
