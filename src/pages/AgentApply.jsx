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

  :root {
    --main-bg: #f6f8fa;
    --main-blue: #183153;
    --main-gold: #eab308;
    --main-grey: #f3f4f6;
    --main-dark: #101828;
    --main-border: #e5e7eb;
    --main-radius: 18px;
    --main-shadow: 0 4px 32px rgba(24,49,83,0.07);
    --main-font: 'DM Sans', sans-serif;
    --main-title: 'Syne', sans-serif;
  }

  .page {
    min-height: 100vh;
    background: var(--main-bg);
    display: flex; align-items: center; justify-content: center;
    padding: 2.5rem 1rem;
    font-family: var(--main-font);
  }

  .card {
    width: 100%; max-width: 600px;
    background: #fff;
    border-radius: var(--main-radius);
    box-shadow: var(--main-shadow);
    overflow: hidden;
    border: 1.5px solid var(--main-border);
  }

  .header {
    background: var(--main-blue);
    padding: 2rem 2.5rem 1.5rem;
    color: #fff;
    border-bottom: 1.5px solid var(--main-border);
    text-align: center;
  }
  .logo {
    font-family: var(--main-title);
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: #fff;
    margin-bottom: 0.2rem;
  }
  .logo span { color: var(--main-gold); }
  .subtitle {
    margin-top: .3rem;
    color: rgba(255,255,255,.7);
    font-size: .95rem;
    font-weight: 400;
  }

  /* Stepper */
  .stepper {
    display: flex; align-items: center;
    padding: 1.2rem 2rem 1.2rem 2rem;
    border-bottom: 1.5px solid var(--main-border);
    background: var(--main-grey);
    gap: 0.5rem;
  }
  .step-dot {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    background: none; border: none; cursor: pointer;
    flex-shrink: 0;
    transition: opacity .2s;
    outline: none;
  }
  .dot-icon {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: #fff; font-size: 1.1rem;
    border: 2px solid var(--main-border);
    transition: all .25s;
    color: var(--main-blue);
    font-weight: 700;
  }
  .dot-label {
    font-size: .78rem; font-weight: 600; color: #b0b4bb; transition: color .25s;
    margin-top: 2px;
  }
  .step-dot.active .dot-icon {
    background: var(--main-blue);
    border-color: var(--main-gold);
    color: #fff;
    font-size: 1rem;
  }
  .step-dot.active .dot-label {
    color: var(--main-blue);
    font-weight: 700;
  }
  .step-dot.done .dot-icon {
    background: #f6ffe7;
    border-color: #a3e635;
    color: #65a30d;
  }
  .step-dot.done .dot-label { color: #65a30d; }
  .step-line {
    flex: 1; height: 2px; background: var(--main-border); margin: -14px .5rem 0;
    transition: background .4s;
    border-radius: 2px;
  }
  .step-line.done { background: #a3e635; }

  /* Form body */
  .step-body { padding: 2rem 2.5rem; background: #fff; }
  .step-title {
    font-family: var(--main-title);
    font-size: 1.18rem;
    font-weight: 800;
    color: var(--main-blue);
    margin-bottom: 1.2rem;
    letter-spacing: -0.5px;
  }
  .fields { display: flex; flex-direction: column; gap: 1.1rem; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.1rem; }
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
  .field label {
    font-size: .81rem;
    font-weight: 700;
    color: var(--main-blue);
    letter-spacing: .2px;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .field input, .field textarea {
    padding: 12px 14px;
    border: 1.5px solid var(--main-border);
    border-radius: 8px;
    font-family: var(--main-font);
    font-size: .97rem;
    color: var(--main-dark);
    background: var(--main-grey);
    outline: none;
    transition: border-color .2s, box-shadow .2s;
    font-weight: 500;
  }
  .field input:focus, .field textarea:focus {
    border-color: var(--main-blue);
    box-shadow: 0 0 0 2px rgba(24,49,83,.08);
    background: #fff;
  }
  .field textarea { resize: vertical; min-height: 90px; }

  /* File drop */
  .file-drop {
    display: flex; align-items: center; justify-content: center;
    padding: 12px 14px; border: 1.5px dashed var(--main-border); border-radius: 8px;
    font-size: .93rem; color: #b0b4bb; cursor: pointer;
    background: var(--main-grey); transition: all .2s; text-align: center;
    min-height: 44px;
  }
  .file-drop:hover { border-color: var(--main-blue); color: var(--main-blue); background: #e0e7ef; }
  .file-drop.has-file { border-style: solid; border-color: #a3e635; color: #65a30d; background: #f6ffe7; font-size: .91rem; }

  /* Profile type cards */
  .profile-types {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: .75rem; margin-bottom: 1rem;
  }
  .type-card {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 1rem .75rem; border: 2px solid var(--main-border); border-radius: 12px;
    cursor: pointer; background: var(--main-grey); transition: all .2s; text-align: center;
    min-height: 110px;
  }
  .type-card:hover { border-color: var(--main-blue); background: #fff; }
  .type-card.selected {
    border-color: var(--main-gold);
    background: var(--main-blue);
    color: #fff;
    box-shadow: 0 2px 12px rgba(24,49,83,0.07);
  }
  .type-icon { font-size: 1.5rem; }
  .type-label { font-family: var(--main-title); font-size: .9rem; font-weight: 800; }
  .type-desc { font-size: .8rem; opacity: .7; }

  /* Consents */
  .consents { display: flex; flex-direction: column; gap: .75rem; margin-top: .5rem; }
  .check-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: .97rem; color: var(--main-dark); font-weight: 500; }
  .check-row input { width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px; accent-color: var(--main-blue); }

  /* Nav */
  .nav-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.1rem 2.5rem 1.5rem;
    border-top: 1.5px solid var(--main-border);
    background: #fff;
  }
  .btn-back {
    background: none; border: none; cursor: pointer;
    font-family: var(--main-font); font-size: .97rem; color: #b0b4bb;
    padding: 10px 0; transition: color .2s;
    font-weight: 700;
  }
  .btn-back:hover { color: var(--main-blue); }
  .btn-next {
    background: var(--main-blue); color: #fff;
    border: none; border-radius: 8px; cursor: pointer;
    font-family: var(--main-title); font-size: .97rem; font-weight: 800;
    padding: 12px 32px; letter-spacing: .2px;
    transition: background .2s, transform .15s;
    box-shadow: 0 2px 8px rgba(24,49,83,0.06);
  }
  .btn-next:hover { background: #25406a; transform: translateX(2px); }
  .btn-submit {
    background: var(--main-gold); color: var(--main-blue);
    border: none; border-radius: 8px; cursor: pointer;
    font-family: var(--main-title); font-size: .97rem; font-weight: 900;
    padding: 12px 32px; letter-spacing: .2px;
    transition: background .2s, transform .15s;
    display: flex; align-items: center; gap: 8px;
    box-shadow: 0 2px 8px rgba(234,179,8,0.07);
  }
  .btn-submit:hover { background: #facc15; transform: scale(1.03); }
  .btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  .spinner {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid rgba(24,49,83,.18); border-top-color: var(--main-blue);
    animation: spin .6s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .footer-link { text-align: center; padding-bottom: 1.5rem; background: #fff; }
  .footer-link a { font-size: .89rem; color: #b0b4bb; text-decoration: none; font-weight: 600; }
  .footer-link a:hover { color: var(--main-blue); }

  @media (max-width: 600px) {
    .step-body, .nav-row { padding-left: 1rem; padding-right: 1rem; }
    .grid-2 { grid-template-columns: 1fr; }
    .col-span-2 { grid-column: auto; }
    .profile-types { grid-template-columns: 1fr; }
    .header { padding: 1.2rem; }
    .card { border-radius: 0; box-shadow: none; }
  }
`;