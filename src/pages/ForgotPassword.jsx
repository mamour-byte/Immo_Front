import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { API_URL } from "./services/http";
import { trackEvent } from "../lib/analytics";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const resp = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await resp.json();
      } catch {
        data = {};
      }

      if (!resp.ok) {
        const rawMessage = data.message || "Impossible d'envoyer le lien de reinitialisation.";
        const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;
        trackEvent("auth_forgot_password_failed", {
          status_code: resp.status,
          reason: String(message),
        });
        setError(message);
        return;
      }

      const message =
        data.message ||
        "Si un compte existe avec cet email, un lien de reinitialisation vient d'etre envoye.";
      trackEvent("auth_forgot_password_requested");
      setSuccess(message);
    } catch (err) {
      trackEvent("auth_forgot_password_failed", {
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
            Mot de passe oublie
          </h1>
          <p className="text-slate-600">
            Entrez votre email pour recevoir un lien de reinitialisation.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
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
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
                  placeholder="admin@ethic.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Envoi en cours..." : "Recevoir un lien"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
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
