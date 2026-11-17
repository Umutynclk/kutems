"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { getCategories, updateCategory } from "@/lib/firebase/firestore";
import { logAdminActivity } from "@/lib/firebase/requests";
import { ProductCategory } from "@/types/catalog";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Layers, Edit, Save, X, CheckCircle, ChevronDown, ChevronRight, Folder } from "lucide-react";

export default function AdminCategoriesPage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const tr = locale === "tr";

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<ProductCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Load categories error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalSubcategories = categories.reduce(
    (sum, c) => sum + (c.subcategories?.length || 0),
    0
  );

  const handleSave = async () => {
    if (!editingCat) return;
    setSaving(true);
    try {
      await updateCategory(editingCat.id, {
        name: editingCat.name,
        order: editingCat.order,
      });

      await logAdminActivity({
        adminUid: user?.uid || "admin",
        adminEmail: user?.email || undefined,
        action: `Kategori güncellendi: ${editingCat.name.tr || editingCat.name.en}`,
        entityType: "category",
        entityId: editingCat.id,
      });

      setCategories((prev) =>
        prev.map((c) => (c.id === editingCat.id ? editingCat : c))
      );
      setEditingCat(null);
      alert(tr ? "Kategori başarıyla güncellendi!" : "Category updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert(tr ? "Güncellenirken hata oluştu." : "Failed to update category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            {tr ? "Kategori Yönetimi" : "Category Management"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "11 ana kategori ve 40 alt kategorinin hiyerarşisini ve isimlerini yönetin."
              : "Manage 11 main categories and 40 subcategories names and hierarchy."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl">
          <span className="text-slate-400">{tr ? "Ana / Alt:" : "Main / Sub:"}</span>
          <span className="font-bold text-blue-600">
            {categories.length} / {totalSubcategories}
          </span>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            {tr ? "Kategoriler yükleniyor..." : "Loading categories..."}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat, idx) => {
              const isExpanded = expandedId === cat.id;
              const subCount = cat.subcategories?.length || 0;

              return (
                <div key={cat.id} className="p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                    >
                      <button className="text-slate-400 hover:text-slate-600">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                      <Folder className="w-5 h-5 text-blue-500 shrink-0" />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <span>{cat.name.tr}</span>
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-mono">
                            ({cat.name.en})
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          ID: <span className="font-mono">{cat.id}</span> • Tür:{" "}
                          <span className="uppercase font-semibold text-slate-600 dark:text-slate-300">{cat.type}</span> • Sıra: {cat.order}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {subCount} {tr ? "Alt Kategori" : "Subcategories"}
                      </span>
                      <button
                        onClick={() => setEditingCat(cat)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        {tr ? "Düzenle" : "Edit"}
                      </button>
                    </div>
                  </div>

                  {/* Subcategories dropdown */}
                  {isExpanded && subCount > 0 && (
                    <div className="mt-3 ml-8 pl-4 border-l-2 border-slate-100 dark:border-slate-800 space-y-2 pt-1 text-xs">
                      {cat.subcategories!.map((sub, sIdx) => (
                        <div
                          key={sub.id || sIdx}
                          className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {sub.name.tr}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px]">({sub.name.en})</span>
                          </div>
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{sub.id}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                {tr ? "Kategoriyi Düzenle" : "Edit Category"}
              </h3>
              <button
                onClick={() => setEditingCat(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <Input
              label={tr ? "Kategori Adı (Türkçe)" : "Category Name (TR)"}
              value={editingCat.name.tr}
              onChange={(e) =>
                setEditingCat({
                  ...editingCat,
                  name: { ...editingCat.name, tr: e.target.value },
                })
              }
            />

            <Input
              label={tr ? "Kategori Adı (İngilizce)" : "Category Name (EN)"}
              value={editingCat.name.en}
              onChange={(e) =>
                setEditingCat({
                  ...editingCat,
                  name: { ...editingCat.name, en: e.target.value },
                })
              }
            />

            <Input
              type="number"
              label={tr ? "Görüntülenme Sırası (Order)" : "Display Order"}
              value={editingCat.order}
              onChange={(e) =>
                setEditingCat({ ...editingCat, order: parseInt(e.target.value) || 0 })
              }
            />

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setEditingCat(null)}>
                {tr ? "İptal" : "Cancel"}
              </Button>
              <Button size="sm" onClick={handleSave} loading={saving}>
                <Save className="w-4 h-4" />
                {tr ? "Kaydet" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
