import React, { useState } from "react";
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
      <style>{css}</style>
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

/* ── CSS ── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .page {
    min-height: 100vh;
    background: #f7f5f2;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 1rem;
    font-family: 'DM Sans', sans-serif;
  }

  .card {
    width: 100%; max-width: 640px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 4px 40px rgba(0,0,0,.08);
    overflow: hidden;
  }

  .header {
    background: #1a1a2e;
    padding: 2rem 2.5rem 1.8rem;
    color: #fff;
  }
  .logo { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; letter-spacing: -0.5px; }
  .logo span { color: #f4a944; }
  .subtitle { margin-top: .4rem; color: rgba(255,255,255,.55); font-size: .85rem; }

  /* Stepper */
  .stepper {
    display: flex; align-items: center;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #f0ede8;
  }
  .step-dot {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    background: none; border: none; cursor: pointer;
    flex-shrink: 0;
    transition: opacity .2s;
  }
  .dot-icon {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: #f0ede8; font-size: .9rem;
    border: 2px solid transparent;
    transition: all .25s ease;
  }
  .dot-label { font-size: .7rem; font-weight: 500; color: #999; transition: color .25s; }
  .step-dot.active .dot-icon { background: #1a1a2e; border-color: #f4a944; color: #fff; font-size: .75rem; }
  .step-dot.active .dot-label { color: #1a1a2e; font-weight: 600; }
  .step-dot.done .dot-icon { background: #e8f5e9; border-color: #4caf50; color: #2e7d32; }
  .step-dot.done .dot-label { color: #4caf50; }
  .step-line {
    flex: 1; height: 2px; background: #f0ede8; margin: -14px .5rem 0;
    transition: background .4s;
  }
  .step-line.done { background: #4caf50; }

  /* Form body */
  .step-body { padding: 2rem 2.5rem; }
  .step-title {
    font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700;
    color: #1a1a2e; margin-bottom: 1.5rem;
  }
  .fields { display: flex; flex-direction: column; gap: 1rem; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .col-span-2 { grid-column: span 2; }

  /* Animations */
  @keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInLeft  { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideOutLeft  { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-40px); } }
  @keyframes slideOutRight { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(40px); } }
  .slide-in-right  { animation: slideInRight .32s cubic-bezier(.22,1,.36,1) forwards; }
  .slide-in-left   { animation: slideInLeft  .32s cubic-bezier(.22,1,.36,1) forwards; }
  .slide-out-left  { animation: slideOutLeft  .32s cubic-bezier(.22,1,.36,1) forwards; }
  .slide-out-right { animation: slideOutRight .32s cubic-bezier(.22,1,.36,1) forwards; }

  /* Inputs */
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field label { font-size: .78rem; font-weight: 600; color: #555; letter-spacing: .3px; text-transform: uppercase; }
  .field input, .field textarea {
    padding: 11px 14px; border: 1.5px solid #e8e4de; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: .9rem; color: #1a1a2e;
    background: #faf9f7; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .field input:focus, .field textarea:focus {
    border-color: #1a1a2e; box-shadow: 0 0 0 3px rgba(26,26,46,.07);
    background: #fff;
  }
  .field textarea { resize: vertical; min-height: 100px; }

  /* File drop */
  .file-drop {
    display: flex; align-items: center; justify-content: center;
    padding: 11px 14px; border: 1.5px dashed #d0cbc2; border-radius: 10px;
    font-size: .85rem; color: #999; cursor: pointer;
    background: #faf9f7; transition: all .2s; text-align: center;
  }
  .file-drop:hover { border-color: #1a1a2e; color: #1a1a2e; background: #f0ede8; }
  .file-drop.has-file { border-style: solid; border-color: #4caf50; color: #2e7d32; background: #e8f5e9; font-size: .8rem; }

  /* Profile type cards */
  .profile-types { display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin-bottom: 1rem; }
  .type-card {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 1rem .75rem; border: 2px solid #e8e4de; border-radius: 12px;
    cursor: pointer; background: #faf9f7; transition: all .2s; text-align: center;
  }
  .type-card:hover { border-color: #1a1a2e; background: #fff; }
  .type-card.selected { border-color: #1a1a2e; background: #1a1a2e; color: #fff; }
  .type-icon { font-size: 1.4rem; }
  .type-label { font-family: 'Syne', sans-serif; font-size: .8rem; font-weight: 700; }
  .type-desc { font-size: .7rem; opacity: .6; }

  /* Consents */
  .consents { display: flex; flex-direction: column; gap: .75rem; margin-top: .5rem; }
  .check-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: .88rem; color: #444; }
  .check-row input { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; accent-color: #1a1a2e; }

  /* Nav */
  .nav-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1rem 2.5rem 1.5rem;
    border-top: 1px solid #f0ede8;
  }
  .btn-back {
    background: none; border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: .88rem; color: #888;
    padding: 10px 0; transition: color .2s;
  }
  .btn-back:hover { color: #1a1a2e; }
  .btn-next {
    background: #1a1a2e; color: #fff;
    border: none; border-radius: 10px; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: .88rem; font-weight: 700;
    padding: 11px 28px; letter-spacing: .3px;
    transition: background .2s, transform .15s;
  }
  .btn-next:hover { background: #2d2d4e; transform: translateX(2px); }
  .btn-submit {
    background: #f4a944; color: #1a1a2e;
    border: none; border-radius: 10px; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: .88rem; font-weight: 800;
    padding: 11px 28px; letter-spacing: .3px;
    transition: background .2s, transform .15s;
    display: flex; align-items: center; gap: 8px;
  }
  .btn-submit:hover { background: #e09a35; transform: scale(1.02); }
  .btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(26,26,46,.3); border-top-color: #1a1a2e;
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .footer-link { text-align: center; padding-bottom: 1.5rem; }
  .footer-link a { font-size: .82rem; color: #999; text-decoration: none; }
  .footer-link a:hover { color: #1a1a2e; }

  @media (max-width: 520px) {
    .step-body, .nav-row { padding-left: 1.25rem; padding-right: 1.25rem; }
    .grid-2 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: auto; }
    .profile-types { grid-template-columns: 1fr; }
    .header { padding: 1.5rem; }
  }
`;