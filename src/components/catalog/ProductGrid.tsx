"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/catalog";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { useLocale } from "@/context/LocaleContext";
import Button from "@/components/ui/Button";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onClearFilters?: () => void;
  pageSize?: number;
}

export default function ProductGrid({
  products,
  loading,
  onClearFilters,
  pageSize = 36,
}: ProductGridProps) {
  const { t } = useLocale();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when the product list changes (e.g. search or filter changed)
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-base font-medium text-slate-700 dark:text-slate-300 mb-1">
          {t("catalog.noProducts")}
        </p>
        {onClearFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="mt-3">
            {t("catalog.clearFilters")}
          </Button>
        )}
      </div>
    );
  }

  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{products.length}</span>{" "}
          {t("catalog.resultsFound")}
          {totalPages > 1 && (
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
              (Sayfa {currentPage} / {totalPages})
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => Math.max(p - 1, 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            Önceki
          </Button>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[280px] sm:max-w-md py-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first, last, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-semibold transition-colors ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 3 ||
                page === currentPage + 3
              ) {
                return (
                  <span key={page} className="px-1 text-slate-500 dark:text-slate-400 text-xs">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => Math.min(p + 1, totalPages));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-1.5"
          >
            Sonraki
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
