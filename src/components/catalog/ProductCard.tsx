"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { Product } from "@/types/catalog";
import { ArrowRight, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { getLocalized, t } = useLocale();
  const href = `/${product.type}/product/${product.slug}`;
  const mainImage = product.images[0];

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700"
    >
      {/* Image */}
      <div className="relative h-44 bg-slate-50 dark:bg-slate-800 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={getLocalized(product.name)}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <Tag className="h-12 w-12 text-slate-300 dark:text-slate-600" />
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 left-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-400">
            {product.productCode}
          </p>
        </div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
          {getLocalized(product.name)}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
          {getLocalized(product.shortDescription)}
        </p>

        {/* Specs Preview */}
        {product.specifications.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {product.specifications.slice(0, 2).map((spec, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium"
              >
                {getLocalized(spec.value)}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 mt-2 text-blue-600 dark:text-blue-400 text-xs font-semibold group-hover:gap-2 transition-all duration-150">
          {t("catalog.viewDetails")}
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
