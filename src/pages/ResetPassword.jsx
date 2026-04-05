import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound, Lock } from "lucide-react";
import { API_URL } from "./services/http";
import { trackEvent } from "../lib/analytics";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Le lien de reinitialisation est incomplet ou invalide.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      const resp = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      let data;
      try {
        data = await resp.json();
      } catch {
        data = {};
      }

      if (!resp.ok) {
        const rawMessage = data.message || "Impossible de reinitialiser le mot de passe.";
        const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
        trackEvent("auth_reset_password_failed", {
          status_code: resp.status,
          reason: String(message),
        });
        setError(message);
        return;
      }

      trackEvent("auth_reset_password_success");
      setSuccess(data.message || "Votre mot de passe a ete reinitialise avec succes.");
      setPassword("");
      setConfirmPassword("");
      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1800);
    } catch (err) {
      trackEvent("auth_reset_password_failed", {
        reason: "network_or_server_error",
      });
      setError(`Erreur reseau ou serveur: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-slate-600">
            Choisissez un mot de passe fort pour securiser votre compte.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {!token && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <KeyRound size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-amber-700">
                Ce lien est invalide. Redemandez un email de reinitialisation.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-700">{success}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
                  placeholder="Au moins 8 caracteres"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
                  placeholder="Retapez votre mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Validation en cours..." : "Mettre a jour le mot de passe"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center flex flex-col items-center gap-2">
          <Link
            to="/admin/forgot-password"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Demander un nouveau lien
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour a la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
