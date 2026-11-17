"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const FIREBASE_AUTH_ERRORS: Record<string, { tr: string; en: string }> = {
  "auth/invalid-credential":    { tr: "E-posta veya şifre hatalı.", en: "Invalid email or password." },
  "auth/user-not-found":        { tr: "Bu e-posta adresiyle kayıtlı hesap bulunamadı.", en: "No account found with this email." },
  "auth/wrong-password":        { tr: "Şifre hatalı.", en: "Incorrect password." },
  "auth/too-many-requests":     { tr: "Çok fazla deneme. Lütfen bir süre bekleyin.", en: "Too many attempts. Please wait a moment." },
  "auth/user-disabled":         { tr: "Hesabınız devre dışı bırakıldı.", en: "Your account has been disabled." },
  "auth/network-request-failed":{ tr: "Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.", en: "Network error. Check your internet connection." },
};

export default function LoginPage() {
  const { signIn } = useAuth();
  const { t, locale } = useLocale();
  const router = useRouter();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const getErrorMessage = (code: string): string => {
    const entry = FIREBASE_AUTH_ERRORS[code];
    if (entry) return entry[locale];
    return locale === "tr" ? "Giriş yapılamadı. Lütfen tekrar deneyin." : "Sign in failed. Please try again.";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(locale === "tr" ? "E-posta adresi zorunludur." : "Email is required.");
      return;
    }
    if (!password) {
      setError(locale === "tr" ? "Şifre zorunludur." : "Password is required.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.push("/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(getErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            KUTEMS
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {locale === "tr" ? "Hesabınıza Giriş Yapın" : "Sign In to Your Account"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {locale === "tr"
              ? "Hesabınız yok mu?"
              : "Don't have an account?"}{" "}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              {locale === "tr" ? "Kayıt olun" : "Sign up"}
            </Link>
          </p>
        </div>

        {/* Form Card */}
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
              label={locale === "tr" ? "E-posta Adresi" : "Email Address"}
              placeholder={locale === "tr" ? "ornek@email.com" : "example@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              leftIcon={<Mail className="w-4 h-4" />}
              disabled={loading}
              required
            />

            <Input
              id="password"
              type={showPw ? "text" : "password"}
              label={locale === "tr" ? "Şifre" : "Password"}
              placeholder={locale === "tr" ? "Şifrenizi girin" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              leftIcon={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPw ? (locale === "tr" ? "Şifreyi gizle" : "Hide password") : (locale === "tr" ? "Şifreyi göster" : "Show password")}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              disabled={loading}
              required
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {locale === "tr" ? "Şifremi unuttum" : "Forgot password?"}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              size="lg"
            >
              <LogIn className="w-4 h-4" />
              {loading
                ? (locale === "tr" ? "Giriş yapılıyor..." : "Signing in...")
                : (locale === "tr" ? "Giriş Yap" : "Sign In")}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-slate-400 dark:text-slate-600">
          {locale === "tr"
            ? "Giriş yaparak Kullanım Şartları ve Gizlilik Politikamızı kabul etmiş olursunuz."
            : "By signing in you agree to our Terms of Use and Privacy Policy."}
        </p>
      </div>
    </div>
  );
}
