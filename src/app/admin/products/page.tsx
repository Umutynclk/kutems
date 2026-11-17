"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import { getProducts, getCategories, updateProduct } from "@/lib/firebase/firestore";
import { logAdminActivity } from "@/lib/firebase/requests";
import { Product, ProductCategory } from "@/types/catalog";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  Package,
  Search,
  Filter,
  Edit,
  ExternalLink,
  Save,
  X,
  CheckCircle,
  Eye,
  EyeOff,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

export default function AdminProductsPage() {
  const { locale } = useLocale();
  const { user } = useAuth();
  const tr = locale === "tr";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [editLang, setEditLang] = useState<"tr" | "en">("tr");

  useEffect(() => {
    async function load() {
      try {
        const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error("Load products error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesType = typeFilter === "all" || p.type === typeFilter;
      const matchesCat = categoryFilter === "all" || p.categoryId === categoryFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.articleNumber?.toLowerCase().includes(q) ||
        p.productCode?.toLowerCase().includes(q) ||
        p.name.tr?.toLowerCase().includes(q) ||
        p.name.en?.toLowerCase().includes(q);
      return matchesType && matchesCat && matchesSearch;
    });
  }, [products, typeFilter, categoryFilter, search]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  // Handle Edit Save
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setSaving(true);
    try {
      await updateProduct(editingProduct.id, {
        name: editingProduct.name,
        shortDescription: editingProduct.shortDescription,
        description: editingProduct.description,
        specifications: editingProduct.specifications,
        featured: editingProduct.featured,
        images: editingProduct.images,
      });

      await logAdminActivity({
        adminUid: user?.uid || "admin",
        adminEmail: user?.email || undefined,
        action: `Ürün güncellendi: Art. ${editingProduct.articleNumber}`,
        entityType: "product",
        entityId: editingProduct.id,
        details: editingProduct.name.tr || editingProduct.name.en,
      });

      // Update in local state
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      setEditingProduct(null);
      alert(tr ? "Ürün başarıyla güncellendi!" : "Product updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(tr ? "Güncellenirken hata oluştu." : "Failed to update product.");
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
            <Package className="w-6 h-6 text-blue-600" />
            {tr ? "Ürün Yönetimi" : "Product Management"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "1.442 ürünün Türkçe/İngilizce başlıklarını, açıklamalarını, özelliklerini ve görsellerini yönetin."
              : "Manage Turkish & English titles, descriptions, specifications, and images for all 1,442 products."}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl">
          <span className="text-slate-400">{tr ? "Toplam:" : "Total:"}</span>
          <span className="font-bold text-blue-600">{products.length}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="flex-1">
          <Input
            placeholder={tr ? "Parça no (1003B, 240...), ürün adı ara..." : "Search article number, code, name..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {[
            { id: "all", label: tr ? "Tümü" : "All" },
            { id: "hardware", label: "Hardware" },
            { id: "automation", label: "Automation" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTypeFilter(t.id);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-xl transition-colors ${
                typeFilter === t.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{tr ? "Tüm Kategoriler" : "All Categories"}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name.tr || c.name.en}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            {tr ? "Ürünler yükleniyor..." : "Loading products..."}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {tr ? "Aramaya uygun ürün bulunamadı." : "No products found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 w-16">Görsel</th>
                  <th className="py-3 px-4">Parça No</th>
                  <th className="py-3 px-4">Ürün Adı</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tür</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-4">
                      <div className="relative w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                        {p.images && p.images[0] ? (
                          <Image
                            src={p.images[0]}
                            alt={p.name.tr || p.name.en}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {p.articleNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.name.tr}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{p.name.en}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 capitalize">{p.categoryId}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.type === "hardware"
                            ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                        }`}
                      >
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/${p.type}/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title={tr ? "Sitede Gör" : "View on Live Site"}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          {tr ? "Düzenle" : "Edit"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            {tr ? "Gösterilen:" : "Showing:"} {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, filteredProducts.length)} / {filteredProducts.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-semibold">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                  {editingProduct.articleNumber}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">
                  {tr ? "Ürünü Düzenle" : "Edit Product"}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selector */}
            <div className="px-6 py-2 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">
                {tr ? "Düzenleme Dili:" : "Language:"}
              </span>
              <button
                onClick={() => setEditLang("tr")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  editLang === "tr" ? "bg-blue-600 text-white" : "text-slate-600"
                }`}
              >
                Türkçe (TR)
              </button>
              <button
                onClick={() => setEditLang("en")}
                className={`px-3 py-1 rounded text-xs font-bold ${
                  editLang === "en" ? "bg-blue-600 text-white" : "text-slate-600"
                }`}
              >
                English (EN)
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <Input
                label={`${tr ? "Ürün Başlığı" : "Product Name"} (${editLang.toUpperCase()})`}
                value={editingProduct.name?.[editLang] || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: { ...editingProduct.name, [editLang]: e.target.value },
                  })
                }
              />

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {tr ? "Kısa Açıklama" : "Short Description"} ({editLang.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={editingProduct.shortDescription?.[editLang] || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      shortDescription: {
                        ...editingProduct.shortDescription,
                        [editLang]: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {tr ? "Detaylı Açıklama" : "Detailed Description"} ({editLang.toUpperCase()})
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={editingProduct.description?.[editLang] || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: {
                        ...editingProduct.description,
                        [editLang]: e.target.value,
                      },
                    })
                  }
                />
              </div>

              {/* Cloudflare Images */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {tr ? "Cloudflare CDN Görsel URL'leri" : "Cloudflare Image URLs"}
                </label>
                <div className="space-y-2">
                  {editingProduct.images.map((img, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={img}
                        onChange={(e) => {
                          const newImgs = [...editingProduct.images];
                          newImgs[i] = e.target.value;
                          setEditingProduct({ ...editingProduct, images: newImgs });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={!!editingProduct.featured}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, featured: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="featured-check" className="font-semibold text-slate-700 dark:text-slate-300">
                  {tr ? "Öne Çıkan Ürün (Featured)" : "Featured Product"}
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/40">
              <Button variant="outline" size="sm" onClick={() => setEditingProduct(null)}>
                {tr ? "İptal" : "Cancel"}
              </Button>
              <Button size="sm" onClick={handleSaveProduct} loading={saving}>
                <Save className="w-4 h-4" />
                {tr ? "Kaydet & Yayınla" : "Save & Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
