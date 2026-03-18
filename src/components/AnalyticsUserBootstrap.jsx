import { useEffect } from "react";
import { identifyUser } from "../lib/analytics";

function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function AnalyticsUserBootstrap() {
  useEffect(() => {
    const token = localStorage.getItem("jwt") || sessionStorage.getItem("jwt");
    const rawUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    let storedUser = null;
    if (rawUser) {
      try {
        storedUser = JSON.parse(rawUser);
      } catch {
        storedUser = null;
      }
    }

    const decoded = token ? decodeJwtPayload(token) : null;
    const distinctId = storedUser?.id || decoded?.sub;

    if (!distinctId) return;
    identifyUser(distinctId, {
      email: storedUser?.email,
      role: storedUser?.role || decoded?.role || "UNKNOWN",
    });
  }, []);

  return null;
}

