"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { locale } = useLocale();
  const tr = locale === "tr";

  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(tr ? "E-posta adresi zorunludur." : "Email is required.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      // We deliberately don't distinguish "user not found" to prevent enumeration
      if (code === "auth/network-request-failed") {
        setError(tr ? "Ağ bağlantısı hatası." : "Network error. Check your connection.");
      } else {
        // Show generic success even for non-existent emails (security best practice)
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            {tr ? "E-posta Gönderildi" : "Email Sent"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            {tr
              ? `${email} adresine şifre sıfırlama bağlantısı gönderdik (eğer bu adres kayıtlıysa). Spam/Gereksiz klasörünüzü de kontrol edin.`
              : `We sent a password reset link to ${email} (if it's registered). Please also check your spam folder.`}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {tr ? "Giriş sayfasına dön" : "Back to sign in"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            KUTEMS
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {tr ? "Şifremi Unuttum" : "Forgot Password"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {tr
              ? "E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim."
              : "Enter your email and we'll send you a password reset link."}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="email"
              type="email"
              label={tr ? "E-posta Adresi" : "Email Address"}
              placeholder={tr ? "ornek@email.com" : "example@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              disabled={loading}
              required
            />

            <Button type="submit" className="w-full" loading={loading} size="lg">
              <Mail className="w-4 h-4" />
              {loading
                ? (tr ? "Gönderiliyor..." : "Sending...")
                : (tr ? "Sıfırlama Bağlantısı Gönder" : "Send Reset Link")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              {tr ? "Giriş sayfasına dön" : "Back to sign in"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
