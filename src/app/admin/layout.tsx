"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import { subscribeToRequests } from "@/lib/firebase/requests";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Package,
  Layers,
  Image as ImageIcon,
  Settings,
  History,
  Shield,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Compass,
  ArrowLeft,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface NavItem {
  name: { tr: string; en: string };
  href: string;
  icon: any;
  badge?: number;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const { locale } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const tr = locale === "tr";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newRequestCount, setNewRequestCount] = useState(0);

  // Subscribe to new requests count in real time
  useEffect(() => {
    if (!isAdmin) return;
    const unsub = subscribeToRequests(
      (requests) => {
        const count = requests.filter((r) => r.status === "new").length;
        setNewRequestCount(count);
      },
      undefined,
      "new"
    );
    return () => unsub();
  }, [isAdmin]);

  // Handle unauthenticated redirect
  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {tr ? "Yönetici yetkileri doğrulanıyor..." : "Verifying administrator permissions..."}
        </p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Access Denied screen for normal authenticated users without admin custom claim
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-red-200 dark:border-red-900/40 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {tr ? "Erişim Reddedildi (403)" : "Access Denied (403)"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {tr
              ? "Bu sayfaya erişim için yönetici yetkisi (admin custom claim) gereklidir. Hesabınız standart kullanıcı yetkilerine sahiptir."
              : "Administrative privileges (admin custom claim) are required to access this panel. Your account does not have admin permissions."}
          </p>
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button variant="primary" className="w-full">
                <ArrowLeft className="w-4 h-4" />
                {tr ? "Ana Sayfaya Dön" : "Return to Home"}
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                await signOut();
                router.push("/login");
              }}
            >
              <LogOut className="w-4 h-4" />
              {tr ? "Farklı Hesapla Giriş Yap" : "Sign In with Different Account"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const navItems: NavItem[] = [
    {
      name: { tr: "Genel Bakış", en: "Dashboard" },
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: { tr: "Gelen Talepler", en: "Incoming Requests" },
      href: "/admin/requests",
      icon: Inbox,
      badge: newRequestCount,
    },
    {
      name: { tr: "Sayfa İçerikleri", en: "Page Content (CMS)" },
      href: "/admin/content",
      icon: FileText,
    },
    {
      name: { tr: "Ürün Yönetimi", en: "Products" },
      href: "/admin/products",
      icon: Package,
    },
    {
      name: { tr: "Kategori Yönetimi", en: "Categories" },
      href: "/admin/categories",
      icon: Layers,
    },
    {
      name: { tr: "Medya Kütüphanesi", en: "Media Library" },
      href: "/admin/media",
      icon: ImageIcon,
    },
    {
      name: { tr: "Site Ayarları", en: "Site Settings" },
      href: "/admin/settings",
      icon: Settings,
    },
    {
      name: { tr: "Denetim Günlüğü", en: "Audit Log" },
      href: "/admin/audit",
      icon: History,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            KT
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
            KUTEMS CMS
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-transform md:translate-x-0 ${
          mobileMenuOpen ? "fixed inset-y-16 left-0 z-40 block shadow-xl" : "hidden md:flex"
        }`}
      >
        {/* Brand header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              KT
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-tight">
                KUTEMS
              </div>
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                Admin CMS
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
            <Shield className="w-3 h-3" />
            Admin
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"}`} />
                  <span>{tr ? item.name.tr : item.name.en}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
              {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {user.displayName || user.email}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {tr ? "Web Sitesini Aç" : "View Live Site"}
            </Link>
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              {tr ? "Çıkış Yap" : "Sign Out"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
