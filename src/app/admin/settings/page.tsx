"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { getSiteSettings, saveSiteSettings } from "@/lib/firebase/cms";
import { logAdminActivity } from "@/lib/firebase/requests";
import { SiteSettings } from "@/types/cms";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Settings, Save, CheckCircle, Globe, Search, Shield, Building2 } from "lucide-react";

export default function AdminSettingsPage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const tr = locale === "tr";

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSiteSettings();
        setSettings(data);
      } catch (err) {
        console.error("Load settings error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      await logAdminActivity({
        adminUid: user?.uid || "admin",
        adminEmail: user?.email || undefined,
        action: "Genel site ayarları ve SEO güncellendi",
        entityType: "settings",
        entityId: "global",
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert(tr ? "Kaydedilirken hata oluştu." : "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-12 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        {tr ? "Ayarlar yükleniyor..." : "Loading settings..."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            {tr ? "Genel Site & SEO Ayarları" : "Website & SEO Settings"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "Site genel başlığı, varsayılan dil, iletişim ve küresel arama motoru optimizasyonu (SEO) ayarları."
              : "Global site brand, default language, contact details, and SEO metadata configuration."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-xl border border-green-200">
              <CheckCircle className="w-4 h-4" />
              {tr ? "Kaydedildi!" : "Saved!"}
            </span>
          )}
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            <Save className="w-4 h-4" />
            {tr ? "Ayarları Kaydet" : "Save Settings"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Brand & Language Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            {tr ? "Marka ve Dil Yapılandırması" : "Brand & Language Settings"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={tr ? "Web Sitesi Adı / Marka" : "Website / Brand Name"}
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
            <Input
              label={tr ? "Logo URL" : "Logo URL"}
              value={settings.logoUrl || ""}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
              {tr ? "Varsayılan Dil (Default Language)" : "Default Language"}
            </label>
            <div className="flex gap-3">
              {[
                { id: "tr", label: "Türkçe (TR)" },
                { id: "en", label: "English (EN)" },
              ].map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() =>
                    setSettings({ ...settings, defaultLanguage: lang.id as "tr" | "en" })
                  }
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                    settings.defaultLanguage === lang.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global SEO Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" />
            {tr ? "Küresel SEO & Meta Ayarları" : "Global SEO & Metadata"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={tr ? "Varsayılan Başlık (TR)" : "Default Title (TR)"}
              value={settings.seo?.defaultTitle?.tr || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: {
                    ...settings.seo,
                    defaultTitle: {
                      ...settings.seo?.defaultTitle,
                      tr: e.target.value,
                    },
                  },
                })
              }
            />
            <Input
              label={tr ? "Varsayılan Başlık (EN)" : "Default Title (EN)"}
              value={settings.seo?.defaultTitle?.en || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: {
                    ...settings.seo,
                    defaultTitle: {
                      ...settings.seo?.defaultTitle,
                      en: e.target.value,
                    },
                  },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {tr ? "Varsayılan Açıklama (TR)" : "Default Meta Description (TR)"}
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={settings.seo?.defaultDescription?.tr || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: {
                      ...settings.seo,
                      defaultDescription: {
                        ...settings.seo?.defaultDescription,
                        tr: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {tr ? "Varsayılan Açıklama (EN)" : "Default Meta Description (EN)"}
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={settings.seo?.defaultDescription?.en || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    seo: {
                      ...settings.seo,
                      defaultDescription: {
                        ...settings.seo?.defaultDescription,
                        en: e.target.value,
                      },
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Firebase & Production Status Information */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            {tr ? "Sistem & Altyapı Bilgileri" : "System & Infrastructure Information"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Firebase Project</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">kutems (810820213557)</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Firestore Location</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">eur3 (FIRESTORE_NATIVE)</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Media CDN Host</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">kutems-media.pages.dev</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
