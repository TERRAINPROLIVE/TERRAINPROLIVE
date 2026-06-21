import { useEffect, useState } from "react";

const STORAGE_KEY = "bedrock.savedQuotes";

export function getSavedQuotes() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveQuote(quote) {
  const existing = getSavedQuotes();
  const nextQuote = {
    ...quote,
    savedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([nextQuote, ...existing].slice(0, 25)));
  window.dispatchEvent(new Event("bedrock:quotes-changed"));
  return nextQuote;
}

export function nextQuoteId() {
  const saved = getSavedQuotes();
  const maxSaved = saved.reduce((max, quote) => {
    const n = Number(String(quote.id || "").replace(/\D/g, ""));
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 246);

  return `Q-${String(maxSaved + 1).padStart(4, "0")}`;
}

export function useSavedQuotes() {
  const [quotes, setQuotes] = useState(() => getSavedQuotes());

  useEffect(() => {
    const sync = () => setQuotes(getSavedQuotes());
    window.addEventListener("storage", sync);
    window.addEventListener("bedrock:quotes-changed", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("bedrock:quotes-changed", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return quotes;
}
