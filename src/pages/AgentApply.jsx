
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "./services/http";

const PROFILE_TYPES = [
  { value: "INDEPENDENT", label: "Agent indépendant" },
  { value: "AGENCY", label: "Agence immobilière" },
  { value: "DEVELOPER", label: "Promoteur immobilier" },
];

export default function AgentApply() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    address: "",
    profileType: "INDEPENDENT",
    agencyName: "",
    yearsExperience: "",
    activityZone: "",
    managedPropertiesCount: "",
    websiteUrl: "",
    facebookUrl: "",
    whatsapp: "",
    publicPhone: "",
    languages: [],
    publicDescription: "",
    acceptedTerms: false,
    certifiedTrue: false,
  });
  const [files, setFiles] = useState({
    profilePhoto: null,
    idDocument: null,
    tradeRegister: null,
    professionalCard: null,
    agencyLogo: null,
    agencyPhoto: null,
  });

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (name === "languages") {
      setForm((f) => ({ ...f, languages: value.split(",").map((l) => l.trim()).filter(Boolean) }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  function onFileChange(e) {
    const { name, files: fileList } = e.target;
    setFiles((f) => ({ ...f, [name]: fileList[0] }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value ?? "");
        }
      });
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const resp = await fetch(`${API_URL}/agent-applications/apply-full`, {
        method: "POST",
        body: formData,
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

  const isAgency = form.profileType === "AGENCY";
  const isDeveloper = form.profileType === "DEVELOPER";
  const needsOrgName = isAgency || isDeveloper;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Demande de compte agent</h1>
          <p className="text-slate-600">Remplissez le formulaire. Votre demande sera étudiée par un admin.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <form className="space-y-5" onSubmit={onSubmit} encType="multipart/form-data">
            {/* 1. Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Prénom" name="firstName" value={form.firstName} onChange={onChange} required />
              <Field label="Nom" name="lastName" value={form.lastName} onChange={onChange} required />
              <Field label="Téléphone" name="phone" value={form.phone} onChange={onChange} required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
              <Field label="Ville" name="city" value={form.city} onChange={onChange} required />
              <Field label="Adresse" name="address" value={form.address} onChange={onChange} required />
              <Field label="Mot de passe (min 8)" name="password" type="password" value={form.password} onChange={onChange} required />
              <FileField label="Photo de profil" name="profilePhoto" onChange={onFileChange} required accept="image/*" />
            </div>

            {/* 2. Type de compte */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Type de profil</label>
              <select
                name="profileType"
                value={form.profileType}
                onChange={onChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
                required
              >
                {PROFILE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* 3. Informations professionnelles */}
            {needsOrgName && (
              <Field label="Nom de l'agence / société" name="agencyName" value={form.agencyName} onChange={onChange} required />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Années d'expérience" name="yearsExperience" type="number" min="0" value={form.yearsExperience} onChange={onChange} required />
              <Field label="Zone d'activité" name="activityZone" value={form.activityZone} onChange={onChange} required />
              <Field label="Nombre de biens gérés" name="managedPropertiesCount" type="number" min="0" value={form.managedPropertiesCount} onChange={onChange} required />
              <Field label="Site web (optionnel)" name="websiteUrl" value={form.websiteUrl} onChange={onChange} />
              <Field label="Page Facebook (optionnel)" name="facebookUrl" value={form.facebookUrl} onChange={onChange} />
            </div>

            {/* 4. Informations de contact public */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Numéro WhatsApp" name="whatsapp" value={form.whatsapp} onChange={onChange} required />
              <Field label="Numéro pour appel" name="publicPhone" value={form.publicPhone} onChange={onChange} required />
              <Field label="Langues parlées (séparées par virgule)" name="languages" value={form.languages.join(", ")} onChange={onChange} required />
            </div>
            <TextArea label="Description / présentation de l’agent" name="publicDescription" value={form.publicDescription} onChange={onChange} required />

            {/* 5. Vérification des agents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileField label="Pièce d'identité" name="idDocument" onChange={onFileChange} required accept="image/*,application/pdf" />
              {(isAgency) && (
                <FileField label="Registre de commerce" name="tradeRegister" onChange={onFileChange} required accept="image/*,application/pdf" />
              )}
              {(form.profileType === "INDEPENDENT" || isDeveloper) && (
                <FileField label="Document professionnel / carte agent immobilier (optionnel)" name="professionalCard" onChange={onFileChange} accept="image/*,application/pdf" />
              )}
            </div>

            {/* 6. Informations agence (conditionnel) */}
            {isAgency && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileField label="Logo de l'agence" name="agencyLogo" onChange={onFileChange} required accept="image/*" />
                <Field label="Adresse de l'agence" name="address" value={form.address} onChange={onChange} required />
                <FileField label="Photo de l'agence" name="agencyPhoto" onChange={onFileChange} required accept="image/*" />
              </div>
            )}

            {/* 7. Consentements */}
            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center">
                <input type="checkbox" name="acceptedTerms" checked={form.acceptedTerms} onChange={onChange} required className="mr-2" />
                J'accepte les conditions d’utilisation
              </label>
              <label className="inline-flex items-center">
                <input type="checkbox" name="certifiedTrue" checked={form.certifiedTrue} onChange={onChange} required className="mr-2" />
                Je certifie que les informations sont exactes
              </label>
            </div>

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

function FileField({ label, name, onChange, required, accept }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        required={required}
        accept={accept}
        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-slate-900"
      />
    </div>
  );
}
