"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Mail, Calendar, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/context/LocaleContext";
import Button from "@/components/ui/Button";

export default function AccountPage() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const { locale } = useLocale();
  const router = useRouter();
  const tr = locale === "tr";

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          {tr ? "Hesabım" : "My Account"}
        </h1>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Avatar */}
          <div className="bg-blue-600 dark:bg-blue-700 px-8 py-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {user.displayName || (tr ? "Kullanıcı" : "User")}
              </p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 text-xs bg-yellow-400 text-yellow-900 font-semibold px-2 py-0.5 rounded-full mt-1">
                  <Shield className="w-3 h-3" />
                  {tr ? "Yönetici" : "Admin"}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="px-8 py-6 space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{user.displayName || (tr ? "İsim belirtilmemiş" : "Name not set")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>{user.email}</span>
              {user.emailVerified && (
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {tr ? "✓ Doğrulandı" : "✓ Verified"}
                </span>
              )}
              {!user.emailVerified && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {tr ? "⚠ Doğrulanmadı" : "⚠ Unverified"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span>
                {tr ? "Üyelik:" : "Member since:"}{" "}
                {user.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString(
                      tr ? "tr-TR" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" }
                    )
                  : "—"}
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="border-t border-slate-100 dark:border-slate-800 px-8 py-5 flex flex-wrap gap-3">
            {isAdmin && (
              <Link href="/admin">
                <Button variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Shield className="w-3.5 h-3.5" />
                  {tr ? "Yönetim Paneli (Admin)" : "Admin Panel"}
                </Button>
              </Link>
            )}
            <Link href="/hardware">
              <Button variant="outline" size="sm">
                {tr ? "Donanım Kataloğu" : "Hardware Catalog"}
              </Button>
            </Link>
            <Link href="/automation">
              <Button variant="outline" size="sm">
                {tr ? "Otomasyon" : "Automation"}
              </Button>
            </Link>
            <Link href="/calculation">
              <Button variant="outline" size="sm">
                {tr ? "Yay Hesaplama" : "Spring Calculator"}
              </Button>
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-slate-100 dark:border-slate-800 px-8 py-5">
            <Button variant="danger" onClick={handleSignOut} className="w-full">
              <LogOut className="w-4 h-4" />
              {tr ? "Çıkış Yap" : "Sign Out"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
