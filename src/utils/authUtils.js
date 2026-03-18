import { resetAnalytics } from "../lib/analytics";

// Durée de session en millisecondes (7 jours par défaut)
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

/**
 * Vérifie si la session est expirée
 * @returns {boolean} true si la session est expirée, false sinon
 */
export function isSessionExpired() {
  // Vérifier localStorage
  const lsToken = localStorage.getItem("jwt");
  const lsTimestamp = localStorage.getItem("jwtTimestamp");
  
  if (lsToken && lsTimestamp) {
    const elapsed = Date.now() - parseInt(lsTimestamp, 10);
    return elapsed > SESSION_TIMEOUT;
  }

  // Vérifier sessionStorage
  const ssToken = sessionStorage.getItem("jwt");
  const ssTimestamp = sessionStorage.getItem("jwtTimestamp");
  
  if (ssToken && ssTimestamp) {
    const elapsed = Date.now() - parseInt(ssTimestamp, 10);
    return elapsed > SESSION_TIMEOUT;
  }

  // Pas de session
  return false;
}

/**
 * Efface la session complètement
 */
export function clearSession() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("jwtTimestamp");
  localStorage.removeItem("user");
  sessionStorage.removeItem("jwt");
  sessionStorage.removeItem("jwtTimestamp");
  sessionStorage.removeItem("user");
  resetAnalytics();
}

/**
 * Obtient le temps restant avant expiration (en secondes)
 * @returns {number} secondes restantes, ou -1 si pas de session
 */
export function getTimeUntilSessionExpires() {
  const lsTimestamp = localStorage.getItem("jwtTimestamp");
  const ssTimestamp = sessionStorage.getItem("jwtTimestamp");
  
  const timestamp = lsTimestamp || ssTimestamp;
  
  if (!timestamp) {
    return -1;
  }

  const elapsed = Date.now() - parseInt(timestamp, 10);
  const remaining = Math.max(0, SESSION_TIMEOUT - elapsed);
  return Math.floor(remaining / 1000); // Convertir en secondes
}

/**
 * Réinitialise le timestamp de session (utile pour l'inactivité)
 */
export function refreshSessionTimestamp() {
  const loginTimestamp = Date.now();
  
  if (localStorage.getItem("jwt")) {
    localStorage.setItem("jwtTimestamp", loginTimestamp.toString());
  }
  
  if (sessionStorage.getItem("jwt")) {
    sessionStorage.setItem("jwtTimestamp", loginTimestamp.toString());
  }
}
