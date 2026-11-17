import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/firebase/firestore";
import HardwareCatalogClient from "./HardwareCatalogClient";

export const metadata: Metadata = {
  title: "Donanım Bileşenleri Kataloğu – Hardware Catalog",
  description:
    "Seksiyonel kapı sistemleri için yay, tambur, ray, menteşe, tekerlek ve profil bileşenlerinin eksiksiz teknik kataloğu.",
};

export default async function HardwarePage() {
  const [products, categories] = await Promise.all([
    getProducts("hardware"),
    getCategories("hardware"),
  ]);

  return <HardwareCatalogClient initialProducts={products} initialCategories={categories} />;
}
