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
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function Account() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [saving, setSaving] = useState(false);
  const [appSaving, setAppSaving] = useState(false);
  const token = useMemo(() => getJwt(), []);

  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    companyName: "",
    bio: "",
    avatarUrl: "",
  });

  const [applicationForm, setApplicationForm] = useState({
    fullName: "",
    phone: "",
    companyName: "",
    bio: "",
    avatarUrl: "",
  });

  async function fetchMe() {
    if (!token || isSessionExpired()) {
      clearSession();
      navigate("/login", { replace: true });
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
          return;
        }
        const msg = data?.message || "Impossible de charger le profil";
        toast.error(Array.isArray(msg) ? msg[0] : msg);
        setLoading(false);
        return;
      }
      setMe(data);
      setProfileForm({
        fullName: data?.fullName || "",
        phone: data?.phone || "",
        companyName: data?.agentProfile?.companyName || "",
        bio: data?.agentProfile?.bio || "",
        avatarUrl: data?.agentProfile?.avatarUrl || "",
      });
      setApplicationForm({
        fullName: data?.fullName || "",
        phone: data?.phone || "",
        companyName: data?.agentApplication?.companyName || "",
        bio: data?.agentApplication?.bio || "",
        avatarUrl: data?.agentApplication?.avatarUrl || "",
      });

      const stored = getStoredUser();
      if (stored?.id === data?.id) {
        const newStored = { ...stored, role: data?.role, fullName: data?.fullName, phone: data?.phone };
        if (localStorage.getItem("user")) localStorage.setItem("user", JSON.stringify(newStored));
        if (sessionStorage.getItem("user")) sessionStorage.setItem("user", JSON.stringify(newStored));
      }
    } catch (err) {
      toast.error("Erreur réseau: " + err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  function onProfileChange(e) {
    const { name, value } = e.target;
    setProfileForm((f) => ({ ...f, [name]: value }));
  }

  function onApplicationChange(e) {
    const { name, value } = e.target;
    setApplicationForm((f) => ({ ...f, [name]: value }));
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const resp = await fetch(`${API_URL}/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
          return;
        }
        const msg = data?.message || "Erreur lors de la sauvegarde";
        toast.error(Array.isArray(msg) ? msg[0] : msg);
        setSaving(false);
        return;
      }
      toast.success("Profil mis à jour");
      setMe(data);
    } catch (err) {
      toast.error("Erreur réseau: " + err.message);
    }
    setSaving(false);
  }

  async function saveApplication(e) {
    e.preventDefault();
    setAppSaving(true);
    try {
      const resp = await fetch(`${API_URL}/agent-applications/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(applicationForm),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
          return;
        }
        const msg = data?.message || "Erreur lors de la sauvegarde";
        toast.error(Array.isArray(msg) ? msg[0] : msg);
        setAppSaving(false);
        return;
      }
      toast.success("Demande mise à jour");
      setMe((prev) => ({ ...prev, agentApplication: data }));
    } catch (err) {
      toast.error("Erreur réseau: " + err.message);
    }
    setAppSaving(false);
  }

  async function createApplication(e) {
    e.preventDefault();
    setAppSaving(true);
    try {
      const resp = await fetch(`${API_URL}/agent-applications/me/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(applicationForm),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        if (resp.status === 401) {
          clearSession();
          navigate("/login", { replace: true });
          return;
        }
        const msg = data?.message || "Erreur lors de l'envoi";
        toast.error(Array.isArray(msg) ? msg[0] : msg);
        setAppSaving(false);
        return;
      }
      toast.success(data?.message || "Demande envoyée");
      setMe((prev) => ({ ...prev, agentApplication: data?.application }));
    } catch (err) {
      toast.error("Erreur réseau: " + err.message);
    }
    setAppSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Mon compte</h1>
            <p className="text-sm text-slate-600">{me?.email} · {me?.role}</p>
          </div>
          <div className="flex items-center gap-3">
            {me?.role === "AGENT" && (
              <Link to="/dashboard" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800">
                Tableau de bord
              </Link>
            )}
            {me?.role === "ADMIN" && (
              <Link to="/admin" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800">
                Admin
              </Link>
            )}
            <button onClick={logout} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
              Déconnexion
            </button>
          </div>
        </header>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Profil</h2>
          <form className="space-y-4" onSubmit={saveProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nom complet" name="fullName" value={profileForm.fullName} onChange={onProfileChange} />
              <Field label="Téléphone" name="phone" value={profileForm.phone} onChange={onProfileChange} />
            </div>

            {me?.role === "AGENT" && (
              <>
                <Field label="Entreprise" name="companyName" value={profileForm.companyName} onChange={onProfileChange} />
                <TextArea label="Bio" name="bio" value={profileForm.bio} onChange={onProfileChange} />
                <Field label="Avatar URL" name="avatarUrl" value={profileForm.avatarUrl} onChange={onProfileChange} />
              </>
            )}

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-700 disabled:opacity-50"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </form>
        </section>

        {me?.agentApplication ? (
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Demande agent</h2>
                <p className="text-sm text-slate-600">
                  Statut: <span className="font-medium">{me.agentApplication.status}</span>
                </p>
                {me.agentApplication.decisionNote && (
                  <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{me.agentApplication.decisionNote}</p>
                )}
                {me.agentApplication.status === "APPROVED" && (
                  <p className="text-sm text-slate-700 mt-2">
                    Votre compte a été approuvé. Déconnectez-vous puis reconnectez-vous si l’accès agent n’est pas visible.
                  </p>
                )}
              </div>
            </div>

            {me.agentApplication.status === "PENDING" && (
              <form className="space-y-4 mt-6" onSubmit={saveApplication}>
                <h3 className="text-sm font-semibold text-slate-700">Mettre à jour la demande</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nom complet" name="fullName" value={applicationForm.fullName} onChange={onApplicationChange} />
                  <Field label="Téléphone" name="phone" value={applicationForm.phone} onChange={onApplicationChange} />
                </div>
                <Field label="Entreprise" name="companyName" value={applicationForm.companyName} onChange={onApplicationChange} />
                <TextArea label="Bio" name="bio" value={applicationForm.bio} onChange={onApplicationChange} />
                <Field label="Avatar URL" name="avatarUrl" value={applicationForm.avatarUrl} onChange={onApplicationChange} />
                <button
                  type="submit"
                  disabled={appSaving}
                  className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50"
                >
                  {appSaving ? "Sauvegarde..." : "Sauvegarder la demande"}
                </button>
              </form>
            )}
          </section>
        ) : (
          <section className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Devenir agent</h2>
            <p className="text-sm text-slate-600 mt-1">Vous n'avez pas encore fait de demande.</p>
            <form className="space-y-4 mt-6" onSubmit={createApplication}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nom complet" name="fullName" value={applicationForm.fullName} onChange={onApplicationChange} />
                <Field label="Téléphone" name="phone" value={applicationForm.phone} onChange={onApplicationChange} />
              </div>
              <Field label="Entreprise" name="companyName" value={applicationForm.companyName} onChange={onApplicationChange} />
              <TextArea label="Bio" name="bio" value={applicationForm.bio} onChange={onApplicationChange} />
              <Field label="Avatar URL" name="avatarUrl" value={applicationForm.avatarUrl} onChange={onApplicationChange} />
              <button
                type="submit"
                disabled={appSaving}
                className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50"
              >
                {appSaving ? "Envoi..." : "Envoyer la demande"}
              </button>
              <p className="text-xs text-slate-500">
                Vous pouvez aussi créer un nouveau compte via{" "}
                <Link className="underline" to="/agent/apply">le formulaire public</Link>.
              </p>
            </form>
          </section>
        )}
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
