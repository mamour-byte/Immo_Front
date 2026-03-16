import React, { useState } from "react";
import "./AgentApply.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "./services/http";

const STEPS = [
  { id: 1, label: "Identité", icon: "👤" },
  { id: 2, label: "Profil", icon: "🏢" },
  { id: 3, label: "Contact", icon: "📞" },
  { id: 4, label: "Documents", icon: "📎" },
];

const PROFILE_TYPES = [
  { value: "INDEPENDENT", label: "Agent indépendant", icon: "🧑‍💼", desc: "Travailleur indépendant" },
  { value: "AGENCY", label: "Agence immobilière", icon: "🏢", desc: "Structure professionnelle" },
  { value: "DEVELOPER", label: "Promoteur immobilier", icon: "🏗️", desc: "Développeur de projets" },
];

const INIT = {
  email: "", password: "", firstName: "", lastName: "", phone: "",
  city: "", address: "", profileType: "INDEPENDENT", agencyName: "",
  yearsExperience: "", activityZone: "", managedPropertiesCount: "",
  websiteUrl: "", facebookUrl: "", whatsapp: "", publicPhone: "",
  languages: [], publicDescription: "", acceptedTerms: false, certifiedTrue: false,
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
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, Array.isArray(v) ? JSON.stringify(v) : v ?? ""));
      Object.entries(files).forEach(([k, f]) => f && fd.append(k, f));
      const resp = await fetch(`${API_URL}/agent-applications/apply-full`, { method: "POST", body: fd });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) { toast.error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Erreur"); setIsLoading(false); return; }
      toast.success(data?.message || "Demande envoyée !");
      navigate("/login", { replace: true });
    } catch (err) { toast.error("Erreur réseau"); }
    setIsLoading(false);
  }

  return (
    <>
      {/* Le style est maintenant importé via AgentApply.css */}
      <div className="page">
        <div className="card">
          {/* Header */}
          <div className="header">
            <div className="logo">IMMO<span>PRO</span></div>
            <p className="subtitle">Rejoignez notre réseau d'agents professionnels</p>
          </div>

          {/* Stepper */}
          <div className="stepper">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <button
                  className={`step-dot ${step === s.id ? "active" : ""} ${step > s.id ? "done" : ""}`}
                  onClick={() => step > s.id && goTo(s.id)}
                  type="button"
                >
                  <span className="dot-icon">{step > s.id ? "✓" : s.icon}</span>
                  <span className="dot-label">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <div className={`step-line ${step > s.id ? "done" : ""}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* Steps */}
          <form onSubmit={onSubmit}>
            <div className={`step-body ${animating ? (dir > 0 ? "slide-out-left" : "slide-out-right") : (dir > 0 ? "slide-in-right" : "slide-in-left")}`}>

              {step === 1 && (
                <div className="fields">
                  <h2 className="step-title">Informations personnelles</h2>
                  <div className="grid-2">
                    <Field label="Prénom" name="firstName" value={form.firstName} onChange={onChange} required placeholder="Jean" />
                    <Field label="Nom" name="lastName" value={form.lastName} onChange={onChange} required placeholder="Dupont" />
                    <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="jean@email.com" />
                    <Field label="Téléphone" name="phone" value={form.phone} onChange={onChange} required placeholder="+221 77 000 0000" />
                    <Field label="Ville" name="city" value={form.city} onChange={onChange} required placeholder="Dakar" />
                    <Field label="Adresse" name="address" value={form.address} onChange={onChange} required placeholder="Rue, Quartier" />
                    <Field label="Mot de passe" name="password" type="password" value={form.password} onChange={onChange} required placeholder="Min. 8 caractères" />
                    <FileField label="Photo de profil" name="profilePhoto" onChange={onFileChange} required accept="image/*" value={files.profilePhoto} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="fields">
                  <h2 className="step-title">Profil professionnel</h2>
                  <div className="profile-types">
                    {PROFILE_TYPES.map(t => (
                      <label key={t.value} className={`type-card ${form.profileType === t.value ? "selected" : ""}`}>
                        <input type="radio" name="profileType" value={t.value} checked={form.profileType === t.value} onChange={onChange} hidden />
                        <span className="type-icon">{t.icon}</span>
                        <span className="type-label">{t.label}</span>
                        <span className="type-desc">{t.desc}</span>
                      </label>
                    ))}
                  </div>
                  {(isAgency || isDeveloper) && (
                    <Field label="Nom de l'agence / société" name="agencyName" value={form.agencyName} onChange={onChange} required placeholder="Ex: Immo Excellence" />
                  )}
                  <div className="grid-2">
                    <Field label="Années d'expérience" name="yearsExperience" type="number" min="0" value={form.yearsExperience} onChange={onChange} required placeholder="5" />
                    <Field label="Zone d'activité" name="activityZone" value={form.activityZone} onChange={onChange} required placeholder="Dakar, Thiès..." />
                    <Field label="Biens gérés" name="managedPropertiesCount" type="number" min="0" value={form.managedPropertiesCount} onChange={onChange} required placeholder="12" />
                    <Field label="Site web" name="websiteUrl" value={form.websiteUrl} onChange={onChange} placeholder="https://..." />
                    <Field label="Page Facebook" name="facebookUrl" value={form.facebookUrl} onChange={onChange} placeholder="https://facebook.com/..." />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="fields">
                  <h2 className="step-title">Contact & présentation</h2>
                  <div className="grid-2">
                    <Field label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={onChange} required placeholder="+221 77 000 0000" />
                    <Field label="Numéro d'appel" name="publicPhone" value={form.publicPhone} onChange={onChange} required placeholder="+221 33 000 0000" />
                    <Field label="Langues (virgule)" name="languages" value={form.languages.join(", ")} onChange={onChange} required placeholder="Français, Wolof, Anglais" className="col-span-2" />
                  </div>
                  <TextArea label="Présentation publique" name="publicDescription" value={form.publicDescription} onChange={onChange} required placeholder="Décrivez votre expertise, votre approche..." />
                </div>
              )}

              {step === 4 && (
                <div className="fields">
                  <h2 className="step-title">Documents & validation</h2>
                  <div className="grid-2">
                    <FileField label="Pièce d'identité *" name="idDocument" onChange={onFileChange} required accept="image/*,application/pdf" value={files.idDocument} />
                    {isAgency && <FileField label="Registre de commerce *" name="tradeRegister" onChange={onFileChange} required accept="image/*,application/pdf" value={files.tradeRegister} />}
                    {(form.profileType === "INDEPENDENT" || isDeveloper) && <FileField label="Carte professionnelle" name="professionalCard" onChange={onFileChange} accept="image/*,application/pdf" value={files.professionalCard} />}
                    {isAgency && <>
                      <FileField label="Logo de l'agence *" name="agencyLogo" onChange={onFileChange} required accept="image/*" value={files.agencyLogo} />
                      <FileField label="Photo de l'agence *" name="agencyPhoto" onChange={onFileChange} required accept="image/*" value={files.agencyPhoto} />
                    </>}
                  </div>
                  <div className="consents">
                    <CheckField name="acceptedTerms" checked={form.acceptedTerms} onChange={onChange} label="J'accepte les conditions d'utilisation" required />
                    <CheckField name="certifiedTrue" checked={form.certifiedTrue} onChange={onChange} label="Je certifie que les informations sont exactes" required />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="nav-row">
              {step > 1
                ? <button type="button" className="btn-back" onClick={() => goTo(step - 1)}>← Retour</button>
                : <span />
              }
              {step < 4
                ? <button type="button" className="btn-next" onClick={() => goTo(step + 1)}>Suivant →</button>
                : <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? <span className="spinner" /> : "Envoyer la demande ✓"}
                  </button>
              }
            </div>
          </form>

          <div className="footer-link">
            <Link to="/login">← Retour à la connexion</Link>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Tiny components ── */
function Field({ label, className = "", ...props }) {
  return (
    <div className={`field ${className}`}>
      <label>{label}</label>
      <input {...props} />
    </div>
  );
}
function TextArea({ label, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea rows={4} {...props} />
    </div>
  );
}
function FileField({ label, name, onChange, required, accept, value }) {
  return (
    <div className="field">
      <label>{label}</label>
      <label className={`file-drop ${value ? "has-file" : ""}`}>
        <input type="file" name={name} onChange={onChange} required={required} accept={accept} hidden />
        <span>{value ? `✓ ${value.name}` : "Cliquer pour choisir un fichier"}</span>
      </label>
    </div>
  );
}
function CheckField({ name, checked, onChange, label, required }) {
  return (
    <label className="check-row">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} required={required} />
      <span>{label}</span>
    </label>
  );
}
