"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { getPageContent } from "@/lib/firebase/cms";
import { SitePage } from "@/types/cms";
import InquiryModal from "@/components/inquiry/InquiryModal";
import Button from "@/components/ui/Button";
import {
  Calculator,
  Package,
  Cpu,
  ArrowRight,
  Activity,
  Database,
  Globe2,
  Send,
  Sparkles,
} from "lucide-react";

const CARDS = [
  {
    key: "calculation" as const,
    href: "/calculation",
    icon: Calculator,
    iconBg: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderHover: "hover:border-blue-200 dark:hover:border-blue-800",
    badgeColor: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30",
    btnVariant: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    key: "hardware" as const,
    href: "/hardware",
    icon: Package,
    iconBg: "bg-slate-100 dark:bg-slate-800",
    iconColor: "text-slate-700 dark:text-slate-300",
    borderHover: "hover:border-slate-300 dark:hover:border-slate-600",
    badgeColor: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800",
    btnVariant: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900",
  },
  {
    key: "automation" as const,
    href: "/automation",
    icon: Cpu,
    iconBg: "bg-violet-50 dark:bg-violet-900/20",
    iconColor: "text-violet-600 dark:text-violet-400",
    borderHover: "hover:border-violet-200 dark:hover:border-violet-800",
    badgeColor: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30",
    btnVariant: "bg-violet-600 hover:bg-violet-700 text-white",
  },
];

const FEATURES = [
  {
    icon: Activity,
    titleKey: "home.features.f1Title",
    descKey: "home.features.f1Desc",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Database,
    titleKey: "home.features.f2Title",
    descKey: "home.features.f2Desc",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: Globe2,
    titleKey: "home.features.f3Title",
    descKey: "home.features.f3Desc",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
  },
];

export default function CategoryCards() {
  const { t, locale } = useLocale();
  const tr = locale === "tr";

  const [cmsPage, setCmsPage] = useState<SitePage | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    getPageContent("home")
      .then((data) => {
        if (data && data.published) setCmsPage(data);
      })
      .catch(() => {});
  }, []);

  const heroSection = cmsPage?.sections?.find((s) => s.type === "hero" && s.visible);
  const ctaSection = cmsPage?.sections?.find((s) => s.type === "cta" && s.visible);

  return (
    <div>
      {/* Hero Heading */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          {heroSection?.badge?.[locale as "tr" | "en"] || t("home.badge")}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
          {heroSection?.title?.[locale as "tr" | "en"] || t("home.heroTitle")}{" "}
          <span className="text-blue-600 dark:text-blue-400">
            {heroSection?.subtitle?.[locale as "tr" | "en"] || t("home.heroTitleHighlight")}
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {heroSection?.content?.[locale as "tr" | "en"] || t("home.heroDescription")}
        </p>
      </div>

      {/* 3 Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        {CARDS.map(({ key, href, icon: Icon, iconBg, iconColor, borderHover, badgeColor, btnVariant }) => (
          <div
            key={key}
            className={`group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 lg:p-8 flex flex-col gap-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${borderHover}`}
          >
            {/* Badge */}
            <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide ${badgeColor}`}>
              {t(`home.cards.${key}.tag`)}
            </span>

            {/* Icon */}
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
              <Icon className={`h-7 w-7 ${iconColor}`} />
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t(`home.cards.${key}.title`)}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {t(`home.cards.${key}.description`)}
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href={href}
              className={`inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${btnVariant}`}
            >
              <span>{t(`home.cards.${key}.cta`)}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>

      {/* Features Row */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-14 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {t("home.features.title")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("home.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, titleKey, descKey, color, bg }) => (
            <div key={titleKey} className="flex gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {t(titleKey)}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {t(descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Public Inquiry / Quote Banner Section */}
      <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="max-w-xl text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {ctaSection?.title?.[locale as "tr" | "en"] ||
              (tr ? "Projeniz İçin Özel Fiyat Teklifi Alın" : "Request a Custom Quote for Your Project")}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {ctaSection?.subtitle?.[locale as "tr" | "en"] ||
              (tr
                ? "Seksiyonel kapı donanımları, yay hesaplamaları veya otomasyon çözümleri için hemen talep gönderin."
                : "Submit your inquiry for door hardware, spring configurations, or drive automation.")}
          </p>
        </div>
        <Button
          size="lg"
          variant="primary"
          onClick={() => setInquiryOpen(true)}
          className="shrink-0 shadow-md hover:shadow-lg"
        >
          <Send className="w-4 h-4" />
          {ctaSection?.buttonText?.[locale as "tr" | "en"] || (tr ? "Teklif Al / Talep Gönder" : "Request a Quote")}
        </Button>
      </div>

      {/* Global Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        defaultType="quote"
      />
    </div>
  );
}
