"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const FIREBASE_AUTH_ERRORS: Record<string, { tr: string; en: string }> = {
  "auth/email-already-in-use":  { tr: "Bu e-posta adresi zaten kullanılıyor.", en: "This email is already in use." },
  "auth/weak-password":         { tr: "Şifre çok zayıf. En az 6 karakter kullanın.", en: "Password is too weak. Use at least 6 characters." },
  "auth/invalid-email":         { tr: "Geçersiz e-posta adresi.", en: "Invalid email address." },
  "auth/network-request-failed":{ tr: "Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.", en: "Network error. Check your internet connection." },
  "auth/operation-not-allowed": { tr: "E-posta/şifre ile kayıt şu anda devre dışı.", en: "Email/password registration is currently disabled." },
};

export default function RegisterPage() {
  const { signUp } = useAuth();
  const { locale } = useLocale();
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState(false);

  const tr = locale === "tr";

  const getErrorMessage = (code: string): string => {
    const entry = FIREBASE_AUTH_ERRORS[code];
    if (entry) return entry[locale];
    return tr ? "Kayıt oluşturulamadı. Lütfen tekrar deneyin." : "Registration failed. Please try again.";
  };

  const validate = (): string | null => {
    if (!displayName.trim()) return tr ? "Ad Soyad zorunludur." : "Full name is required.";
    if (!email.trim()) return tr ? "E-posta adresi zorunludur." : "Email is required.";
    if (password.length < 6) return tr ? "Şifre en az 6 karakter olmalıdır." : "Password must be at least 6 characters.";
    if (password !== confirmPassword) return tr ? "Şifreler eşleşmiyor." : "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      await signUp(email.trim(), password, displayName.trim());
      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code || "";
      setError(getErrorMessage(code));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {tr ? "Kayıt Başarılı!" : "Registration Successful!"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {tr
              ? "Hesabınız oluşturuldu. E-posta doğrulama bağlantısı gönderildi. Yönlendiriliyorsunuz..."
              : "Account created. A verification email has been sent. Redirecting..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            KUTEMS
          </Link>
          <h1 className="mt-3 text-xl font-semibold text-slate-900 dark:text-slate-100">
            {tr ? "Yeni Hesap Oluşturun" : "Create Your Account"}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {tr ? "Zaten hesabınız var mı?" : "Already have an account?"}{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              {tr ? "Giriş yapın" : "Sign in"}
            </Link>
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
              id="displayName"
              type="text"
              label={tr ? "Ad Soyad" : "Full Name"}
              placeholder={tr ? "Adınızı girin" : "Enter your name"}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="name"
              leftIcon={<User className="w-4 h-4" />}
              disabled={loading}
              required
            />

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

            <Input
              id="password"
              type={showPw ? "text" : "password"}
              label={tr ? "Şifre" : "Password"}
              placeholder={tr ? "En az 6 karakter" : "At least 6 characters"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
              hint={tr ? "En az 6 karakter kullanın." : "Use at least 6 characters."}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              disabled={loading}
              required
            />

            <Input
              id="confirmPassword"
              type={showPw ? "text" : "password"}
              label={tr ? "Şifre Tekrar" : "Confirm Password"}
              placeholder={tr ? "Şifrenizi tekrar girin" : "Confirm your password"}
              value={confirmPassword}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              leftIcon={<Lock className="w-4 h-4" />}
              error={confirmPassword && password !== confirmPassword
                ? (tr ? "Şifreler eşleşmiyor." : "Passwords do not match.")
                : undefined}
              disabled={loading}
              required
            />

            <Button type="submit" className="w-full" loading={loading} size="lg">
              <UserPlus className="w-4 h-4" />
              {loading
                ? (tr ? "Hesap oluşturuluyor..." : "Creating account...")
                : (tr ? "Hesap Oluştur" : "Create Account")}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-xs text-slate-400 dark:text-slate-600">
          {tr
            ? "Kayıt olarak Kullanım Şartları ve Gizlilik Politikamızı kabul etmiş olursunuz."
            : "By registering you agree to our Terms of Use and Privacy Policy."}
        </p>
      </div>
    </div>
  );
}
