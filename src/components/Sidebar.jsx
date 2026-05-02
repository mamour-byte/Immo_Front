import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiLayers, FiUsers, FiMessageCircle, FiCalendar, FiUserCheck, FiDollarSign, FiCheckCircle, FiLogOut } from "react-icons/fi";

const menuItems = [
  { label: "Dashboard", icon: <FiHome />, to: "/dashboard" },
  { label: "Biens", icon: <FiLayers />, to: "/dashboard/properties" },
  { label: "Interactions", icon: <FiMessageCircle />, to: "/dashboard/interactions" },
  { label: "Visites", icon: <FiCalendar />, to: "/dashboard/visits" },
  { label: "Demandes", icon: <FiUserCheck />, to: "/dashboard/requests" },
  { label: "Agents", icon: <FiUsers />, to: "/dashboard/agents" },
  { label: "Commissions", icon: <FiDollarSign />, to: "/dashboard/commissions" },
  { label: "Validation", icon: <FiCheckCircle />, to: "/dashboard/validation" },
];

export default function Sidebar({ onLogout }) {
  const location = useLocation();
  return (
    <aside className="h-screen w-64 bg-white border-r border-slate-100 flex flex-col shadow-lg fixed top-0 left-0 z-30">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-100">
        <span className="text-rose-600 font-extrabold text-xl tracking-tight">ETHIC</span>
        <span className="text-xs font-semibold bg-rose-100 text-rose-600 rounded px-2 py-1 ml-2">ADMINISTRATION</span>
      </div>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-slate-700 hover:bg-rose-50 hover:text-rose-600 ${location.pathname.startsWith(item.to) ? "bg-rose-100 text-rose-600" : ""}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto px-6 py-4 border-t border-slate-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition-colors"
        >
          <FiLogOut className="text-lg" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
