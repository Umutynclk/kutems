"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import { UserX, LogIn, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const { locale } = useLocale();
  const tr = locale === "tr";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 text-center">
        {/* Brand */}
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
          KUTEMS
        </Link>

        {/* Icon */}
        <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <UserX className="w-7 h-7" />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {tr ? "Kayıtlar Geçici Olarak Kapalıdır" : "Registration Currently Closed"}
        </h1>

        {/* Localized notice */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {tr
            ? "Yeni kullanıcı kayıtları şu anda kapalıdır. Mevcut hesabınızla giriş yapabilirsiniz."
            : "New user registration is currently unavailable. You can sign in with your existing account."}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link href="/login" className="block w-full">
            <Button variant="primary" className="w-full">
              <LogIn className="w-4 h-4" />
              {tr ? "Mevcut Hesapla Giriş Yap" : "Sign In with Existing Account"}
            </Button>
          </Link>
          <Link href="/" className="block w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4" />
              {tr ? "Ana Sayfaya Dön" : "Return to Homepage"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
