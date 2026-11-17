/**
 * src/lib/firebase/firestore.ts
 * 
 * Dual-layer data access:
 *  1. Primary: Cloud Firestore (kutems project, eur3)
 *  2. Fallback: Local JSON (dev only — production logs a warning, never silently mixes data)
 * 
 * Firestore is now live. The fallback is kept for local dev without network access.
 * Production never silently falls back without a console.warn.
 */

import { collection, getDocs, doc, getDoc, updateDoc, serverTimestamp, query, where, orderBy, limit as fsLimit } from "firebase/firestore";
import { db } from "./config";
import { Product, ProductCategory } from "@/types/catalog";

// --- Static local fallback (dev only) ---
// Lazily loaded so the JSON is not bundled in Firestore-first production paths.
let _localProducts: Product[] | null = null;
let _localCategories: ProductCategory[] | null = null;

function localProducts(): Product[] {
  if (_localProducts) return _localProducts;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require("../data/importedProducts.json");
    _localProducts = data as unknown as Product[];
  } catch {
    _localProducts = [];
  }
  return _localProducts!;
}

function localCategories(): ProductCategory[] {
  if (_localCategories) return _localCategories;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require("../data/importedCategories.json");
    _localCategories = data as unknown as ProductCategory[];
  } catch {
    _localCategories = [];
  }
  return _localCategories!;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function warnFallback(reason: string) {
  if (IS_PRODUCTION) {
    console.warn(`[KUTEMS/Firestore] Firestore unavailable, using local fallback. Reason: ${reason}`);
  }
}

// ---------------------------------------------------------------------------

export async function getCategories(type?: "hardware" | "automation"): Promise<ProductCategory[]> {
  try {
    const ref = collection(db, "categories");
    const q = type
      ? query(ref, where("type", "==", type), orderBy("order", "asc"))
      : query(ref, orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProductCategory));
    }
    // Empty collection after successful query — still return empty (don't mask with local)
    return [];
  } catch (err: unknown) {
    warnFallback((err as Error).message);
    const all = localCategories();
    return type ? all.filter((c) => c.type === type) : all;
  }
}

export async function getProducts(type?: "hardware" | "automation", categorySlug?: string): Promise<Product[]> {
  try {
    const ref = collection(db, "products");
    const q = type
      ? query(ref, where("type", "==", type), orderBy("createdAt", "desc"))
      : query(ref, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    if (!snap.empty) {
      let items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
      if (categorySlug) {
        items = items.filter((p) => p.categoryId === categorySlug);
      }
      return items;
    }
    return [];
  } catch (err: unknown) {
    warnFallback((err as Error).message);
    let results = [...localProducts()];
    if (type) results = results.filter((p) => p.type === type);
    if (categorySlug) results = results.filter((p) => p.categoryId === categorySlug);
    return results;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const ref = collection(db, "products");
    const q = query(ref, where("slug", "==", slug), fsLimit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as Product;
    }
    // Try article number
    const q2 = query(ref, where("articleNumber", "==", slug), fsLimit(1));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) {
      return { id: snap2.docs[0].id, ...snap2.docs[0].data() } as Product;
    }
    return null;
  } catch (err: unknown) {
    warnFallback((err as Error).message);
    const all = localProducts();
    return all.find((p) => p.slug === slug || p.articleNumber === slug) ?? null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Product;
    }
    return null;
  } catch (err: unknown) {
    warnFallback((err as Error).message);
    return localProducts().find((p) => p.id === id) ?? null;
  }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const ref = doc(db, "products", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function updateCategory(id: string, data: Partial<ProductCategory>): Promise<void> {
  const ref = doc(db, "categories", id);
  await updateDoc(ref, {
    ...data,
  });
}
