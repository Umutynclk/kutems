export type MultilingualText = {
  tr: string;
  en: string;
};

export type ProductCategory = {
  id: string;
  slug: string;
  name: MultilingualText;
  description: MultilingualText;
  icon?: string;
  image?: string;
  type: "hardware" | "automation";
  productCount?: number;
  order: number;
  subcategories?: ProductSubcategory[];
};

export type ProductSubcategory = {
  id: string;
  categoryId: string;
  slug: string;
  name: MultilingualText;
  order: number;
};

export type TechnicalSpecification = {
  key: MultilingualText;
  value: MultilingualText | string;
};

export type Product = {
  id: string;
  type: "hardware" | "automation";
  categoryId: string;
  subcategoryId?: string;
  slug: string;
  productCode: string;
  articleNumber?: string;
  name: MultilingualText;
  shortDescription: MultilingualText;
  description: MultilingualText;
  images: string[];
  specifications: TechnicalSpecification[];
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
    diameter?: string;
    thickness?: string;
    weight?: string;
  };
  materials?: MultilingualText;
  compatibleProducts?: {
    code: string;
    name: MultilingualText;
    slug: string;
  }[];
  downloads?: {
    title: MultilingualText;
    type: "pdf" | "cad" | "manual";
    url: string;
    fileSize?: string;
  }[];
  featured?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
