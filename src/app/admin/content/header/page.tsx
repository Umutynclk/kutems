"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { getSiteSettings, saveSiteSettings } from "@/lib/firebase/cms";
import { logAdminActivity } from "@/lib/firebase/requests";
import { SiteSettings, NavItem } from "@/types/cms";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Layers, Save, Eye, EyeOff, Plus, Trash2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminHeaderPage() {
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

  const handleNavLabelChange = (index: number, val: string) => {
    if (!settings) return;
    const newItems = [...settings.header.navItems];
    newItems[index] = {
      ...newItems[index],
      label: {
        ...newItems[index].label,
        [editLang]: val,
      },
    };
    setSettings({
      ...settings,
      header: { ...settings.header, navItems: newItems },
    });
  };

  const handleNavHrefChange = (index: number, val: string) => {
    if (!settings) return;
    const newItems = [...settings.header.navItems];
    newItems[index] = {
      ...newItems[index],
      href: val,
    };
    setSettings({
      ...settings,
      header: { ...settings.header, navItems: newItems },
    });
  };

  const toggleNavVisibility = (index: number) => {
    if (!settings) return;
    const newItems = [...settings.header.navItems];
    newItems[index] = {
      ...newItems[index],
      visible: !newItems[index].visible,
    };
    setSettings({
      ...settings,
      header: { ...settings.header, navItems: newItems },
    });
  };

  const addNavItem = () => {
    if (!settings) return;
    const newItem: NavItem = {
      key: "nav_" + Date.now().toString(36),
      label: { tr: "Yeni Menü", en: "New Menu Item" },
      href: "/",
      visible: true,
      order: settings.header.navItems.length + 1,
    };
    setSettings({
      ...settings,
      header: {
        ...settings.header,
        navItems: [...settings.header.navItems, newItem],
      },
    });
  };

  const deleteNavItem = (index: number) => {
    if (!settings) return;
    const newItems = settings.header.navItems.filter((_, idx) => idx !== index);
    setSettings({
      ...settings,
      header: { ...settings.header, navItems: newItems },
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      await logAdminActivity({
        adminUid: user?.uid || "admin",
        adminEmail: user?.email || undefined,
        action: "Header ve menü ayarları güncellendi",
        entityType: "settings",
        entityId: "global/header",
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
              <Layers className="w-6 h-6 text-blue-600" />
              {tr ? "Header & Menü Yönetimi" : "Header & Navigation Management"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {tr
                ? "Üst menü bağlantılarını, logoyu ve teklif butonunu düzenleyin."
                : "Manage top navigation links, logo and header action buttons."}
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
          {/* Logo & CTA settings */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              {tr ? "Logo & Genel Header Ayarları" : "Logo & General Header Settings"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={tr ? "Site Logosu URL (Görsel Yolu)" : "Logo URL"}
                value={settings.logoUrl || ""}
                placeholder="/images/logo.png"
                onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              />
              <Input
                label={tr ? "Header Buton Bağlantısı (URL)" : "Header Button Link (URL)"}
                value={settings.header.ctaHref}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    header: { ...settings.header, ctaHref: e.target.value },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={tr ? "Header Buton Yazısı (TR)" : "Header Button Text (TR)"}
                value={settings.header.ctaText.tr}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    header: {
                      ...settings.header,
                      ctaText: { ...settings.header.ctaText, tr: e.target.value },
                    },
                  })
                }
              />
              <Input
                label={tr ? "Header Buton Yazısı (EN)" : "Header Button Text (EN)"}
                value={settings.header.ctaText.en}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    header: {
                      ...settings.header,
                      ctaText: { ...settings.header.ctaText, en: e.target.value },
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {tr ? "Menü Bağlantıları" : "Navigation Links"}
                </h2>
                <p className="text-xs text-slate-500">
                  {tr ? "Header'da görünen ana menü öğeleri." : "Main navigation items."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditLang("tr")}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    editLang === "tr" ? "bg-blue-100 text-blue-700" : "text-slate-400"
                  }`}
                >
                  TR
                </button>
                <button
                  onClick={() => setEditLang("en")}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    editLang === "en" ? "bg-blue-100 text-blue-700" : "text-slate-400"
                  }`}
                >
                  EN
                </button>
                <Button size="sm" variant="outline" onClick={addNavItem}>
                  <Plus className="w-4 h-4" />
                  {tr ? "Menü Öğesi Ekle" : "Add Link"}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {settings.header.navItems.map((item, idx) => (
                <div
                  key={item.key || idx}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <span className="font-mono text-xs font-bold text-slate-400 w-6 text-center">
                    #{idx + 1}
                  </span>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder={`Menü Başlığı (${editLang.toUpperCase()})`}
                      value={item.label[editLang] || ""}
                      onChange={(e) => handleNavLabelChange(idx, e.target.value)}
                    />
                    <Input
                      placeholder="Hedef URL (/hardware, /contact vb.)"
                      value={item.href}
                      onChange={(e) => handleNavHrefChange(idx, e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => toggleNavVisibility(idx)}
                    title={item.visible ? "Gizle" : "Göster"}
                    className={`p-2 rounded-lg text-xs font-semibold ${
                      item.visible
                        ? "text-slate-600 hover:bg-slate-100"
                        : "text-amber-600 bg-amber-50"
                    }`}
                  >
                    {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => deleteNavItem(idx)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
