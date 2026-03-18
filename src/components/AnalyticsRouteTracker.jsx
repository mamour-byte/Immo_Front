import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "../lib/analytics";

export default function AnalyticsRouteTracker() {
  const location = useLocation();
  const lastPathRef = useRef("");

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search || ""}`;
    if (lastPathRef.current === currentPath) return;
    lastPathRef.current = currentPath;

    trackEvent("page_viewed", {
      path: location.pathname,
      search: location.search || "",
      hash: location.hash || "",
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

