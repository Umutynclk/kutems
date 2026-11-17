"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { Product } from "@/types/catalog";
import Button from "@/components/ui/Button";
import InquiryModal from "@/components/inquiry/InquiryModal";
import { ArrowLeft, Tag, Download, Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { getLocalized, t } = useLocale();
  const [activeImage, setActiveImage] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const name = getLocalized(product.name);
  const description = getLocalized(product.description);
  const shortDescription = getLocalized(product.shortDescription);
  const materials = product.materials ? getLocalized(product.materials) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link
          href={`/${product.type}`}
          className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("catalog.backToCatalog")}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            {product.images[activeImage] ? (
              <Image
                src={product.images[activeImage]}
                alt={name}
                fill
                className="object-contain p-6"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <Package className="h-20 w-20 text-slate-200 dark:text-slate-700" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-16 w-16 rounded-xl border-2 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-150 shrink-0",
                    activeImage === i
                      ? "border-blue-500 shadow-md"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  )}
                >
                  <Image src={img} alt={`${name} ${i + 1}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {product.productCode}
              </span>
              {product.featured && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">{name}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{shortDescription}</p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {t("catalog.overview")}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
          </div>

          {/* Technical Specifications */}
          {product.specifications.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                {t("catalog.specs")}
              </h2>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr
                        key={i}
                        className={cn(
                          "border-b border-slate-100 dark:border-slate-800 last:border-b-0",
                          i % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"
                        )}
                      >
                        <td className="px-4 py-2.5 font-medium text-slate-600 dark:text-slate-400 w-44">
                          {typeof spec.key === "string" ? spec.key : getLocalized(spec.key)}
                        </td>
                        <td className="px-4 py-2.5 text-slate-900 dark:text-slate-100 font-mono text-xs">
                          {typeof spec.value === "string" ? spec.value : getLocalized(spec.value as { tr: string; en: string })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Dimensions & Materials */}
          {(product.dimensions || materials) && (
            <div className="grid grid-cols-2 gap-4">
              {product.dimensions && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    {t("catalog.dimensions")}
                  </p>
                  <div className="space-y-1">
                    {Object.entries(product.dimensions)
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k} className="flex justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400 capitalize">{k}</span>
                          <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{v}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              {materials && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    {t("catalog.material")}
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{materials}</p>
                </div>
              )}
            </div>
          )}

          {/* Downloads */}
          {product.downloads && product.downloads.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                {t("catalog.downloads")}
              </h2>
              <div className="space-y-2">
                {product.downloads.map((dl, i) => (
                  <a
                    key={i}
                    href={dl.url}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-150 group"
                  >
                    <Download className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {getLocalized(dl.title)}
                      </p>
                      {dl.fileSize && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{dl.fileSize}</p>
                      )}
                    </div>
                    <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {dl.type}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Inquiry Button */}
          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1"
              variant="primary"
              onClick={() => setInquiryOpen(true)}
            >
              <Tag className="h-4 w-4" />
              {t("catalog.inquire")}
            </Button>
            <Link
              href={`/${product.type}`}
              className="inline-flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
              title={t("common.back")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        productContext={{
          id: product.id,
          code: product.productCode,
          articleNumber: product.articleNumber,
          name: name,
          type: product.type,
        }}
      />

      {/* Compatible Products */}
      {product.compatibleProducts && product.compatibleProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t("catalog.compatible")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {product.compatibleProducts.map((comp) => (
              <Link
                key={comp.code}
                href={`/${product.type}/product/${comp.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all duration-150 bg-white dark:bg-slate-900 group"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <Package className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">{comp.code}</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {getLocalized(comp.name)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
