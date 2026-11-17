import type { Metadata } from "next";
import { getProducts, getCategories } from "@/lib/firebase/firestore";
import AutomationCatalogClient from "./AutomationCatalogClient";

export const metadata: Metadata = {
  title: "Otomasyon & Motor Sistemleri – Automation Catalog",
  description:
    "Seksiyonel kapılar için endüstriyel şaft motorları, garaj kapısı motorları, kontrol panelleri ve güvenlik aksesuarları.",
};

export default async function AutomationPage() {
  const [products, categories] = await Promise.all([
    getProducts("automation"),
    getCategories("automation"),
  ]);

  return <AutomationCatalogClient initialProducts={products} initialCategories={categories} />;
}
