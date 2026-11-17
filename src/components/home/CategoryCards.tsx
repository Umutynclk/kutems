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

const CARD_CTA_FALLBACKS: Record<string, { tr: string; en: string }> = {
  calculation: { tr: "Hesaplamayı Başlat", en: "Start Calculation" },
  hardware: { tr: "Aksesuarları Keşfet", en: "Explore Hardware" },
  automation: { tr: "Otomasyon Çözümlerini Keşfet", en: "Explore Automation" },
};

export default function CategoryCards() {
  const { t, locale } = useLocale();
  const tr = locale === "tr";

  const [cmsPage, setCmsPage] = useState<SitePage | null>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [heroBgImageFallback, setHeroBgImageFallback] = useState<string | null>(null);

  useEffect(() => {
    getPageContent("home")
      .then((data) => {
        if (data && data.published) setCmsPage(data);
      })
      .catch(() => {});
  }, []);

  const heroSection = cmsPage?.sections?.find((s) => s.type === "hero" && s.visible);
  const ctaSection = cmsPage?.sections?.find((s) => s.type === "cta" && s.visible);

  const rawHeroBg = heroSection?.imageUrl?.trim() || "/images/kutems-hero-background.jpg";
  const normalizedHeroBg = rawHeroBg.startsWith("http") || rawHeroBg.startsWith("/")
    ? rawHeroBg
    : `/${rawHeroBg}`;
  const heroBgImage = heroBgImageFallback || normalizedHeroBg;
  const heroBadge = heroSection?.badge?.[locale as "tr" | "en"] || t("home.badge");
  const heroTitle = heroSection?.title?.[locale as "tr" | "en"] || t("home.heroTitle");
  const heroTitleHighlight = heroSection?.subtitle?.[locale as "tr" | "en"] || t("home.heroTitleHighlight");
  const heroDescription = heroSection?.content?.[locale as "tr" | "en"] || t("home.heroDescription");

  return (
    <div className="w-full">
      {/* Full-width 16:9 Photographic Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-slate-200 dark:border-slate-800 min-h-[440px] sm:min-h-[500px] md:min-h-[560px] lg:min-h-[640px] xl:min-h-[700px] max-h-[760px] md:aspect-[16/9] flex items-center justify-center bg-slate-900">
        {/* Background Image Layer (Optimized scale, sharpness, aspect preservation & robust fallback) */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            bgError ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" : ""
          }`}
          style={{
            backgroundImage: bgError ? "none" : `url('${heroBgImage}')`,
            backgroundSize: "cover",
            backgroundPosition: "center 42%",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden="true"
        />

        {/* Hidden image preloader to catch 404 and safely handle fallback */}
        {!bgError && (
          <img
            src={heroBgImage}
            alt=""
            className="hidden"
            onError={() => {
              if (heroBgImage !== "/images/kutems-hero-background.jpg") {
                setHeroBgImageFallback("/images/kutems-hero-background.jpg");
              } else {
                setBgError(true);
              }
            }}
          />
        )}

        {/* Adaptive Theme Overlay Layer (Kept exactly as instructed) */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/35 via-white/25 to-white/40 dark:from-slate-950/55 dark:via-slate-950/40 dark:to-slate-950/60"
          aria-hidden="true"
        />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center animate-hero-fade">
          {/* Eyebrow / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300/80 dark:border-slate-700/80 bg-white/85 dark:bg-slate-900/85 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{heroBadge}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight mb-5 leading-[1.18] drop-shadow-xs">
            {heroTitle}{" "}
            {heroTitleHighlight && (
              <span className="text-blue-600 dark:text-blue-400 block sm:inline font-black">
                {heroTitleHighlight}
              </span>
            )}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-900 dark:text-slate-100 max-w-3xl mx-auto leading-relaxed font-semibold bg-white/45 dark:bg-slate-950/55 px-5 py-3 rounded-2xl backdrop-blur-xs border border-white/60 dark:border-slate-800/60 shadow-xs">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* 3 Main Cards Section (Separate surface below the hero with distinct background and comfortable spacing) */}
      <section className="w-full bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CARDS.map(({ key, href, icon: Icon, iconBg, iconColor, borderHover, badgeColor, btnVariant }) => {
              const ctaText = (() => {
                const keyTrans = t(`home.cards.${key}.cta`);
                if (keyTrans && !keyTrans.startsWith("home.cards.")) return keyTrans;
                const actionTrans = t(`home.cards.${key}.action`);
                if (actionTrans && !actionTrans.startsWith("home.cards.")) return actionTrans;
                return CARD_CTA_FALLBACKS[key]?.[tr ? "tr" : "en"] || "Keşfet";
              })();

              return (
                <div
                  key={key}
                  className={`group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 lg:p-8 flex flex-col gap-5 transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 motion-reduce:transform-none ${borderHover}`}
                >
                  {/* Badge */}
                  <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide ${badgeColor}`}>
                    {t(`home.cards.${key}.tag`)}
                  </span>

                  {/* Icon */}
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-105 ${iconBg}`}>
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
                    className={`inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ease-out ${btnVariant}`}
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transform-none" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Container for Features & Quote Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Features Row */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 pt-14 mb-16">
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
              <div key={titleKey} className="flex gap-4 p-4 rounded-xl transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
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
            className="shrink-0 shadow-md hover:shadow-lg transition-all duration-200"
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
    </div>
  );
}
