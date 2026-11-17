"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { getPageContent, savePageContent, DEFAULT_SITE_PAGES } from "@/lib/firebase/cms";
import { logAdminActivity } from "@/lib/firebase/requests";
import { SitePage, CmsSection, MultilingualText } from "@/types/cms";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  FileText,
  Save,
  Globe,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AdminContentPage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const tr = locale === "tr";

  const [selectedPageKey, setSelectedPageKey] = useState<string>("home");
  const [currentPage, setCurrentPage] = useState<SitePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editLang, setEditLang] = useState<"tr" | "en">("tr");
  const [savedNotice, setSavedNotice] = useState(false);

  // Load page data
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const page = await getPageContent(selectedPageKey);
        setCurrentPage(page);
      } catch (err) {
        console.error("Failed to load page:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedPageKey]);

  const handleFieldChange = (field: "title" | "description", val: string) => {
    if (!currentPage) return;
    setCurrentPage({
      ...currentPage,
      [field]: {
        ...currentPage[field],
        [editLang]: val,
      },
    });
  };

  const handleSeoChange = (field: "title" | "description", val: string) => {
    if (!currentPage) return;
    setCurrentPage({
      ...currentPage,
      seo: {
        ...currentPage.seo,
        [field]: {
          ...currentPage.seo[field],
          [editLang]: val,
        },
      },
    });
  };

  const handleSectionChange = (
    index: number,
    field: "title" | "subtitle" | "content" | "badge" | "buttonText",
    val: string
  ) => {
    if (!currentPage) return;
    const newSections = [...currentPage.sections];
    const sec = { ...newSections[index] };
    const currentVal = (sec[field] as MultilingualText) || { tr: "", en: "" };
    sec[field] = {
      ...currentVal,
      [editLang]: val,
    };
    newSections[index] = sec;
    setCurrentPage({ ...currentPage, sections: newSections });
  };

  const handleSectionPropChange = (
    index: number,
    field: "buttonLink" | "imageUrl" | "visible",
    val: any
  ) => {
    if (!currentPage) return;
    const newSections = [...currentPage.sections];
    newSections[index] = {
      ...newSections[index],
      [field]: val,
    };
    setCurrentPage({ ...currentPage, sections: newSections });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (!currentPage) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentPage.sections.length) return;
    const newSections = [...currentPage.sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;
    // update order numbers
    newSections.forEach((s, idx) => (s.order = idx + 1));
    setCurrentPage({ ...currentPage, sections: newSections });
  };

  const deleteSection = (index: number) => {
    if (!currentPage) return;
    if (!confirm(tr ? "Bu bölümü silmek istediğinize emin misiniz?" : "Delete this section?")) return;
    const newSections = currentPage.sections.filter((_, idx) => idx !== index);
    setCurrentPage({ ...currentPage, sections: newSections });
  };

  const addSection = () => {
    if (!currentPage) return;
    const newSec: CmsSection = {
      id: "sec_" + Date.now().toString(36),
      type: "text",
      title: { tr: "Yeni Başlık", en: "New Heading" },
      content: { tr: "Yeni içerik metni...", en: "New content text..." },
      visible: true,
      order: currentPage.sections.length + 1,
    };
    setCurrentPage({ ...currentPage, sections: [...currentPage.sections, newSec] });
  };

  const handleSave = async (publish = true) => {
    if (!currentPage) return;
    setSaving(true);
    try {
      await savePageContent(currentPage, publish);
      await logAdminActivity({
        adminUid: user?.uid || "admin",
        adminEmail: user?.email || undefined,
        action: publish ? `Sayfa yayınlandı: ${currentPage.pageKey}` : `Taslak kaydedildi: ${currentPage.pageKey}`,
        entityType: "page",
        entityId: currentPage.pageKey,
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            {tr ? "Sayfa İçerik Yönetimi (CMS)" : "Page Content Management (CMS)"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "Web sitesi metinlerini, bannerları ve bölümleri kod değiştirmeden düzenleyin."
              : "Edit website headings, copy, banners and sections without touching code."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-xl border border-green-200 dark:border-green-800">
              <CheckCircle className="w-4 h-4" />
              {tr ? "Yayınlandı!" : "Published!"}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={() => handleSave(false)} loading={saving}>
            {tr ? "Taslak Kaydet" : "Save Draft"}
          </Button>
          <Button variant="primary" size="sm" onClick={() => handleSave(true)} loading={saving}>
            <Save className="w-4 h-4" />
            {tr ? "Yayına Al (Publish)" : "Publish Changes"}
          </Button>
        </div>
      </div>

      {/* Page Selector & Language Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Page selector buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mr-1">
            {tr ? "Sayfa:" : "Page:"}
          </span>
          {[
            { id: "home", label: tr ? "Ana Sayfa" : "Homepage" },
            { id: "hardware", label: tr ? "Donanım" : "Hardware" },
            { id: "automation", label: tr ? "Otomasyon" : "Automation" },
          ].map((pg) => (
            <button
              key={pg.id}
              onClick={() => setSelectedPageKey(pg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedPageKey === pg.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {pg.label}
            </button>
          ))}
        </div>

        {/* Translation Language Tab */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">
            {tr ? "Düzenlenen Dil:" : "Editing Language:"}
          </span>
          <button
            onClick={() => setEditLang("tr")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              editLang === "tr"
                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            🇹🇷 Türkçe (TR)
          </button>
          <button
            onClick={() => setEditLang("en")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              editLang === "en"
                ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            🇬🇧 English (EN)
          </button>
        </div>
      </div>

      {loading || !currentPage ? (
        <div className="p-12 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          {tr ? "Sayfa içeriği yükleniyor..." : "Loading page content..."}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section 1: Page Basic Info & SEO */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <span>{tr ? "Sayfa Genel Bilgileri & SEO" : "Page Overview & SEO"}</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                Route: {currentPage.route}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={`${tr ? "Sayfa Başlığı" : "Page Title"} (${editLang.toUpperCase()})`}
                value={currentPage.title?.[editLang] || ""}
                onChange={(e) => handleFieldChange("title", e.target.value)}
              />
              <Input
                label={`${tr ? "SEO Meta Başlığı" : "SEO Meta Title"} (${editLang.toUpperCase()})`}
                value={currentPage.seo?.title?.[editLang] || ""}
                onChange={(e) => handleSeoChange("title", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {tr ? "Sayfa Açıklaması" : "Page Description"} ({editLang.toUpperCase()})
              </label>
              <textarea
                rows={2}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentPage.description?.[editLang] || ""}
                onChange={(e) => handleFieldChange("description", e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Page Sections Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {tr ? "Sayfa Bölümleri" : "Page Sections"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {tr
                    ? "Bölümlerin sırasını değiştirebilir, görünürlüklerini açıp kapatabilir veya düzenleyebilirsiniz."
                    : "Reorder sections, toggle visibility, and edit content."}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={addSection}>
                <Plus className="w-4 h-4" />
                {tr ? "Bölüm Ekle" : "Add Section"}
              </Button>
            </div>

            {currentPage.sections.map((section, idx) => (
              <div
                key={section.id || idx}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all p-5 shadow-sm space-y-4 ${
                  section.visible
                    ? "border-slate-200 dark:border-slate-800"
                    : "border-dashed border-slate-300 dark:border-slate-800 opacity-60"
                }`}
              >
                {/* Section header bar */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      #{idx + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {section.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Toggle visibility */}
                    <button
                      onClick={() => handleSectionPropChange(idx, "visible", !section.visible)}
                      title={section.visible ? (tr ? "Gizle" : "Hide") : (tr ? "Göster" : "Show")}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                        section.visible
                          ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                          : "text-amber-600 bg-amber-50"
                      }`}
                    >
                      {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Move up */}
                    <button
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>

                    {/* Move down */}
                    <button
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === currentPage.sections.length - 1}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteSection(idx)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={`${tr ? "Bölüm Başlığı" : "Section Title"} (${editLang.toUpperCase()})`}
                    value={section.title?.[editLang] || ""}
                    onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                  />
                  <Input
                    label={`${tr ? "Alt Başlık" : "Subtitle"} (${editLang.toUpperCase()})`}
                    value={section.subtitle?.[editLang] || ""}
                    onChange={(e) => handleSectionChange(idx, "subtitle", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    {tr ? "İçerik Metni" : "Content Text"} ({editLang.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={section.content?.[editLang] || ""}
                    onChange={(e) => handleSectionChange(idx, "content", e.target.value)}
                  />
                </div>

                {/* Optional button & link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <Input
                    label={`${tr ? "Buton Yazısı" : "Button Label"} (${editLang.toUpperCase()})`}
                    value={section.buttonText?.[editLang] || ""}
                    onChange={(e) => handleSectionChange(idx, "buttonText", e.target.value)}
                  />
                  <Input
                    label={tr ? "Buton Bağlantısı (URL)" : "Button Link (URL)"}
                    value={section.buttonLink || ""}
                    placeholder="/calculation veya https://..."
                    onChange={(e) => handleSectionPropChange(idx, "buttonLink", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
