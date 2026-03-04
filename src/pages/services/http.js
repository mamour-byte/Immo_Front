export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiGet(path, params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}${path}${query ? `?${query}` : ""}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erreur API ${res.status}`);
  }
  return res.json();
}
