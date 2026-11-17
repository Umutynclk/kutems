"use client";

import { useState } from "react";
import { ProductCategory } from "@/types/catalog";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { ChevronRight, Layers } from "lucide-react";

interface CategorySidebarProps {
  categories: ProductCategory[];
  selectedCategoryId: string | null;
  onSelect: (id: string | null) => void;
}

export default function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelect,
}: CategorySidebarProps) {
  const { t, getLocalized } = useLocale();

  return (
    <nav className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400 px-3 mb-2">
        {t("catalog.categories")}
      </p>

      {/* All */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
          selectedCategoryId === null
            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
        )}
      >
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          {t("catalog.allCategories")}
        </div>
        <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
          {categories.reduce((s, c) => s + (c.productCount || 0), 0)}
        </span>
      </button>

      {/* Category items */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "flex items-center justify-between w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
            selectedCategoryId === cat.id
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
          )}
        >
          <span className="text-left leading-snug">{getLocalized(cat.name)}</span>
          <span className="text-xs tabular-nums ml-2 shrink-0 text-slate-600 dark:text-slate-400">{cat.productCount || 0}</span>
        </button>
      ))}
    </nav>
  );
}
