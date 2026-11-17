"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { getSiteSettings, saveSiteSettings } from "@/lib/firebase/cms";
import { logAdminActivity } from "@/lib/firebase/requests";
import { SiteSettings } from "@/types/cms";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FileText, Save, CheckCircle, ArrowLeft, Mail, Phone, MapPin, Globe } from "lucide-react";
import Link from "next/link";

export default function AdminFooterPage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const tr = locale === "tr";

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [editLang, setEditLang] = useState<"tr" | "en">("tr");

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
        action: "Footer ve iletişim ayarları güncellendi",
        entityType: "settings",
        entityId: "global/footer",
      });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.error("Save error:", err);
      alert(tr ? "Kaydedilirken hata oluştu." : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              {tr ? "Footer & İletişim Yönetimi" : "Footer & Contact Management"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {tr
                ? "Alt bilgi alanı, iletişim bilgileri ve sosyal medya bağlantılarını düzenleyin."
                : "Manage footer information, contact details and social media links."}
            </p>
          </div>
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

      {loading || !settings ? (
        <div className="p-12 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          {tr ? "Yükleniyor..." : "Loading..."}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 mr-2">
              {tr ? "Metin Dili:" : "Content Language:"}
            </span>
            <button
              onClick={() => setEditLang("tr")}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                editLang === "tr" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              Türkçe (TR)
            </button>
            <button
              onClick={() => setEditLang("en")}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                editLang === "en" ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              English (EN)
            </button>
          </div>

          {/* Footer Texts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              {tr ? "Footer Metinleri" : "Footer Copy"} ({editLang.toUpperCase()})
            </h2>

            <Input
              label={tr ? "Footer Başlığı" : "Footer Title"}
              value={settings.footer.title[editLang] || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  footer: {
                    ...settings.footer,
                    title: { ...settings.footer.title, [editLang]: e.target.value },
                  },
                })
              }
            />

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {tr ? "Footer Açıklama Metni" : "Footer Description Text"}
              </label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.footer.description[editLang] || ""}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    footer: {
                      ...settings.footer,
                      description: { ...settings.footer.description, [editLang]: e.target.value },
                    },
                  })
                }
              />
            </div>

            <Input
              label={tr ? "Telif Hakkı (Copyright) Metni" : "Copyright Notice"}
              value={settings.footer.copyright[editLang] || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  footer: {
                    ...settings.footer,
                    copyright: { ...settings.footer.copyright, [editLang]: e.target.value },
                  },
                })
              }
            />
          </div>

          {/* Contact Details */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              {tr ? "Şirket İletişim Bilgileri" : "Contact Information"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={tr ? "Telefon" : "Telephone"}
                value={settings.contact.phone}
                leftIcon={<Phone className="w-4 h-4" />}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, phone: e.target.value },
                  })
                }
              />
              <Input
                label={tr ? "E-posta" : "Email"}
                value={settings.contact.email}
                leftIcon={<Mail className="w-4 h-4" />}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, email: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                {tr ? "Açık Adres" : "Physical Address"}
              </label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.contact.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contact: { ...settings.contact, address: e.target.value },
                  })
                }
              />
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              {tr ? "Sosyal Medya Bağlantıları" : "Social Media Links"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="LinkedIn URL"
                value={settings.social?.linkedin || ""}
                placeholder="https://linkedin.com/company/kutems"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, linkedin: e.target.value },
                  })
                }
              />
              <Input
                label="Instagram URL"
                value={settings.social?.instagram || ""}
                placeholder="https://instagram.com/kutems"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    social: { ...settings.social, instagram: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
