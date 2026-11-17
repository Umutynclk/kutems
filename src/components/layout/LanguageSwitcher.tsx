"use client";

import { useLocale, Locale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const toggle = (lang: Locale) => setLocale(lang);

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
      {(["tr", "en"] as Locale[]).map((lang) => (
        <button
          key={lang}
          onClick={() => toggle(lang)}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold rounded-md uppercase tracking-wide transition-all duration-150",
            locale === lang
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
