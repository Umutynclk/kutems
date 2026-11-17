/**
 * src/types/cms.ts
 * Type definitions for KUTEMS CMS, Customer Requests, and Admin Audit
 */

export interface MultilingualText {
  tr: string;
  en: string;
}

export type CmsSectionType =
  | "hero"
  | "features"
  | "highlights"
  | "cta"
  | "text"
  | "banner"
  | "contact_info";

export interface CmsSection {
  id: string;
  type: CmsSectionType;
  title: MultilingualText;
  subtitle?: MultilingualText;
  content?: MultilingualText;
  buttonText?: MultilingualText;
  buttonLink?: string;
  imageUrl?: string;
  imageAlt?: MultilingualText;
  badge?: MultilingualText;
  visible: boolean;
  order: number;
}

export interface SitePage {
  id: string;
  pageKey: string; // 'home' | 'hardware' | 'automation' | 'contact' etc.
  route: string;
  title: MultilingualText;
  description: MultilingualText;
  published: boolean;
  sections: CmsSection[];
  seo: {
    title: MultilingualText;
    description: MultilingualText;
    keywords?: string[];
  };
  updatedAt: any;
  updatedBy?: string;
}

export interface NavItem {
  key: string;
  label: MultilingualText;
  href: string;
  visible: boolean;
  order: number;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  logoUrl?: string;
  defaultLanguage: "tr" | "en";
  contact: {
    phone: string;
    email: string;
    address: string;
    mapUrl?: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  header: {
    navItems: NavItem[];
    ctaText: MultilingualText;
    ctaHref: string;
  };
  footer: {
    title: MultilingualText;
    description: MultilingualText;
    copyright: MultilingualText;
  };
  seo: {
    defaultTitle: MultilingualText;
    defaultDescription: MultilingualText;
  };
  updatedAt: any;
}

export type RequestType = "product_inquiry" | "quote" | "contact" | "other";

export type RequestStatus = "new" | "in_review" | "responded" | "closed" | "spam";

export interface CustomerRequest {
  id: string;
  requestId: string;
  requestType: RequestType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  productId?: string;
  productCode?: string;
  articleNumber?: string;
  productName?: string;
  sourcePage?: string;
  locale: "tr" | "en";
  status: RequestStatus;
  internalNotes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface AdminAuditLog {
  id?: string;
  logId: string;
  adminUid: string;
  adminEmail?: string;
  action: string;
  entityType: "product" | "category" | "page" | "settings" | "request";
  entityId: string;
  details?: string;
  createdAt: any;
}
