import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "./services/http";

export default function AgentApply() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    companyName: "",
    bio: "",
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp = await fetch(`${API_URL}/agent-applications/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const msg = data?.message || "Erreur lors de l'envoi";
        toast.error(Array.isArray(msg) ? msg[0] : msg);
        setIsLoading(false);
        return;
      }

      toast.success(data?.message || "Demande envoyée");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error("Erreur réseau: " + err.message);
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Demande de compte agent</h1>
          <p className="text-slate-600">Remplissez le formulaire. Votre demande sera étudiée par un admin.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nom complet" name="fullName" value={form.fullName} onChange={onChange} />
              <Field label="Téléphone" name="phone" value={form.phone} onChange={onChange} />
            </div>
            <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
            <Field label="Mot de passe (min 8)" name="password" type="password" value={form.password} onChange={onChange} required />
            <Field label="Entreprise (optionnel)" name="companyName" value={form.companyName} onChange={onChange} />
            <TextArea label="Bio (optionnel)" name="bio" value={form.bio} onChange={onChange} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Envoi..." : "Envoyer la demande"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <textarea
        {...props}
        rows={4}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
      />
    </div>
  );
}

