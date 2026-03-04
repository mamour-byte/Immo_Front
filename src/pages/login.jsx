import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { API_URL } from './services/http';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Afficher un message si la session a expiré
  useEffect(() => {
    if (location.state?.sessionExpired) {
      setError('Votre session a expiré. Veuillez vous reconnecter.');
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
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

    try {
      const resp = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data;
      try {
        data = await resp.json();
      } catch (e) {
        data = {};
      }

      if (!resp.ok) {
        const msg = data.message || "Echec de connexion";
        setError(Array.isArray(msg) ? msg[0] : msg);
        setIsLoading(false);
        return;
      }
  
      const token = data.access_token || data.token;
      const user = data.user;
  
      if (token) {
        const role = user?.role || decodeJwtPayload(token)?.role;
        if (role !== 'ADMIN') {
          setError("Ce compte n'a pas les droits administrateur.");
          setIsLoading(false);
          return;
        }

        // Stocker le timestamp de connexion (en millisecondes)
        const loginTimestamp = Date.now();
        if (rememberMe) {
          localStorage.setItem("jwt", token);
          localStorage.setItem("jwtTimestamp", loginTimestamp.toString());
          if (user) localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("jwt", token);
          sessionStorage.setItem("jwtTimestamp", loginTimestamp.toString());
          if (user) sessionStorage.setItem("user", JSON.stringify(user));
        }
        navigate("/admin");
      } else {
        setError("Token manquant dans la réponse serveur");
      }
    } catch (err) {
      setError("Erreur réseau ou serveur : " + err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Connexion Admin
          </h1>
          <p className="text-slate-600">
            Accédez à votre espace d'administration
          </p>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
                  placeholder="admin@ethic.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-900 cursor-pointer"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  Se souvenir de moi
                </span>
              </label>
              <Link
                to="/admin/forgot-password"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            ← Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}