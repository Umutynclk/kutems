"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/context/LocaleContext";
import { MOCK_PRODUCTS } from "@/lib/data/mockProducts";
import { MOCK_HARDWARE_CATEGORIES, MOCK_AUTOMATION_CATEGORIES } from "@/lib/data/mockCategories";
import Modal from "@/components/ui/Modal";
import { Search, Tag, Layers } from "lucide-react";
import Link from "next/link";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const { t, getLocalized } = useLocale();
  const [query, setQuery] = useState("");

  const allCategories = [...MOCK_HARDWARE_CATEGORIES, ...MOCK_AUTOMATION_CATEGORIES];

  const results = useCallback(() => {
    if (!query.trim()) return { products: [], categories: [] };
    const q = query.toLowerCase();
    const products = MOCK_PRODUCTS.filter(
      (p) =>
        getLocalized(p.name).toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q) ||
        getLocalized(p.shortDescription).toLowerCase().includes(q)
    ).slice(0, 6);
    const categories = allCategories.filter((c) =>
      getLocalized(c.name).toLowerCase().includes(q)
    ).slice(0, 4);
    return { products, categories };
  }, [query, getLocalized, allCategories]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const { products, categories } = results();
  const hasResults = products.length > 0 || categories.length > 0;

  return (
    <Modal open={open} onClose={onClose} maxWidth="lg" className="!p-0">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3">
        <Search className="h-5 w-5 text-slate-500 dark:text-slate-400 shrink-0" />
        <input
          autoFocus
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("nav.searchPlaceholder")}
          className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-md font-mono">
          esc
        </kbd>
      </div>

      <div className="max-h-96 overflow-y-auto p-4">
        {!query && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            {t("nav.searchPlaceholder")}
          </p>
        )}

        {query && !hasResults && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            {t("catalog.noProducts")}
          </p>
        )}

        {categories.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-2">
              {t("catalog.categories")}
            </p>
            <div className="space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.type}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {getLocalized(cat.name)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{cat.type}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {products.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">
              {t("catalog.allProducts")}
            </p>
            <div className="space-y-1">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${product.type}/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Tag className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {getLocalized(product.name)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{product.productCode}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
