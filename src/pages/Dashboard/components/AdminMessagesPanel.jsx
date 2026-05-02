import React, { useMemo } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { useMarkMessageRead, useMessages } from "../../Admin/hooks/useAdmin";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("fr-FR");
}

function getChannel(body = "") {
  const match = body.match(/^\[([^\]]+)\]\s*/);
  return match?.[1] || "FORM";
}

function cleanBody(body = "") {
  return body.replace(/^\[[^\]]+\]\s*/, "");
}

function getWhatsAppUrl(message) {
  const text = encodeURIComponent(
    [
      "Nouvelle demande Ethic Immobilier",
      "",
      `Client: ${message.senderName || "-"}`,
      `Telephone: ${message.senderPhone || "-"}`,
      `Email: ${message.senderEmail || "-"}`,
      `Bien: ${message.property?.title || `#${message.propertyId || "-"}`}`,
      "",
      cleanBody(message.body),
    ].join("\n"),
  );
  return `https://wa.me/221778569823?text=${text}`;
}

export default function AdminMessagesPanel() {
  const { data: messages, isLoading, isError } = useMessages();
  const markReadMutation = useMarkMessageRead();
  const items = Array.isArray(messages) ? messages : [];

  const unreadCount = useMemo(() => items.filter((message) => !message.read).length, [items]);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Demandes clients</h2>
          <p className="text-sm text-slate-600">{unreadCount} demande(s) non lue(s)</p>
        </div>
        <a
          href="https://wa.me/221778569823"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <MessageCircle size={16} />
          WhatsApp central
        </a>
      </div>

      {isError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Impossible de charger les demandes clients.
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-600">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-3 pr-4">Client</th>
                <th className="py-3 pr-4">Bien</th>
                <th className="py-3 pr-4">Canal</th>
                <th className="py-3 pr-4">Message</th>
                <th className="py-3 pr-4">Date</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((message) => (
                <tr key={message.id} className={["border-b", message.read ? "bg-white" : "bg-rose-50/50"].join(" ")}>
                  <td className="py-3 pr-4 align-top">
                    <div className="font-semibold text-slate-950">{message.senderName || "-"}</div>
                    <a className="mt-1 flex items-center gap-1 text-xs text-slate-600 hover:text-slate-950" href={`mailto:${message.senderEmail}`}>
                      <Mail size={12} />
                      {message.senderEmail || "-"}
                    </a>
                    {message.senderPhone && (
                      <a className="mt-1 flex items-center gap-1 text-xs text-slate-600 hover:text-slate-950" href={`tel:${message.senderPhone}`}>
                        <Phone size={12} />
                        {message.senderPhone}
                      </a>
                    )}
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <div className="font-medium text-slate-900">{message.property?.title || "-"}</div>
                    <div className="text-xs text-slate-500">
                      {[message.property?.city?.name, message.property?.district?.name].filter(Boolean).join(" · ") || "-"}
                    </div>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {getChannel(message.body)}
                    </span>
                  </td>
                  <td className="max-w-md py-3 pr-4 align-top text-slate-700">
                    <p className="line-clamp-3 whitespace-pre-wrap">{cleanBody(message.body)}</p>
                  </td>
                  <td className="py-3 pr-4 align-top text-slate-600">{formatDate(message.createdAt)}</td>
                  <td className="py-3 pr-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={getWhatsAppUrl(message)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        WhatsApp
                      </a>
                      <button
                        type="button"
                        disabled={markReadMutation.isPending}
                        onClick={() => markReadMutation.mutate({ id: message.id, read: !message.read })}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {message.read ? "Non lu" : "Marquer lu"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-600">
                    Aucune demande client.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
