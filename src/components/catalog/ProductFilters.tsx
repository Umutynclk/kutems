"use client";

import { useLocale } from "@/context/LocaleContext";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFiltersProps {
  search: string;
  onSearch: (v: string) => void;
  sortBy: string;
  onSort: (v: string) => void;
}

export default function ProductFilters({ search, onSearch, sortBy, onSort }: ProductFiltersProps) {
  const { t } = useLocale();

  const sortOptions = [
    { value: "nameAsc", label: t("catalog.sortOptions.nameAsc") },
    { value: "nameDesc", label: t("catalog.sortOptions.nameDesc") },
    { value: "codeAsc", label: t("catalog.sortOptions.codeAsc") },
    { value: "newest", label: t("catalog.sortOptions.newest") },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
        <input
          type="text"
          placeholder={t("catalog.search")}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className={cn(
            "w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700",
            "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
            "placeholder-slate-400 dark:placeholder-slate-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-all duration-150"
          )}
        />
      </div>

      {/* Sort */}
      <div className="relative">
        <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
        <select
          value={sortBy}
          onChange={(e) => onSort(e.target.value)}
          className={cn(
            "pl-9 pr-8 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 appearance-none",
            "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-all duration-150 cursor-pointer"
          )}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
