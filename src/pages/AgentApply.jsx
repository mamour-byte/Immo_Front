import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "./services/http";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiGlobe,
  FiLock,
  FiMail,
  FiMapPin,
  FiPaperclip,
  FiPhone,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";

const STEPS = [
  { id: 1, label: "Identité", icon: FiUser },
  { id: 2, label: "Profil", icon: FiBriefcase },
  { id: 3, label: "Contact", icon: FiPhone },
  { id: 4, label: "Documents", icon: FiPaperclip },
];

const PROFILE_TYPES = [
  {
    value: "INDEPENDANT",
    label: "Agent indépendant",
    icon: FiUser,
    desc: "Travailleur indépendant",
  },
  {
    value: "AGENCY",
    label: "Agence immobilière",
    icon: FiBriefcase,
    desc: "Structure professionnelle",
  },
  {
    value: "DEVELOPER",
    label: "Promoteur immobilier",
    icon: FiGlobe,
    desc: "Développeur de projets",
  },
];

const INIT = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  city: "",
  address: "",
  profileType: "INDEPENDANT",
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
};

export default function AgentApply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const [animating, setAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(INIT);
  const [files, setFiles] = useState({ profilePhoto: null, idDocument: null, tradeRegister: null, professionalCard: null, agencyLogo: null, agencyPhoto: null });

  const isAgency = form.profileType === "AGENCY";
  const isDeveloper = form.profileType === "DEVELOPER";
  const progressPct = useMemo(() => (step / STEPS.length) * 100, [step]);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setForm(f => ({ ...f, [name]: checked }));
    else if (name === "languages") setForm(f => ({ ...f, languages: value.split(",").map(l => l.trim()).filter(Boolean) }));
    else setForm(f => ({ ...f, [name]: value }));
  }

  function onFileChange(e) {
    const { name, files: fl } = e.target;
    setFiles(f => ({ ...f, [name]: fl[0] }));
  }

  function goTo(next) {
    if (animating) return;
    setDir(next > step ? 1 : -1);
    setAnimating(true);
    setTimeout(() => { setStep(next); setAnimating(false); }, 320);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const safeProfileType = form.profileType || "INDEPENDANT";
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) =>
        fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v ?? ""),
      );
      // Sécurise le champ même si l'utilisateur ne visite pas l'étape "Profil"
      // (certaines implémentations backend ignorent les champs vides sur multipart).
      fd.set("profileType", safeProfileType);
      Object.entries(files).forEach(([k, f]) => f && fd.append(k, f));
      const resp = await fetch(`${API_URL}/agent-applications/apply-full`, { method: "POST", body: fd });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) { toast.error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Erreur"); setIsLoading(false); return; }
      toast.success(data?.message || "Demande envoyée !");
      navigate("/login", { replace: true });
    } catch {
      toast.error("Erreur réseau");
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(244,63,94,0.25),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(244,63,94,0.18),transparent_55%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Candidature agent
              </div>
              <h1 className="mt-4 text-2xl sm:text-4xl font-bold text-white leading-tight">
                Rejoignez notre réseau d’agents
              </h1>
              <p className="mt-3 text-slate-300 max-w-2xl">
                Un formulaire simple, en 4 étapes, pour valider votre profil.
              </p>
            </div>
            <Link
              to="/login"
              className="shrink-0 text-slate-200 hover:text-white text-sm font-semibold"
            >
              Retour connexion
            </Link>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Étape {step} / {STEPS.length}</span>
              <span className="text-rose-200 font-semibold">{Math.round(progressPct)}%</span>
            </div>
            <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isDone = step > s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => isDone && goTo(s.id)}
                    className={[
                      "group flex items-center gap-3 rounded-xl px-3 py-3 border transition",
                      isActive
                        ? "bg-white text-slate-900 border-white"
                        : "bg-white/5 text-slate-200 border-white/10 hover:bg-white/10",
                    ].join(" ")}
                    aria-current={isActive ? "step" : undefined}
                    disabled={!isDone}
                  >
                    <span
                      className={[
                        "w-9 h-9 rounded-lg flex items-center justify-center transition",
                        isActive
                          ? "bg-rose-50 text-rose-600"
                          : isDone
                            ? "bg-rose-500/20 text-rose-200"
                            : "bg-white/10 text-slate-200",
                      ].join(" ")}
                    >
                      {isDone ? <FiCheck /> : <Icon />}
                    </span>
                    <span className="text-left">
                      <span className={["block text-sm font-semibold", isActive ? "text-slate-900" : ""].join(" ")}>
                        {s.label}
                      </span>
                      <span className={["block text-xs", isActive ? "text-slate-600" : "text-slate-400"].join(" ")}>
                        {isDone ? "Terminé" : isActive ? "En cours" : "À venir"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 sm:px-10 py-6 border-b border-slate-100 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {step === 1 && "Informations personnelles"}
                {step === 2 && "Profil professionnel"}
                {step === 3 && "Contact & présentation"}
                {step === 4 && "Documents & validation"}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {step === 1 && "Vos informations de base pour créer votre compte agent."}
                {step === 2 && "Décrivez votre activité et votre expérience."}
                {step === 3 && "Coordonnées publiques et présentation visible sur votre profil."}
                {step === 4 && "Ajoutez les documents requis et confirmez les conditions."}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
              <FiLock className="text-rose-500" />
              Données sécurisées
            </div>
          </div>

          <form onSubmit={onSubmit} className="px-6 sm:px-10 py-8">
            <div
              className={[
                "transition-all duration-300",
                animating ? (dir > 0 ? "opacity-0 -translate-x-2" : "opacity-0 translate-x-2") : "opacity-100 translate-x-0",
              ].join(" ")}
            >
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field icon={FiUser} label="Prénom" name="firstName" value={form.firstName} onChange={onChange} required placeholder="Ismael" />
                  <Field icon={FiUser} label="Nom" name="lastName" value={form.lastName} onChange={onChange} required placeholder="Diop" />
                  <Field icon={FiMail} label="Email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="ismaeldiop@email.com" />
                  <Field icon={FiPhone} label="Téléphone" name="phone" value={form.phone} onChange={onChange} required placeholder="+221 77 000 0000" />
                  <Field icon={FiMapPin} label="Ville" name="city" value={form.city} onChange={onChange} required placeholder="Dakar" />
                  <Field icon={FiMapPin} label="Adresse" name="address" value={form.address} onChange={onChange} required placeholder="Rue, Quartier" />
                  <Field icon={FiLock} label="Mot de passe" name="password" type="password" value={form.password} onChange={onChange} required placeholder="Min. 8 caractères" />
                  <FileField label="Photo de profil" name="profilePhoto" onChange={onFileChange} required accept="image/*" value={files.profilePhoto} />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-7">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PROFILE_TYPES.map((t) => {
                      const Icon = t.icon;
                      const checked = form.profileType === t.value;
                      return (
                        <label
                          key={t.value}
                          className={[
                            "cursor-pointer rounded-2xl border p-5 transition",
                            checked
                              ? "border-rose-500 bg-rose-50"
                              : "border-slate-200 hover:border-slate-300 bg-white",
                          ].join(" ")}
                        >
                          <input
                            type="radio"
                            name="profileType"
                            value={t.value}
                            checked={checked}
                            onChange={onChange}
                            className="sr-only"
                          />
                          <div className="flex items-start gap-4">
                            <div className={["w-11 h-11 rounded-xl flex items-center justify-center", checked ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-700"].join(" ")}>
                              <Icon />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{t.label}</div>
                              <div className="text-sm text-slate-600 mt-1">{t.desc}</div>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {(isAgency || isDeveloper) && (
                    <Field icon={FiBriefcase} label="Nom de l'agence / société" name="agencyName" value={form.agencyName} onChange={onChange} required placeholder="Ex: Immo Excellence" />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Années d'expérience" name="yearsExperience" type="number" min="0" value={form.yearsExperience} onChange={onChange} required placeholder="5" />
                    <Field label="Zone d'activité" name="activityZone" value={form.activityZone} onChange={onChange} required placeholder="Dakar, Thiès..." />
                    <Field label="Biens gérés" name="managedPropertiesCount" type="number" min="0" value={form.managedPropertiesCount} onChange={onChange} required placeholder="12" />
                    <Field icon={FiGlobe} label="Site web" name="websiteUrl" value={form.websiteUrl} onChange={onChange} placeholder="https://..." />
                    <Field icon={FiGlobe} label="Page Facebook" name="facebookUrl" value={form.facebookUrl} onChange={onChange} placeholder="https://facebook.com/..." />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field icon={FiPhone} label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={onChange} required placeholder="+221 77 000 0000" />
                    <Field icon={FiPhone} label="Numéro d'appel" name="publicPhone" value={form.publicPhone} onChange={onChange} required placeholder="+221 33 000 0000" />
                    <Field
                      label="Langues (virgules)"
                      name="languages"
                      value={form.languages.join(", ")}
                      onChange={onChange}
                      required
                      placeholder="Français, Wolof, Anglais"
                      className="sm:col-span-2"
                    />
                  </div>
                  <TextArea label="Présentation publique" name="publicDescription" value={form.publicDescription} onChange={onChange} required placeholder="Décrivez votre expertise, votre approche..." />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FileField label="Pièce d'identité *" name="idDocument" onChange={onFileChange} required accept="image/*,application/pdf" value={files.idDocument} />
                    {isAgency && <FileField label="Registre de commerce *" name="tradeRegister" onChange={onFileChange} required accept="image/*,application/pdf" value={files.tradeRegister} />}
                    {(form.profileType === "INDEPENDANT" || isDeveloper) && <FileField label="Carte professionnelle" name="professionalCard" onChange={onFileChange} accept="image/*,application/pdf" value={files.professionalCard} />}
                    {isAgency && (
                      <>
                        <FileField label="Logo de l'agence *" name="agencyLogo" onChange={onFileChange} required accept="image/*" value={files.agencyLogo} />
                        <FileField label="Photo de l'agence *" name="agencyPhoto" onChange={onFileChange} required accept="image/*" value={files.agencyPhoto} />
                      </>
                    )}
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                    <CheckField name="acceptedTerms" checked={form.acceptedTerms} onChange={onChange} label="J'accepte les conditions d'utilisation" required />
                    <CheckField name="certifiedTrue" checked={form.certifiedTrue} onChange={onChange} label="Je certifie que les informations sont exactes" required />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => goTo(step - 1)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  <FiArrowLeft />
                  Retour
                </button>
              ) : (
                <span />
              )}

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={() => goTo(step + 1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-700 transition"
                >
                  Suivant
                  <FiArrowRight />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isLoading ? <Spinner /> : <>
                    Envoyer la demande
                    <FiCheck />
                  </>}
                </button>
              )}
            </div>

            <div className="mt-6 text-sm text-slate-600">
              Déjà un compte ?{" "}
              <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-700">
                Connectez-vous
              </Link>
              .
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ── Tiny components ── */
function Field({ label, icon: Icon, className = "", ...props }) {
  return (
    <div className={["w-full", className].join(" ")}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        {Icon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon />
          </span>
        ) : null}
        <input
          {...props}
          className={[
            "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-300 transition-all text-slate-900",
            Icon ? "pl-10" : "",
          ].join(" ")}
        />
      </div>
    </div>
  );
}
function TextArea({ label, ...props }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <textarea
        rows={5}
        {...props}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-300 transition-all text-slate-900"
      />
    </div>
  );
}
function FileField({ label, name, onChange, required, accept, value }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <label
        className={[
          "group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-dashed",
          value ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-300 hover:border-slate-400",
          "transition cursor-pointer",
        ].join(" ")}
      >
        <input type="file" name={name} onChange={onChange} required={required} accept={accept} className="hidden" />
        <span className="flex items-center gap-3 min-w-0">
          <span className={["w-10 h-10 rounded-lg flex items-center justify-center", value ? "bg-rose-500 text-white" : "bg-white text-slate-700 border border-slate-200"].join(" ")}>
            <FiUploadCloud />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-900 truncate">
              {value ? value.name : "Choisir un fichier"}
            </span>
            <span className="block text-xs text-slate-600">
              {accept?.includes("pdf") ? "Images ou PDF" : "Images uniquement"}
            </span>
          </span>
        </span>
        <span className={["text-xs font-semibold", value ? "text-rose-700" : "text-slate-700"].join(" ")}>
          {value ? "Sélectionné" : "Parcourir"}
        </span>
      </label>
    </div>
  );
}
function CheckField({ name, checked, onChange, label, required }) {
  return (
    <label className="flex items-start gap-3 py-2">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        required={required}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-label="Chargement"
    />
  );
 }
