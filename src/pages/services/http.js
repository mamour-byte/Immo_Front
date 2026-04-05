export const API_URL = import.meta.env.VITE_API_URL || "https://immo-backend-b2x5.onrender.com";

export async function apiGet(path, params = {}) {
  const query = new URLSearchParams();
  
  // Traiter chaque paramètre, en gérant les tableaux correctement
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      // Pour les tableaux, ajouter chaque élément séparément
      value.forEach(v => query.append(key, v));
    } else if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  }
  
  const url = `${API_URL}${path}${query.toString() ? `?${query.toString()}` : ""}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Erreur API ${res.status}`);
  }
  return res.json();
}
