/**
 * src/lib/firebase/cms.ts
 * Content Management System Firestore Service
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config";
import { SitePage, SiteSettings } from "@/types/cms";

// Default pre-seeded pages for instant zero-config fallback
export const DEFAULT_SITE_PAGES: Record<string, SitePage> = {
  home: {
    id: "home",
    pageKey: "home",
    route: "/",
    title: {
      tr: "KUTEMS – Seksiyonel Kapı Yay Hesaplama & Ürün Kataloğu",
      en: "KUTEMS – Sectional Door Spring Calculator & Product Catalog",
    },
    description: {
      tr: "KUTEMS seksiyonel kapı sistemleri için torsiyon yay hesaplama, donanım kataloğu ve otomasyon çözümleri profesyonel platformu.",
      en: "Professional platform for sectional door spring calculation, hardware catalog and automation solutions.",
    },
    published: true,
    sections: [
      {
        id: "hero",
        type: "hero",
        title: {
          tr: "Seksiyonel Kapı Sistemlerinde",
          en: "In Sectional Door Systems",
        },
        subtitle: {
          tr: "Mühendislik ve Donanım Çözümleri",
          en: "Engineering & Hardware Solutions",
        },
        content: {
          tr: "Torsiyon yay hesaplama motoru, 1.400'den fazla donanım bileşeni ve modern otomasyon çözümleri ile tüm ihtiyaçlarınız tek platformda.",
          en: "Torsion spring calculation engine, over 1,400 hardware components, and modern automation solutions on a single platform.",
        },
        badge: {
          tr: "Profesyonel Kapı Çözümleri",
          en: "Professional Door Solutions",
        },
        buttonText: {
          tr: "Yay Hesaplama Motoru",
          en: "Spring Calculator Engine",
        },
        buttonLink: "/calculation",
        visible: true,
        order: 1,
      },
      {
        id: "features",
        type: "features",
        title: {
          tr: "Neden KUTEMS?",
          en: "Why KUTEMS?",
        },
        subtitle: {
          tr: "Üstün Mühendislik ve Hızlı Tedarik",
          en: "Superior Engineering & Rapid Supply",
        },
        content: {
          tr: "KUTEMS, endüstri standardı kalitede donanım ve hassas hesaplama araçları sunar.",
          en: "KUTEMS delivers industry-standard quality hardware and precision calculation tools.",
        },
        visible: true,
        order: 2,
      },
      {
        id: "cta",
        type: "cta",
        title: {
          tr: "Projeniz için Özel Çözüm mü Arıyorsunuz?",
          en: "Looking for a Custom Solution for Your Project?",
        },
        subtitle: {
          tr: "Uzman mühendislik ekibimiz ile iletişime geçin.",
          en: "Get in touch with our expert engineering team.",
        },
        buttonText: {
          tr: "Teklif Al / İletişime Geç",
          en: "Request a Quote / Contact Us",
        },
        buttonLink: "/contact",
        visible: true,
        order: 3,
      },
    ],
    seo: {
      title: {
        tr: "KUTEMS – Kapı Donanımı & Otomasyon",
        en: "KUTEMS – Door Hardware & Automation",
      },
      description: {
        tr: "Seksiyonel kapı donanımları, yay hesaplama ve otomasyon çözümleri.",
        en: "Sectional door hardware, spring calculations, and automation solutions.",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  hardware: {
    id: "hardware",
    pageKey: "hardware",
    route: "/hardware",
    title: {
      tr: "Donanım Kataloğu",
      en: "Hardware Catalog",
    },
    description: {
      tr: "1.348'den fazla yüksek kaliteli seksiyonel kapı donanım bileşeni.",
      en: "Over 1,348 high quality sectional door hardware components.",
    },
    published: true,
    sections: [
      {
        id: "hero",
        type: "banner",
        title: {
          tr: "Endüstri Standardı Kapı Donanımları",
          en: "Industry Standard Door Hardware",
        },
        content: {
          tr: "Makaralar, tamburlar, yaylar, profiller ve güvenlik aksesuarları.",
          en: "Rollers, drums, springs, profiles and safety accessories.",
        },
        visible: true,
        order: 1,
      },
    ],
    seo: {
      title: {
        tr: "Donanım Kataloğu | KUTEMS",
        en: "Hardware Catalog | KUTEMS",
      },
      description: {
        tr: "KUTEMS seksiyonel kapı donanım ürünleri.",
        en: "KUTEMS sectional door hardware products.",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  automation: {
    id: "automation",
    pageKey: "automation",
    route: "/automation",
    title: {
      tr: "Otomasyon Sistemleri",
      en: "Automation Systems",
    },
    description: {
      tr: "Endüstriyel ve konut tipi seksiyonel kapı motorları ve kontrol üniteleri.",
      en: "Industrial and residential sectional door drives and control units.",
    },
    published: true,
    sections: [
      {
        id: "hero",
        type: "banner",
        title: {
          tr: "Güvenilir ve Güçlü Otomasyon",
          en: "Reliable and Powerful Automation",
        },
        content: {
          tr: "Şaft motorları, kontrol panelleri ve uzaktan kumanda sistemleri.",
          en: "Shaft motors, control panels and remote access systems.",
        },
        visible: true,
        order: 1,
      },
    ],
    seo: {
      title: {
        tr: "Otomasyon Sistemleri | KUTEMS",
        en: "Automation Systems | KUTEMS",
      },
      description: {
        tr: "KUTEMS seksiyonel kapı otomasyon çözümleri.",
        en: "KUTEMS sectional door automation solutions.",
      },
    },
    updatedAt: new Date().toISOString(),
  },
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: "global",
  siteName: "KUTEMS",
  logoUrl: "/images/logo.png",
  defaultLanguage: "tr",
  contact: {
    phone: "+90 (212) 555 01 23",
    email: "info@kutems.com.tr",
    address: "İkitelli Organize Sanayi Bölgesi, Metal İş Sanayi Sitesi, İstanbul, Türkiye",
  },
  social: {
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
  },
  header: {
    navItems: [
      {
        key: "calculation",
        label: { tr: "Yay Hesaplama", en: "Spring Calculation" },
        href: "/calculation",
        visible: true,
        order: 1,
      },
      {
        key: "hardware",
        label: { tr: "Donanım Kataloğu", en: "Hardware Catalog" },
        href: "/hardware",
        visible: true,
        order: 2,
      },
      {
        key: "automation",
        label: { tr: "Otomasyon", en: "Automation" },
        href: "/automation",
        visible: true,
        order: 3,
      },
    ],
    ctaText: { tr: "Teklif Al", en: "Get a Quote" },
    ctaHref: "#inquiry",
  },
  footer: {
    title: {
      tr: "KUTEMS Endüstriyel Kapı Sistemleri",
      en: "KUTEMS Industrial Door Systems",
    },
    description: {
      tr: "Seksiyonel kapı donanımları, yay hesaplama motoru ve otomasyon teknolojilerinde öncü çözüm ortağınız.",
      en: "Your pioneering solution partner in sectional door hardware, spring calculations and automation technologies.",
    },
    copyright: {
      tr: "© 2026 KUTEMS. Tüm hakları saklıdır.",
      en: "© 2026 KUTEMS. All rights reserved.",
    },
  },
  seo: {
    defaultTitle: {
      tr: "KUTEMS – Seksiyonel Kapı Yay Hesaplama & Donanım Kataloğu",
      en: "KUTEMS – Sectional Door Spring Calculator & Hardware Catalog",
    },
    defaultDescription: {
      tr: "Torsiyon yay hesaplama, kapı donanım kataloğu ve otomasyon sistemleri.",
      en: "Torsion spring calculation, door hardware catalog and automation systems.",
    },
  },
  updatedAt: new Date().toISOString(),
};

/**
 * Fetch a CMS page by key. Returns Firestore version or default fallback.
 */
export async function getPageContent(pageKey: string): Promise<SitePage> {
  try {
    const snap = await getDoc(doc(db, "site_pages", pageKey));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as SitePage;
    }
  } catch (err) {
    console.warn(`[getPageContent] Falling back to default page for '${pageKey}':`, err);
  }
  return DEFAULT_SITE_PAGES[pageKey] || {
    id: pageKey,
    pageKey,
    route: `/${pageKey}`,
    title: { tr: pageKey, en: pageKey },
    description: { tr: "", en: "" },
    published: true,
    sections: [],
    seo: { title: { tr: pageKey, en: pageKey }, description: { tr: "", en: "" } },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * List all CMS pages
 */
export async function getAllPages(): Promise<SitePage[]> {
  try {
    const snap = await getDocs(collection(db, "site_pages"));
    if (!snap.empty) {
      return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SitePage));
    }
  } catch (err) {
    console.warn("[getAllPages] Error fetching from Firestore:", err);
  }
  return Object.values(DEFAULT_SITE_PAGES);
}

/**
 * Save page content to Firestore
 */
export async function savePageContent(
  page: Partial<SitePage> & { pageKey: string },
  publish = true
): Promise<void> {
  const pageKey = page.pageKey;
  const ref = doc(db, "site_pages", pageKey);
  const payload = {
    ...page,
    published: publish,
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, payload, { merge: true });
}

/**
 * Get global site settings
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const snap = await getDoc(doc(db, "site_settings", "global"));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as SiteSettings;
    }
  } catch (err) {
    console.warn("[getSiteSettings] Error fetching settings:", err);
  }
  return DEFAULT_SITE_SETTINGS;
}

/**
 * Save site settings
 */
export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const ref = doc(db, "site_settings", "global");
  const payload = {
    ...settings,
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, payload, { merge: true });
}
