import posthog from "posthog-js";

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";

let initialized = false;

function cleanProperties(properties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined)
  );
}

export function isAnalyticsEnabled() {
  return Boolean(POSTHOG_KEY);
}

export function initAnalytics() {
  if (initialized || !POSTHOG_KEY) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: "identified_only",
  });

  initialized = true;
}

export function trackEvent(event, properties = {}) {
  if (!initialized) return;
  posthog.capture(event, cleanProperties(properties));
}

export function identifyUser(distinctId, properties = {}) {
  if (!initialized || !distinctId) return;
  posthog.identify(String(distinctId), cleanProperties(properties));
}

export function resetAnalytics() {
  if (!initialized) return;
  posthog.reset();
}

