import { ProductCategory } from "@/types/catalog";

export const MOCK_HARDWARE_CATEGORIES: ProductCategory[] = [
  {
    id: "cat-springs",
    slug: "spring-systems",
    name: {
      tr: "Torsiyon Yay Sistemleri & Aksesuarları",
      en: "Torsion Spring Systems & Accessories",
    },
    description: {
      tr: "Yüksek dayanımlı yay telleri, yay tamburları, yay kilitleri ve yay germe aparatları.",
      en: "High-tensile spring wire, spring fittings, spring break devices, and tensioning tools.",
    },
    type: "hardware",
    productCount: 18,
    order: 1,
  },
  {
    id: "cat-tracks",
    slug: "track-systems",
    name: {
      tr: "Ray Profilleri & Kılavuz Sistemleri",
      en: "Track Profiles & Guiding Systems",
    },
    description: {
      tr: "Normal lift, low headroom ve high lift dikey ve yatay ray setleri ve bağlantı konsolları.",
      en: "Vertical and horizontal tracks for normal lift, low headroom, and high lift systems.",
    },
    type: "hardware",
    productCount: 14,
    order: 2,
  },
  {
    id: "cat-shafts",
    slug: "shafts-drums",
    name: {
      tr: "Mil & Halat Tamburları",
      en: "Shafts, Couplers & Cable Drums",
    },
    description: {
      tr: "1 inç ve 1.25 inç dolu/kamalı miller, alüminyum döküm tamburlar ve mil kaplinleri.",
      en: "1\" and 1.25\" solid or hollow keyway shafts, cast aluminum cable drums, and shaft couplings.",
    },
    type: "hardware",
    productCount: 12,
    order: 3,
  },
  {
    id: "cat-rollers",
    slug: "rollers-hinges",
    name: {
      tr: "Menteşeler, Tekerlekler & Yan Tutucular",
      en: "Hinges, Rollers & Side Brackets",
    },
    description: {
      tr: "Ağır hizmet rulmanlı tekerlekler, galvanizli orta ve yan menteşeler, ayarlı kılavuzlar.",
      en: "Heavy-duty ball-bearing rollers, galvanized center and side hinges, adjustable brackets.",
    },
    type: "hardware",
    productCount: 16,
    order: 4,
  },
  {
    id: "cat-seals",
    slug: "seals-profiles",
    name: {
      tr: "EPDM Fitiller & Alüminyum Profiller",
      en: "EPDM Seals & Aluminum Bottom Profiles",
    },
    description: {
      tr: "Alt, üst ve yan sızdırmazlık EPDM contaları, takviyeli taşıyıcı alüminyum profiller.",
      en: "Bottom, top and side EPDM weather seals, structural aluminum reinforced profiles.",
    },
    type: "hardware",
    productCount: 9,
    order: 5,
  },
];

export const MOCK_AUTOMATION_CATEGORIES: ProductCategory[] = [
  {
    id: "cat-auto-industrial",
    slug: "industrial-operators",
    name: {
      tr: "Endüstriyel Şaft Motorları",
      en: "Industrial Shaft Operators",
    },
    description: {
      tr: "Yoğun kullanıma uygun üç fazlı ve monofaze zincirli şaft tahrik motorları.",
      en: "Three-phase and single-phase direct drive shaft operators for heavy industrial doors.",
    },
    type: "automation",
    productCount: 8,
    order: 1,
  },
  {
    id: "cat-auto-residential",
    slug: "garage-openers",
    name: {
      tr: "Garaj Kapısı Motorları & Rayları",
      en: "Garage Door Openers & Rails",
    },
    description: {
      tr: "Sessiz kayışlı ve zincirli konut tipi tavan garaj kapısı motor paketleri.",
      en: "Ultra-quiet belt and chain drive residential overhead garage door automation kits.",
    },
    type: "automation",
    productCount: 6,
    order: 2,
  },
  {
    id: "cat-auto-control",
    slug: "control-units",
    name: {
      tr: "Elektronik Kontrol Panelleri & Aksesuarlar",
      en: "Electronic Control Boards & Safety",
    },
    description: {
      tr: "Mikroişlemcili panolar, optik güvenlik kenarları, reflektörlü emniyet fotoselleri.",
      en: "Microprocessor control units, optical safety edges, and wireless safety receivers.",
    },
    type: "automation",
    productCount: 11,
    order: 3,
  },
];
