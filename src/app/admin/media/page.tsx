"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {
  Image as ImageIcon,
  FileText,
  Search,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  HardDrive,
} from "lucide-react";

interface MediaItem {
  type: "image" | "document";
  articleNumber: string;
  filename: string;
  relativePath: string;
  size: number;
  cdnUrl: string;
}

export default function AdminMediaPage() {
  const { locale } = useLocale();
  const tr = locale === "tr";

  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: "36",
          type: typeFilter,
          search,
        });
        const res = await fetch(`/api/media?${params.toString()}`);
        const data = await res.json();
        setItems(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Fetch media error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, [page, typeFilter, search]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            {tr ? "Medya Kütüphanesi" : "Media Library"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "Cloudflare Pages CDN üzerinde barındırılan 2.922 görsel ve 8 PDF dökümanı."
              : "2,922 images and 8 PDF documents hosted on Cloudflare Pages CDN."}
          </p>
        </div>

        {/* CDN Status Pill */}
        <div className="flex items-center gap-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl">
          <Globe className="w-4 h-4 text-emerald-500" />
          <span className="text-slate-400">Host:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            kutems-media.pages.dev
          </span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold">
          {[
            { id: "all", label: tr ? "Tüm Dosyalar" : "All Files" },
            { id: "image", label: tr ? "Görseller" : "Images" },
            { id: "document", label: tr ? "PDF Belgeler" : "PDF Documents" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setTypeFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-xl transition-colors ${
                typeFilter === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <Input
            placeholder={tr ? "Parça no (100041, 1003B...) veya dosya adı ara..." : "Search article number or filename..."}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            {tr ? "Medya dosyaları yükleniyor..." : "Loading media..."}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            {tr ? "Aramaya uygun medya dosyası bulunamadı." : "No media found."}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
              >
                {/* Thumbnail / Preview */}
                <div
                  onClick={() => setPreviewItem(item)}
                  className="relative aspect-square w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer flex items-center justify-center mb-2"
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.cdnUrl}
                      alt={item.filename}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="text-center p-2">
                      <FileText className="w-8 h-8 mx-auto text-red-500 mb-1" />
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        PDF
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      Art. {item.articleNumber}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px]">{formatSize(item.size)}</span>
                  </div>
                  <p
                    className="text-[11px] text-slate-700 dark:text-slate-300 truncate font-mono"
                    title={item.filename}
                  >
                    {item.filename}
                  </p>
                </div>

                {/* Copy URL Button */}
                <button
                  onClick={() => handleCopy(item.cdnUrl)}
                  className="mt-2 w-full py-1 px-2 rounded-lg bg-slate-200/70 dark:bg-slate-700/60 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  {copiedUrl === item.cdnUrl ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      {tr ? "Kopyalandı!" : "Copied!"}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      {tr ? "CDN URL Kopyala" : "Copy URL"}
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            {tr ? "Toplam:" : "Total:"} {total.toLocaleString()} {tr ? "dosya" : "files"} (
            {tr ? "Sayfa:" : "Page:"} {page} / {totalPages})
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-semibold">{page}</span>
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

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 block">
                  Art. {previewItem.articleNumber}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono truncate">
                  {previewItem.filename}
                </h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Body */}
            <div className="relative aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
              {previewItem.type === "image" ? (
                <Image
                  src={previewItem.cdnUrl}
                  alt={previewItem.filename}
                  fill
                  className="object-contain p-4"
                />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <FileText className="w-16 h-16 text-red-500 mx-auto" />
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    PDF Dökümanı
                  </p>
                  <a
                    href={previewItem.cdnUrl}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Yeni Sekmede Aç
                  </a>
                </div>
              )}
            </div>

            {/* CDN URL Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-slate-600 dark:text-slate-400 truncate flex-1">
                {previewItem.cdnUrl}
              </span>
              <Button size="sm" onClick={() => handleCopy(previewItem.cdnUrl)}>
                {copiedUrl === previewItem.cdnUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    {tr ? "Kopyalandı" : "Copied"}
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    {tr ? "URL Kopyala" : "Copy URL"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
