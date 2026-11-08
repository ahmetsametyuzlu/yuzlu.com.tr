"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Lang = "tr" | "en";

/** A string that exists in both site languages. */
export type L10n = { tr: string; en: string };

export function tx(value: L10n | string, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

const STORAGE_KEY = "asyos:lang";

/*
 * The language is an external, persisted preference, so it lives in a tiny
 * store read through useSyncExternalStore: the server always renders Turkish,
 * and the client re-renders once with the visitor's stored (or browser)
 * choice — no hydration mismatch, no setState inside an effect.
 */
let current: Lang | null = null;
const listeners = new Set<() => void>();

function read(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "tr" || stored === "en") return stored;
    return navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
  } catch {
    return "tr";
  }
}

function getSnapshot(): Lang {
  if (current === null) current = read();
  return current;
}

function getServerSnapshot(): Lang {
  return "tr";
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function write(next: Lang) {
  if (current === next) return;
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* private mode — the choice just will not persist */
  }
  document.documentElement.lang = next;
  listeners.forEach((listener) => listener());
}

type LangContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  toggle: () => void;
  t: (value: L10n | string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep the document language in step: text-transform casing follows it, and
  // Turkish rules would otherwise turn an English "Preview" into "PREVİEW".
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => write(next), []);
  const toggle = useCallback(() => write(getSnapshot() === "tr" ? "en" : "tr"), []);
  const t = useCallback((value: L10n | string) => tx(value, lang), [lang]);

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang, setLang, toggle, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used inside <LangProvider>");
  return context;
}

/*
 * A clock is an external system too. The server renders nothing, the client
 * ticks every 15s; the snapshot is bucketed to the minute so re-renders only
 * happen when the displayed value actually changes.
 */
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}

const clockSnapshot = () => Math.floor(Date.now() / 60_000);
const clockServerSnapshot = () => null;

export function useMinute(): number | null {
  return useSyncExternalStore(subscribeClock, clockSnapshot, clockServerSnapshot);
}
