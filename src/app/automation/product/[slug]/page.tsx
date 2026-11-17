import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/firebase/firestore";
import ProductDetailClient from "@/app/hardware/product/[slug]/ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name.tr || product.name.en,
    description: product.shortDescription.tr || product.shortDescription.en,
  };
}

export default async function AutomationProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.type !== "automation") {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
