"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/context/LocaleContext";
import { Product, ProductCategory } from "@/types/catalog";
import CategorySidebar from "@/components/catalog/CategorySidebar";
import ProductGrid from "@/components/catalog/ProductGrid";
import ProductFilters from "@/components/catalog/ProductFilters";
import { Cpu } from "lucide-react";

interface AutomationCatalogClientProps {
  initialProducts: Product[];
  initialCategories: ProductCategory[];
}

export default function AutomationCatalogClient({
  initialProducts,
  initialCategories,
}: AutomationCatalogClientProps) {
  const { t, getLocalized } = useLocale();
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<ProductCategory[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("nameAsc");

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory) list = list.filter((p) => p.categoryId === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          getLocalized(p.name).toLowerCase().includes(q) ||
          p.productCode.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "nameAsc") return getLocalized(a.name).localeCompare(getLocalized(b.name));
      if (sortBy === "nameDesc") return getLocalized(b.name).localeCompare(getLocalized(a.name));
      if (sortBy === "codeAsc") return a.productCode.localeCompare(b.productCode);
      return a.createdAt < b.createdAt ? 1 : -1;
    });
    return list;
  }, [products, selectedCategory, search, sortBy, getLocalized]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
          <Cpu className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t("catalog.automationTitle")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("catalog.automationSubtitle")}
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <CategorySidebar
              categories={categories}
              selectedCategoryId={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Mobile category pills */}
          <div className="lg:hidden mb-4 flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === null ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}
            >
              {t("catalog.allCategories")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === cat.id ? "bg-violet-600 text-white border-violet-600" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}
              >
                {getLocalized(cat.name).split(" ")[0]}
              </button>
            ))}
          </div>

          <ProductFilters search={search} onSearch={setSearch} sortBy={sortBy} onSort={setSortBy} />
          <ProductGrid
            products={filtered}
            onClearFilters={() => { setSearch(""); setSelectedCategory(null); }}
          />
        </div>
      </div>
    </div>
  );
}
