import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { clearSession } from "../utils/authUtils";
import PropertiesPanel from "./Dashboard/components/PropertiesPanel";
import AdminApplicationsPanel from "./Dashboard/components/AdminApplicationsPanel";
import AdminMessagesPanel from "./Dashboard/components/AdminMessagesPanel";
import AdminUsersPanel from "./Dashboard/components/AdminUsersPanel";
import Sidebar from "../components/Sidebar";
import { useMyProperties, useProperties } from "./Admin/hooks/useProperties";
import { useAgentApplications, useMessages, useUsers } from "./Admin/hooks/useAdmin";

const DASHBOARD_FILTERS = {
  query: "",
  type: "",
  purpose: "",
  rentalMode: "",
  cityId: "",
  districtId: "",
  status: "",
  sortField: "createdAt",
  sortDir: "desc",
  page: 1,
  pageSize: 5,
};

const AVAILABLE_FILTERS = {
  ...DASHBOARD_FILTERS,
  status: "AVAILABLE",
  pageSize: 1,
};

function getStoredUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem("jwt") || sessionStorage.getItem("jwt") || null;
}

function decodeJwtPayload(token) {
  try {
    const payloadPart = token?.split(".")[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getSessionUser() {
  const storedUser = getStoredUser();
  if (storedUser) return storedUser;
  const token = getJwt();
  return decodeJwtPayload(token) || {};
}

function getItems(data) {
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

function getTotal(data) {
  if (Array.isArray(data)) return data.length;
  return data?.total ?? data?.items?.length ?? 0;
}

function countBy(items, predicate) {
  return items.filter(predicate).length;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const sessionUser = useMemo(() => getSessionUser(), []);
  const isAdmin = sessionUser?.role === "ADMIN";
  const [section, setSection] = useState("overview");

  function logout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar activeItem={section} isAdmin={isAdmin} onSelect={setSection} onLogout={logout} />

      <main className="min-h-screen px-4 py-5 sm:px-6 lg:ml-72 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <DashboardHeader isAdmin={isAdmin} user={sessionUser} section={section} onSectionChange={setSection} />

          {section === "overview" && (
            isAdmin ? (
              <AdminOverview onSectionChange={setSection} />
            ) : (
              <AgentOverview onSectionChange={setSection} />
            )
          )}

          {section === "properties" && (
            <DashboardSurface
              title={isAdmin ? "Catalogue des biens" : "Mes biens"}
              description={
                isAdmin
                  ? "Filtrer, créer, mettre à jour et suivre tout le portefeuille."
                  : "Piloter vos annonces, leurs statuts et leurs médias."
              }
            >
              <PropertiesPanel scope={isAdmin ? "all" : "mine"} showAgent={isAdmin} />
            </DashboardSurface>
          )}

          {isAdmin && section === "applications" && (
            <DashboardSurface
              title="Demandes agents"
              description="Valider les candidatures et contrôler les profils avant activation."
            >
              <AdminApplicationsPanel />
            </DashboardSurface>
          )}

          {isAdmin && section === "messages" && (
            <DashboardSurface
              title="Demandes clients"
              description="Toutes les demandes issues des pages détails passent ici avant suivi."
            >
              <AdminMessagesPanel />
            </DashboardSurface>
          )}

          {isAdmin && section === "users" && (
            <DashboardSurface
              title="Agents et comptes"
              description="Gérer les accès, les statuts et les fiches opérationnelles."
            >
              <AdminUsersPanel />
            </DashboardSurface>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardHeader({ isAdmin, user, section, onSectionChange }) {
  const tabs = isAdmin
    ? [
        ["overview", "Vue CRM"],
        ["properties", "Biens"],
        ["messages", "Demandes clients"],
        ["applications", "Demandes"],
        ["users", "Comptes"],
      ]
    : [
        ["overview", "Vue CRM"],
        ["properties", "Mes biens"],
      ];

  return (
    <header className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-600">
            <ShieldCheck size={14} />
            {isAdmin ? "Console administration" : "Espace professionnel"}
          </div>
          <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-950">
            Tableau de bord CRM
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isAdmin
              ? "Une vue claire pour suivre le catalogue, les agents et les demandes."
              : `Bonjour ${user?.fullName || "agent"}, suivez vos annonces et vos prochaines actions.`}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            to="/account"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <UserRoundCheck size={16} />
            Mon compte
          </Link>
          <button
            type="button"
            onClick={() => onSectionChange("properties")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            <Plus size={16} />
            Ajouter un bien
          </button>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto lg:hidden">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onSectionChange(key)}
            className={[
              "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium",
              section === key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}

function AdminOverview({ onSectionChange }) {
  const propertiesQuery = useProperties(DASHBOARD_FILTERS);
  const availablePropertiesQuery = useProperties(AVAILABLE_FILTERS);
  const usersQuery = useUsers();
  const applicationsQuery = useAgentApplications("PENDING");
  const messagesQuery = useMessages();

  const properties = getItems(propertiesQuery.data);
  const users = Array.isArray(usersQuery.data) ? usersQuery.data : [];
  const applications = Array.isArray(applicationsQuery.data) ? applicationsQuery.data : [];
  const messages = Array.isArray(messagesQuery.data) ? messagesQuery.data : [];
  const available = getTotal(availablePropertiesQuery.data);
  const activeAgents = countBy(users, (user) => user.role === "AGENT" && !user.isSuspended);

  const stats = [
    {
      label: "Biens au catalogue",
      value: getTotal(propertiesQuery.data),
      hint: `${available} disponibles`,
      icon: Building2,
      loading: propertiesQuery.isLoading || availablePropertiesQuery.isLoading,
    },
    {
      label: "Demandes clients",
      value: messages.filter((message) => !message.read).length,
      hint: `${messages.length} demande(s) au total`,
      icon: MessageSquareText,
      loading: messagesQuery.isLoading,
    },
    {
      label: "Agents actifs",
      value: activeAgents,
      hint: `${users.length} comptes au total`,
      icon: UsersRound,
      loading: usersQuery.isLoading,
    },
    {
      label: "Demandes à traiter",
      value: applications.length,
      hint: "Candidatures en attente",
      icon: Clock3,
      loading: applicationsQuery.isLoading,
    },
  ];

  return (
    <>
      <StatsGrid stats={stats} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <DashboardSurface title="Priorités" description="Actions rapides pour garder le CRM propre.">
          <ActionList
            actions={[
              {
                title: "Traiter les demandes clients",
                description: `${messages.filter((message) => !message.read).length} demande(s) non lue(s) à rappeler ou qualifier.`,
                action: "Ouvrir",
                onClick: () => onSectionChange("messages"),
              },
              {
                title: "Revoir les demandes agents",
                description: `${applications.length} candidature(s) en attente de décision.`,
                action: "Ouvrir",
                onClick: () => onSectionChange("applications"),
              },
              {
                title: "Contrôler les annonces récentes",
                description: "Vérifier prix, médias, localisation et statuts des derniers biens.",
                action: "Voir les biens",
                onClick: () => onSectionChange("properties"),
              },
              {
                title: "Suivre les comptes agents",
                description: "Suspendre, réactiver ou compléter les fiches opérationnelles.",
                action: "Gérer",
                onClick: () => onSectionChange("users"),
              },
            ]}
          />
        </DashboardSurface>

        <DashboardSurface title="Derniers biens" description="Aperçu rapide du portefeuille.">
          <CompactPropertyList items={properties} loading={propertiesQuery.isLoading} />
        </DashboardSurface>
      </div>
    </>
  );
}

function AgentOverview({ onSectionChange }) {
  const propertiesQuery = useMyProperties(DASHBOARD_FILTERS);
  const availablePropertiesQuery = useMyProperties(AVAILABLE_FILTERS);
  const properties = getItems(propertiesQuery.data);
  const published = getTotal(availablePropertiesQuery.data);

  const stats = [
    {
      label: "Mes annonces",
      value: getTotal(propertiesQuery.data),
      hint: "Total publié ou brouillon",
      icon: Building2,
      loading: propertiesQuery.isLoading,
    },
    {
      label: "Disponibles",
      value: published,
      hint: "Biens visibles à relancer",
      icon: CheckCircle2,
      loading: availablePropertiesQuery.isLoading,
    },
    {
      label: "À compléter",
      value: countBy(properties, (item) => !item.images?.length),
      hint: "Annonces sans galerie",
      icon: Search,
      loading: propertiesQuery.isLoading,
    },
  ];

  return (
    <>
      <StatsGrid stats={stats} />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <DashboardSurface title="Mes actions" description="Les gestes utiles pour améliorer vos annonces.">
          <ActionList
            actions={[
              {
                title: "Ajouter ou mettre à jour un bien",
                description: "Gardez vos prix, statuts et médias cohérents avec la réalité terrain.",
                action: "Ouvrir",
                onClick: () => onSectionChange("properties"),
              },
              {
                title: "Compléter les annonces sans images",
                description: "Une annonce illustrée inspire plus vite confiance.",
                action: "Voir",
                onClick: () => onSectionChange("properties"),
              },
            ]}
          />
        </DashboardSurface>

        <DashboardSurface title="Mes derniers biens" description="Aperçu de vos annonces récentes.">
          <CompactPropertyList items={properties} loading={propertiesQuery.isLoading} />
        </DashboardSurface>
      </div>
    </>
  );
}

function DashboardSurface({ title, description, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function StatsGrid({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon || LayoutDashboard;
        return (
          <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                  {stat.loading ? "..." : stat.value}
                </p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <Icon size={20} />
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-slate-500">{stat.hint}</p>
          </article>
        );
      })}
    </div>
  );
}

function ActionList({ actions }) {
  return (
    <div className="divide-y divide-slate-100">
      {actions.map((item) => (
        <div key={item.title} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{item.description}</p>
          </div>
          <button
            type="button"
            onClick={item.onClick}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {item.action}
          </button>
        </div>
      ))}
    </div>
  );
}

function CompactPropertyList({ items, loading }) {
  if (loading) return <p className="text-sm text-slate-600">Chargement...</p>;
  if (!items.length) return <p className="text-sm text-slate-600">Aucun bien à afficher.</p>;

  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">{item.title || `Bien #${item.id}`}</p>
            <p className="mt-1 truncate text-xs text-slate-500">
              {[item.city?.name, item.district?.name, item.type].filter(Boolean).join(" · ") || "Localisation à compléter"}
            </p>
          </div>
          <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {item.status || "-"}
          </span>
        </div>
      ))}
    </div>
  );
}
