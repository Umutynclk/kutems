import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/context/LocaleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "KUTEMS – Seksiyonel Kapı Yay Hesaplama & Ürün Kataloğu",
    template: "%s | KUTEMS",
  },
  description:
    "KUTEMS seksiyonel kapı sistemleri için torsiyon yay hesaplama, donanım kataloğu ve otomasyon çözümleri profesyonel platformu.",
  keywords: ["torsiyon yay", "seksiyonel kapı", "yay hesaplama", "kapı donanımı", "otomasyon", "KUTEMS"],
  openGraph: {
    siteName: "KUTEMS",
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('app_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
        <ThemeProvider>
          <LocaleProvider>
            <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pt-16">
                {children}
              </main>
              <Footer />
            </div>
            </AuthProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
