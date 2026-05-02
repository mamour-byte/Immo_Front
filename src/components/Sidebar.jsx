import React from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Building2,
  ClipboardCheck,
  Home,
  LogOut,
  UserRound,
  UsersRound,
} from "lucide-react";

const adminItems = [
  { key: "overview", label: "Vue CRM", icon: BarChart3 },
  { key: "properties", label: "Biens", icon: Building2 },
  { key: "applications", label: "Demandes", icon: ClipboardCheck },
  { key: "users", label: "Agents & comptes", icon: UsersRound },
];

const agentItems = [
  { key: "overview", label: "Vue CRM", icon: BarChart3 },
  { key: "properties", label: "Mes biens", icon: Building2 },
];

export default function Sidebar({ activeItem = "overview", isAdmin = false, onSelect, onLogout }) {
  const items = isAdmin ? adminItems : agentItems;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="border-b border-slate-200 px-6 py-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-base font-semibold text-white">
            E
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold text-slate-950">Ethic Immobilier</span>
            <span className="block text-xs font-medium uppercase tracking-[0.14em] text-rose-600">
              {isAdmin ? "Administration" : "Espace agent"}
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect?.(item.key)}
              className={[
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              ].join(" ")}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-slate-200 p-3">
        <Link
          to="/account"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
        >
          <UserRound size={18} />
          Mon compte
        </Link>
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950"
        >
          <Home size={18} />
          Retour au site
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
