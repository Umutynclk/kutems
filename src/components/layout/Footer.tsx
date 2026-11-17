"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { Calculator, Package, Cpu, Mail, Globe, Shield, FileText } from "lucide-react";

export default function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">KT</span>
              </div>
              <span className="font-bold text-white text-sm tracking-tight">
                KUTEMS
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-4">
              {t("footer.description")}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="mailto:info@kutems.com.tr"
                className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                aria-label="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/calculation", icon: Calculator, label: t("nav.calculation") },
                { href: "/hardware", icon: Package, label: t("nav.hardware") },
                { href: "/automation", icon: Cpu, label: t("nav.automation") },
              ].map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    <Icon className="h-3.5 w-3.5 text-blue-500" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              {t("footer.categories")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                t("footer.springSystems"),
                t("footer.trackComponents"),
                t("footer.automationGroup"),
              ].map((item) => (
                <li key={item}>
                  <Link href="/hardware" className="hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
              {t("footer.support")}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Shield className="h-3.5 w-3.5 text-green-500" />
                  {t("footer.standards")}
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  {t("footer.documentation")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © {year} KUTEMS. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            EN 13241-1 Compliant
          </div>
        </div>
      </div>
    </footer>
  );
}
