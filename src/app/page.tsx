import type { Metadata } from "next";
import CategoryCards from "@/components/home/CategoryCards";

export const metadata: Metadata = {
  title: "KUTEMS – Seksiyonel Kapı Yay Hesaplama & Ürün Kataloğu",
  description:
    "KUTEMS seksiyonel kapı sistemleri için yay hesaplama, donanım kataloğu ve otomasyon çözümleri. Tüm parametreler tek platformda.",
};

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <CategoryCards />
    </div>
  );
}
