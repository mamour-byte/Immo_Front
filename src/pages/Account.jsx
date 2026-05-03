import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_URL } from "./services/http";
import { clearSession, isSessionExpired } from "../utils/authUtils";

function getJwt() {
  return localStorage.getItem("jwt") || sessionStorage.getItem("jwt") || null;
}

function getStoredUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Account() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [saving, setSaving] = useState(false);
  const [appSaving, setAppSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const token = useMemo(() => getJwt(), []);

  const [profileForm, setProfileForm] = useState({
    fullName: "", phone: "", companyName: "", bio: "", avatarUrl: "", whatsapp: "",
  });
  const [applicationForm, setApplicationForm] = useState({
    fullName: "", phone: "", companyName: "", bio: "", avatarUrl: "", whatsapp: "",
  });

  async function fetchMe() {
    if (!token || isSessionExpired()) { clearSession(); navigate("/login", { replace: true }); return; }
    try {
      const resp = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401) { clearSession(); navigate("/login", { replace: true }); return; }
        toast.error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Impossible de charger le profil");
        setLoading(false); return;
      }
      setMe(data);
      setProfileForm({
        fullName: data?.fullName || "", phone: data?.phone || "",
        companyName: data?.agentProfile?.companyName || "", bio: data?.agentProfile?.bio || "",
        avatarUrl: data?.agentProfile?.avatarUrl || "", whatsapp: data?.agentProfile?.whatsapp || "",
      });
      setApplicationForm({
        fullName: data?.fullName || "", phone: data?.phone || "",
        companyName: data?.agentApplication?.companyName || "", bio: data?.agentApplication?.bio || "",
        avatarUrl: data?.agentApplication?.avatarUrl || "", whatsapp: data?.agentApplication?.whatsapp || "",
      });
      const stored = getStoredUser();
      if (stored?.id === data?.id) {
        const newStored = { ...stored, role: data?.role, fullName: data?.fullName, phone: data?.phone };
        if (localStorage.getItem("user")) localStorage.setItem("user", JSON.stringify(newStored));
        if (sessionStorage.getItem("user")) sessionStorage.setItem("user", JSON.stringify(newStored));
      }
    } catch (err) { toast.error("Erreur réseau: " + err.message); }
    setLoading(false);
  }

  useEffect(() => { fetchMe(); }, []); // eslint-disable-line

  function logout() { clearSession(); navigate("/login", { replace: true }); }
  function onProfileChange(e) { const { name, value } = e.target; setProfileForm((f) => ({ ...f, [name]: value })); }
  function onApplicationChange(e) { const { name, value } = e.target; setApplicationForm((f) => ({ ...f, [name]: value })); }

  async function saveProfile(e) {
    e.preventDefault(); setSaving(true);
    try {
      const resp = await fetch(`${API_URL}/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401) { clearSession(); navigate("/login", { replace: true }); return; }
        toast.error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Erreur lors de la sauvegarde");
        setSaving(false); return;
      }
      toast.success("Profil mis à jour"); setMe(data);
    } catch (err) { toast.error("Erreur réseau: " + err.message); }
    setSaving(false);
  }

  async function saveApplication(e) {
    e.preventDefault(); setAppSaving(true);
    try {
      const resp = await fetch(`${API_URL}/agent-applications/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(applicationForm),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401) { clearSession(); navigate("/login", { replace: true }); return; }
        toast.error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Erreur lors de la sauvegarde");
        setAppSaving(false); return;
      }
      toast.success("Demande mise à jour");
      setMe((prev) => ({ ...prev, agentApplication: data }));
    } catch (err) { toast.error("Erreur réseau: " + err.message); }
    setAppSaving(false);
  }

  async function createApplication(e) {
    e.preventDefault(); setAppSaving(true);
    try {
      const resp = await fetch(`${API_URL}/agent-applications/me/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(applicationForm),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401) { clearSession(); navigate("/login", { replace: true }); return; }
        toast.error(Array.isArray(data?.message) ? data.message[0] : data?.message || "Erreur lors de l'envoi");
        setAppSaving(false); return;
      }
      toast.success(data?.message || "Demande envoyée");
      setMe((prev) => ({ ...prev, agentApplication: data?.application }));
    } catch (err) { toast.error("Erreur réseau: " + err.message); }
    setAppSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-sm text-text-muted">Chargement...</p>
      </div>
    );
  }

  const statusConfig = {
    PENDING:  { label: "En attente",  classes: "bg-amber-50 text-amber-700" },
    APPROVED: { label: "Approuvée",   classes: "bg-green-50 text-green-700" },
    REJECTED: { label: "Refusée",     classes: "bg-red-50 text-red-700" },
  };

  const showAgentTab = me?.role === "USER";
  const tabs = [
    { id: "profile", label: "Profil" },
    ...(showAgentTab ? [{ id: "application", label: "Demande agent" }] : []),
  ];

  return (
    <div className="min-h-screen bg-surface px-4 py-8 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-medium text-text-muted shrink-0">
              {getInitials(me?.fullName)}
            </div>
            <div>
              <p className="text-sm font-medium text-text-main leading-tight">{me?.fullName || "—"}</p>
              <p className="text-xs text-text-muted mt-0.5">{me?.email} · {me?.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {(me?.role === "AGENT" || me?.role === "ADMIN") && (
              <Link
                to="/dashboard"
                className="text-xs text-text-muted border border-border rounded-lg px-3 py-1.5 hover:bg-surface transition-colors"
              >
                {me.role === "ADMIN" ? "Admin" : "Tableau de bord"}
              </Link>
            )}
            <button
              onClick={logout}
              className="text-xs text-text-muted border border-border rounded-lg px-3 py-1.5 hover:bg-surface transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">

          {/* Tabs */}
          {tabs.length > 1 && (
            <div className="flex border-b border-border px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-sm py-3 mr-6 border-b-[1.5px] -mb-px transition-colors ${
                    activeTab === tab.id
                      ? "border-text-main text-text-main"
                      : "border-transparent text-text-muted hover:text-text-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={saveProfile} className="p-6 space-y-4">
              <p className="text-[11px] font-medium tracking-widest uppercase text-text-muted mb-5">
                Informations
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Nom complet" name="fullName" value={profileForm.fullName} onChange={onProfileChange} />
                <Field label="Téléphone" name="phone" value={profileForm.phone} onChange={onProfileChange} />
              </div>
              {me?.role === "AGENT" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="WhatsApp" name="whatsapp" value={profileForm.whatsapp} onChange={onProfileChange} />
                    <Field label="Entreprise" name="companyName" value={profileForm.companyName} onChange={onProfileChange} />
                  </div>
                  <TextArea label="Bio" name="bio" value={profileForm.bio} onChange={onProfileChange} />
                  <Field label="URL Avatar" name="avatarUrl" value={profileForm.avatarUrl} onChange={onProfileChange} placeholder="https://..." />
                </>
              )}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="text-sm bg-primary-dark text-white rounded-lg px-5 py-2 hover:bg-primary-dark disabled:opacity-40 transition-colors"
                >
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </button>
              </div>
            </form>
          )}

          {/* Application Tab */}
          {activeTab === "application" && showAgentTab && (
            <div className="p-6">
              {me?.agentApplication ? (
                <>
                  {/* Status row */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-text-muted">Statut de votre demande</p>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[me.agentApplication.status]?.classes || "bg-surface text-text-muted"}`}>
                      {statusConfig[me.agentApplication.status]?.label || me.agentApplication.status}
                    </span>
                  </div>

                  {/* Decision note */}
                  {me.agentApplication.decisionNote && (
                    <div className="bg-surface rounded-xl p-4 text-sm text-text-muted whitespace-pre-wrap mb-5 leading-relaxed">
                      {me.agentApplication.decisionNote}
                    </div>
                  )}

                  {me.agentApplication.status === "APPROVED" && (
                    <p className="text-sm text-text-muted mb-5">
                      Votre compte a été approuvé. Déconnectez-vous puis reconnectez-vous si l'accès agent n'est pas visible.
                    </p>
                  )}

                  {/* Editable form for PENDING */}
                  {me.agentApplication.status === "PENDING" && (
                    <form onSubmit={saveApplication} className="space-y-3 mt-2">
                      <p className="text-[11px] font-medium tracking-widest uppercase text-text-muted mb-4">Mettre à jour</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Nom complet" name="fullName" value={applicationForm.fullName} onChange={onApplicationChange} />
                        <Field label="Téléphone" name="phone" value={applicationForm.phone} onChange={onApplicationChange} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="WhatsApp" name="whatsapp" value={applicationForm.whatsapp} onChange={onApplicationChange} />
                        <Field label="Entreprise" name="companyName" value={applicationForm.companyName} onChange={onApplicationChange} />
                      </div>
                      <TextArea label="Bio" name="bio" value={applicationForm.bio} onChange={onApplicationChange} />
                      <Field label="URL Avatar" name="avatarUrl" value={applicationForm.avatarUrl} onChange={onApplicationChange} placeholder="https://..." />
                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={appSaving}
                          className="text-sm bg-primary-dark text-white rounded-lg px-5 py-2 hover:bg-primary-dark disabled:opacity-40 transition-colors"
                        >
                          {appSaving ? "Sauvegarde..." : "Mettre à jour"}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                /* No application yet */
                <form onSubmit={createApplication} className="space-y-3">
                  <div className="mb-5">
                    <p className="text-sm font-medium text-text-main">Devenir agent</p>
                    <p className="text-xs text-text-muted mt-0.5">Vous n'avez pas encore soumis de demande.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Nom complet" name="fullName" value={applicationForm.fullName} onChange={onApplicationChange} />
                    <Field label="Téléphone" name="phone" value={applicationForm.phone} onChange={onApplicationChange} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="WhatsApp" name="whatsapp" value={applicationForm.whatsapp} onChange={onApplicationChange} />
                    <Field label="Entreprise" name="companyName" value={applicationForm.companyName} onChange={onApplicationChange} />
                  </div>
                  <TextArea label="Bio" name="bio" value={applicationForm.bio} onChange={onApplicationChange} />
                  <Field label="URL Avatar" name="avatarUrl" value={applicationForm.avatarUrl} onChange={onApplicationChange} placeholder="https://..." />
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-text-muted">
                      Ou via{" "}
                      <Link className="underline" to="/agent/apply">le formulaire public</Link>.
                    </p>
                    <button
                      type="submit"
                      disabled={appSaving}
                      className="text-sm bg-primary-dark text-white rounded-lg px-5 py-2 hover:bg-primary-dark disabled:opacity-40 transition-colors"
                    >
                      {appSaving ? "Envoi..." : "Envoyer la demande"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, ...props }) {
  return (
    <div>
      <label className="block text-[11px] font-medium tracking-widest uppercase text-text-muted mb-1.5">
        {label}
      </label>
      <input
        {...props}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm bg-surface border border-border rounded-lg text-text-main placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-border transition-all"
      />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div>
      <label className="block text-[11px] font-medium tracking-widest uppercase text-text-muted mb-1.5">
        {label}
      </label>
      <textarea
        {...props}
        rows={3}
        className="w-full px-3 py-2.5 text-sm bg-surface border border-border rounded-lg text-text-main placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-border transition-all resize-none"
      />
    </div>
  );
}