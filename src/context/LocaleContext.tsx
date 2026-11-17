"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import trDict from "@/locales/tr.json";
import enDict from "@/locales/en.json";

export type Locale = "tr" | "en";

interface LocaleContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: (path: string, defaultVal?: string) => string;
  getLocalized: (field: { tr?: string; en?: string } | string | undefined) => string;
}

const dictionaries: Record<Locale, Record<string, unknown>> = {
  tr: trDict as Record<string, unknown>,
  en: enDict as Record<string, unknown>,
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("tr");

  useEffect(() => {
    const saved = localStorage.getItem("app_locale") as Locale;
    if (saved === "tr" || saved === "en") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLoc: Locale) => {
    setLocaleState(newLoc);
    localStorage.setItem("app_locale", newLoc);
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLoc;
    }
  };

  const t = (path: string, defaultVal?: string): string => {
    const keys = path.split(".");
    let current: unknown = dictionaries[locale];

    for (const key of keys) {
      if (current && typeof current === "object" && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        // Fallback to TR dictionary if EN missing
        let fallbackCurrent: unknown = dictionaries["tr"];
        for (const fKey of keys) {
          if (fallbackCurrent && typeof fallbackCurrent === "object" && fKey in (fallbackCurrent as Record<string, unknown>)) {
            fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[fKey];
          } else {
            return defaultVal || path;
          }
        }
        return typeof fallbackCurrent === "string" ? fallbackCurrent : defaultVal || path;
      }
    }

    return typeof current === "string" ? current : defaultVal || path;
  };

  const getLocalized = (field: { tr?: string; en?: string } | string | undefined): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field.tr || field.en || "";
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, getLocalized }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
