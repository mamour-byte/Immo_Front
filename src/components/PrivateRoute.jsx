import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isSessionExpired, clearSession, getTimeUntilSessionExpires } from '../utils/authUtils';

export default function PrivateRoute({ children, roles = ['ADMIN'] }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [sessionExpiringSoon, setSessionExpiringSoon] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);

  const getStoredUser = () => {
    const raw = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const decodeJwtPayload = (token) => {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) return null;
      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Vérifier l'authentification et l'expiration de session
    const checkAuth = () => {
      const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
      
      // Si pas de token, pas authentifié
      if (!token) {
        setRedirectTo('/login');
        setIsAuthenticated(false);
        return;
      }

      // Si session expirée, nettoyer et rediriger
      if (isSessionExpired()) {
        console.log("Session expirée");
        clearSession();
        setIsAuthenticated(false);
        navigate('/login', { state: { sessionExpired: true } });
        return;
      }

      // Vérifier que l'utilisateur est ADMIN (route utilisée pour l'admin)
      const storedUser = getStoredUser();
      const role =
        storedUser?.role ||
        decodeJwtPayload(token)?.role;

      if (!role) {
        clearSession();
        setRedirectTo('/login');
        setIsAuthenticated(false);
        return;
      }

      if (!roles.includes(role)) {
        // Ne pas dÃ©connecter : authentifiÃ© mais pas autorisÃ© pour cette route
        const target = role === 'ADMIN' ? '/admin' : role === 'AGENT' ? '/dashboard' : '/account';
        setRedirectTo(target);
        setIsAuthenticated(false);
        return;
      }

      setRedirectTo(null);
      setIsAuthenticated(true);

      // Vérifier si session expire dans les 2 minutes
      const timeRemaining = getTimeUntilSessionExpires();
      if (timeRemaining > 0 && timeRemaining <= 120) {
        setSessionExpiringSoon(true);
      }
    };

    checkAuth();

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkAuth, 30000);

    // Écouter les changements de storage
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  // En attente de vérification
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center min-h-screen"><p>Vérification...</p></div>;
  }

  // Non authentifié
  if (!isAuthenticated) {
    if (redirectTo) return <Navigate to={redirectTo} replace />;
    return <Navigate to="/login" replace />;
  }

  // Afficher un avertissement si session expire bientôt
  if (sessionExpiringSoon) {
    return (
      <div>
        <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b border-yellow-400 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-yellow-800 font-medium">⚠️ Votre session expire dans {getTimeUntilSessionExpires()} secondes. Veuillez vous reconnecter.</p>
          </div>
        </div>
        <div className="pt-16">
          {children}
        </div>
      </div>
    );
  }

  // Authentifié et session valide
  return children;
}
