"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchModal from "./SearchModal";
import { Search, Menu, X, Calculator, Package, Cpu, Home, ChevronRight, LogIn, UserCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "nav.calculation", href: "/calculation", icon: Calculator },
  { key: "nav.hardware", href: "/hardware", icon: Package },
  { key: "nav.automation", href: "/automation", icon: Cpu },
];

export default function Header() {
  const { t, locale } = useLocale();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm"
            : "bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                <span className="text-white font-bold text-sm">KT</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">
                KUTEMS
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t(key)}
                  </Link>
                );
              })}
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label={t("nav.search")}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 text-sm transition-all duration-150"
              >
                <Search className="h-4 w-4" />
                <span className="text-xs hidden lg:block">{t("nav.search")}</span>
                <kbd className="hidden lg:flex items-center text-xs border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5 font-mono text-slate-500 dark:text-slate-400">
                  ⌘K
                </kbd>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={t("nav.search")}
              >
                <Search className="h-4 w-4" />
              </button>

              <LanguageSwitcher />
              <ThemeToggle />

              {/* Auth button */}
              {!authLoading && (
                user ? (
                  <div className="hidden sm:flex items-center gap-2">
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/account"
                      aria-label={locale === "tr" ? "Hesabım" : "My Account"}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-150"
                    >
                      <UserCircle className="h-4 w-4" />
                      <span className="hidden lg:block max-w-[100px] truncate">
                        {user.displayName || user.email?.split("@")[0]}
                      </span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{locale === "tr" ? "Giriş" : "Sign In"}</span>
                  </Link>
                )
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={t("nav.menu")}
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              <Link
                href="/"
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname === "/"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {t("nav.home")}
                </div>
                <ChevronRight className="h-4 w-4 opacity-40" />
              </Link>
              {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {t(key)}
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                );
              })}
            </nav>

            {/* Mobile auth */}
            {!authLoading && (
              <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3">
                {user ? (
                  <Link
                    href="/account"
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4" />
                      {user.displayName || user.email?.split("@")[0]}
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    {locale === "tr" ? "Giriş Yap" : "Sign In"}
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
