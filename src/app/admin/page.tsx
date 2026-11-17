"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { getProducts, getCategories } from "@/lib/firebase/firestore";
import { subscribeToRequests, getRecentAuditLogs } from "@/lib/firebase/requests";
import { CustomerRequest, AdminAuditLog } from "@/types/cms";
import {
  Package,
  Layers,
  Inbox,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  Shield,
  Activity,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const { locale } = useLocale();
  const tr = locale === "tr";

  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hardwareCount, setHardwareCount] = useState(0);
  const [automationCount, setAutomationCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [recentLogs, setRecentLogs] = useState<AdminAuditLog[]>([]);

  // Fetch initial catalog metrics from Firestore
  useEffect(() => {
    async function loadMetrics() {
      try {
        const [prods, cats, logs] = await Promise.all([
          getProducts(),
          getCategories(),
          getRecentAuditLogs(5),
        ]);
        setTotalProducts(prods.length);
        setHardwareCount(prods.filter((p) => p.type === "hardware").length);
        setAutomationCount(prods.filter((p) => p.type === "automation").length);
        setCategoriesCount(cats.length);
        setRecentLogs(logs);
      } catch (err) {
        console.error("Dashboard metrics error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  // Real-time listener for incoming requests
  useEffect(() => {
    const unsub = subscribeToRequests((data) => {
      setRequests(data);
    });
    return () => unsub();
  }, []);

  const newRequests = requests.filter((r) => r.status === "new");
  const inReviewRequests = requests.filter((r) => r.status === "in_review");
  const resolvedRequests = requests.filter(
    (r) => r.status === "responded" || r.status === "closed"
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {tr ? "Yönetim Paneli" : "Admin Dashboard"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "KUTEMS içerik, ürün kataloğu ve gelen talepler merkezi."
              : "KUTEMS content, catalog, and incoming customer inquiries hub."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/requests">
            <Button variant="primary" size="sm">
              <Inbox className="w-4 h-4" />
              {tr ? "Talepleri İncele" : "View Requests"}
              {newRequests.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white text-blue-600 font-bold text-xs">
                  {newRequests.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: New Requests */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {tr ? "Yeni Talepler" : "New Requests"}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {newRequests.length}
            </span>
            {newRequests.length > 0 && (
              <span className="text-xs font-bold text-red-500 animate-pulse">
                {tr ? "İşlem bekliyor" : "Needs attention"}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            {inReviewRequests.length} {tr ? "incelemede" : "in review"} •{" "}
            {resolvedRequests.length} {tr ? "tamamlandı" : "resolved"}
          </p>
        </div>

        {/* Metric 2: Total Products */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {tr ? "Toplam Ürün" : "Total Products"}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {loading ? "..." : totalProducts.toLocaleString()}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            {hardwareCount} Hardware • {automationCount} Automation
          </p>
        </div>

        {/* Metric 3: Categories */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {tr ? "Kategoriler" : "Categories"}
            </span>
            <div className="p-2 rounded-xl bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {loading ? "..." : categoriesCount}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            {tr ? "11 Ana / 40 Alt Kategori" : "11 Main / 40 Subcategories"}
          </p>
        </div>

        {/* Metric 4: Cloudflare CDN Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {tr ? "CDN & Medya Durumu" : "CDN Media Host"}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
            kutems-media
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {tr ? "2.930 Medya Dosyası Yayında" : "2,930 Files Active (100%)"}
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Requests & Quick Content Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Incoming Requests */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {tr ? "Son Gelen Talepler" : "Recent Incoming Requests"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {tr ? "Canlı güncellenen müşteri talepleri" : "Live updated customer inquiries"}
              </p>
            </div>
            <Link
              href="/admin/requests"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              {tr ? "Tümünü Gör" : "View All"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Inbox className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {tr ? "Henüz gelen bir talep bulunmuyor." : "No incoming requests yet."}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {tr
                  ? "Kullanıcılar siteden 'Talep Gönder' formu doldurdukça anında burada görünecektir."
                  : "New inquiries will appear here in real time as visitors submit forms."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 5).map((req) => (
                <Link
                  key={req.id}
                  href={`/admin/requests?id=${req.id}`}
                  className="block p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                        {req.requestId}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                          req.status === "new"
                            ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                            : req.status === "in_review"
                            ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                            : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {req.createdAt?.toDate
                        ? req.createdAt.toDate().toLocaleDateString(tr ? "tr-TR" : "en-US")
                        : "Yeni"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {req.name}
                      </span>{" "}
                      <span className="text-slate-500 dark:text-slate-400">({req.email})</span>
                    </div>
                    {req.articleNumber && (
                      <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                        Art. {req.articleNumber}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Content Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
              {tr ? "Hızlı İşlemler" : "Quick CMS Actions"}
            </h2>
            <div className="space-y-2.5">
              <Link
                href="/admin/content"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{tr ? "Ana Sayfa İçeriğini Düzenle" : "Edit Homepage Content"}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>{tr ? "Ürün & Fiyat Yönetimi" : "Product Management"}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/content/header"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-violet-600" />
                  <span>{tr ? "Menü & Header Düzenle" : "Edit Navigation & Header"}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/content/footer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>{tr ? "Footer & İletişim Bilgileri" : "Edit Footer & Contact"}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Activity Log Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {tr ? "Son Etkinlikler" : "Recent Activity"}
              </h2>
              <Link
                href="/admin/audit"
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {tr ? "Tümü" : "All"}
              </Link>
            </div>
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-400">
                {tr ? "Henüz kayıtlı işlem yok." : "No activity recorded yet."}
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {log.action}
                      </span>{" "}
                      <span>({log.entityType})</span>
                      <p className="text-[10px] text-slate-400">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
