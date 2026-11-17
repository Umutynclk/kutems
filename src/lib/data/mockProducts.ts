import { Product } from "@/types/catalog";

export const MOCK_PRODUCTS: Product[] = [
  // 1. Torsion Spring
  {
    id: "prod-hw-01",
    type: "hardware",
    categoryId: "cat-springs",
    slug: "torsion-spring-850-95",
    productCode: "SP-850-95-1390-PW",
    name: {
      tr: "Torsiyon Yayı Ø8.50mm / Dış Çap 95mm",
      en: "Torsion Spring Ø8.50mm / Outer Ø 95mm",
    },
    shortDescription: {
      tr: "Toz boyalı, yüksek yorulma dirençli EN 10270-2 sınıfı çelik torsiyon yay.",
      en: "Powder coated, high fatigue resistant EN 10270-2 grade steel torsion spring.",
    },
    description: {
      tr: "Endüstriyel ve konut seksiyonel kapı sistemlerinde tork dengelemesi için özel olarak üretilmiştir. Yüksek korozyon dayanımı sağlayan elektrostatik toz boya kaplama ile uzun çevrim ömrü garanti edilir. Standart 1 inç ve 1.25 inç miller ile uyumlu yay tıkaçları ile birlikte kullanılır.",
      en: "Precision engineered for counterbalancing industrial and residential sectional overhead doors. Coated with electrostatic powder paint for enhanced corrosion resistance and extended cycle lifetime. Compatible with standard 1\" and 1.25\" shaft spring fittings.",
    },
    images: [
      "/images/products/spring-main.svg",
      "/images/products/spring-detail.svg",
    ],
    specifications: [
      { key: { tr: "Tel Çapı", en: "Wire Diameter" }, value: "8.50 mm" },
      { key: { tr: "Dış Çap", en: "Outer Diameter" }, value: "95 mm" },
      { key: { tr: "İç Çap", en: "Inner Diameter" }, value: "78 mm" },
      { key: { tr: "Standart Uzunluk", en: "Standard Length" }, value: "1390 mm" },
      { key: { tr: "Yüzey Kaplama", en: "Finish" }, value: { tr: "Elektrostatik Toz Boya", en: "Powder Coated" } },
      { key: { tr: "Standart", en: "Norm / Standard" }, value: "EN 10270-2 FD" },
      { key: { tr: "Min. Çevrim Ömrü", en: "Min. Lifetime" }, value: "25,000 Cycles" },
    ],
    dimensions: {
      length: "1390 mm",
      diameter: "95 mm",
      weight: "12.4 kg",
      thickness: "8.50 mm",
    },
    materials: {
      tr: "Yağda sertleştirilmiş yüksek karbonlu yay çeliği (Oil tempered spring steel)",
      en: "Oil-tempered high carbon spring steel with corrosion-resistant finish",
    },
    compatibleProducts: [
      { code: "FF-PLUG-95-1", name: { tr: "Yay Tıkacı 95mm (1 inç)", en: "Spring Plug 95mm (1 inch)" }, slug: "spring-plug-95-1" },
      { code: "FF-SBD-67", name: { tr: "Yay Kırılma Emniyet Cihazı", en: "Spring Break Device" }, slug: "spring-break-device-67" },
    ],
    downloads: [
      { title: { tr: "Teknik Çizim & Veri Sayfası (PDF)", en: "Technical Datasheet & CAD (PDF)" }, type: "pdf", url: "#", fileSize: "1.4 MB" },
      { title: { tr: "Montaj ve Kurulum Kılavuzu", en: "Installation & Safety Manual" }, type: "manual", url: "#", fileSize: "2.1 MB" },
    ],
    featured: true,
    active: true,
    createdAt: "2026-01-10T10:00:00Z",
    updatedAt: "2026-02-15T12:00:00Z",
  },

  // 2. Cable Drum FFNL18
  {
    id: "prod-hw-02",
    type: "hardware",
    categoryId: "cat-shafts",
    slug: "cable-drum-ffnl18",
    productCode: "FFNL18-STD",
    name: {
      tr: "Kablo / Halat Tamburu FFNL18 (Normal Lift)",
      en: "Cable Drum FFNL18 (Normal Lift)",
    },
    shortDescription: {
      tr: "Maksimum 5500mm kapı yüksekliği için hassas yivli alüminyum döküm tambur.",
      en: "Precision grooved cast aluminum cable drum for doors up to 5500mm height.",
    },
    description: {
      tr: "Normal Lift (NL) standart ray sistemine sahip seksiyonel kapılar için özel olarak dengelenmiş döküm alüminyum halat tamburu. 4mm ve 5mm çelik halatların düzgün sarılmasını sağlayarak aşınmayı minimize eder. Çift setskur cıvatasıyla mile mükemmel sabitlenir.",
      en: "High-grade die-cast aluminum cable drum designed for Normal Lift (NL) sectional doors. Precision grooves ensure smooth winding of 4mm and 5mm aircraft cables, reducing cable wear. Secured with heavy-duty set screws.",
    },
    images: [
      "/images/products/drum-main.svg",
      "/images/products/drum-detail.svg",
    ],
    specifications: [
      { key: { tr: "Ray Uyumu", en: "Track Compatibility" }, value: "Normal Lift (NL)" },
      { key: { tr: "Maks. Kapı Yüksekliği", en: "Max Door Height" }, value: "5500 mm" },
      { key: { tr: "Halat Çapı", en: "Cable Diameter" }, value: "4 mm - 5 mm" },
      { key: { tr: "Mil Çapı", en: "Shaft Diameter" }, value: "1\" (25.4 mm) / 1.25\" (31.75 mm)" },
      { key: { tr: "Maks. Halat Yükü", en: "Max Cable Load" }, value: "450 kg (Çift / Pair)" },
    ],
    dimensions: {
      diameter: "135 mm",
      width: "120 mm",
      weight: "1.85 kg",
    },
    materials: {
      tr: "Yüksek mukavemetli basınçlı döküm alüminyum alaşımı",
      en: "High tensile pressure die-cast aluminum alloy",
    },
    downloads: [
      { title: { tr: "Tambur Sarım Tablosu (PDF)", en: "Drum Winding Chart (PDF)" }, type: "pdf", url: "#", fileSize: "820 KB" },
    ],
    featured: true,
    active: true,
    createdAt: "2026-01-12T11:00:00Z",
    updatedAt: "2026-02-14T09:30:00Z",
  },

  // 3. Spring Break Device
  {
    id: "prod-hw-03",
    type: "hardware",
    categoryId: "cat-springs",
    slug: "spring-break-device-67",
    productCode: "FF-SBD-67-LWRW",
    name: {
      tr: "Yay Kırılma Emniyet Cihazı (SBD) 67mm/95mm",
      en: "Spring Break Safety Device (SBD) 67mm/95mm",
    },
    shortDescription: {
      tr: "EN 13241-1 uyumlu, yay kırılması anında mili kilitleyen güvenlik mekanizması.",
      en: "EN 13241-1 certified safety device that instantly locks shaft upon spring failure.",
    },
    description: {
      tr: "Torsiyon yayında kopma veya kırılma meydana geldiğinde milin kontrolsüz dönmesini anında durdurarak kapının düşmesini engelleyen emniyet fren sistemi. Entegre mikro şalter bağlantısı sayesinde motorlu sistemlerde enerjiyi anında keser.",
      en: "Safety parachute device preventing uncontrolled door drop in case of torsion spring failure. Mechanical pawl instantly locks into the ratchet ring. Includes optional micro-switch interface to cut operator power immediately.",
    },
    images: ["/images/products/sbd-main.svg"],
    specifications: [
      { key: { tr: "Sertifikasyon", en: "Certification" }, value: "EN 13241-1 / CE Approved" },
      { key: { tr: "Maks. Kapı Ağırlığı", en: "Max Door Weight" }, value: "500 kg" },
      { key: { tr: "Mil Uyumluluğu", en: "Shaft Compatibility" }, value: "1\" (25.4 mm)" },
      { key: { tr: "Kilit Tipi", en: "Lock Type" }, value: { tr: "Otomatik Mekanik Tırnak", en: "Automatic Mechanical Pawl" } },
    ],
    dimensions: {
      width: "140 mm",
      height: "175 mm",
      weight: "2.4 kg",
    },
    materials: {
      tr: "Galvaniz kaplı yüksek mukavemetli çelik gövde",
      en: "Galvanized heavy gauge structural steel housing",
    },
    downloads: [
      { title: { tr: "CE Uygunluk Belgesi (PDF)", en: "CE Declaration of Conformity (PDF)" }, type: "pdf", url: "#", fileSize: "1.1 MB" },
    ],
    featured: true,
    active: true,
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-02-10T14:00:00Z",
  },

  // 4. Roller & Hinge
  {
    id: "prod-hw-04",
    type: "hardware",
    categoryId: "cat-rollers",
    slug: "heavy-duty-nylon-roller-2inch",
    productCode: "FF-ROL-2N-120",
    name: {
      tr: "2 inç Rulmanlı Naylon Tekerlek (120mm Sap)",
      en: "2-inch Sealed Ball Bearing Nylon Roller (120mm Stem)",
    },
    shortDescription: {
      tr: "Sessiz çalışan, 6200ZZ çift contalı rulmanlı dayanıklı naylon tekerlek.",
      en: "Ultra-quiet nylon roller with 6200ZZ double sealed precision ball bearings.",
    },
    description: {
      tr: "Endüstriyel ve lüks konut kapılarında sürtünmesiz ve sessiz kayma performansı sağlar. 6200ZZ çelik rulman toza ve neme karşı tamamen kapalıdır. 120mm paslanmaz çinko kaplamalı sapıyla tüm standart yan menteşelere uyar.",
      en: "Engineered for whisper-quiet and low-friction door movement. Features industrial 6200ZZ sealed bearing resistant to dust and moisture. The 120mm zinc-plated stem fits all standard side hinges.",
    },
    images: ["/images/products/roller-main.svg"],
    specifications: [
      { key: { tr: "Tekerlek Çapı", en: "Roller Diameter" }, value: "46 mm (2\" Track)" },
      { key: { tr: "Sap Uzunluğu", en: "Stem Length" }, value: "120 mm" },
      { key: { tr: "Rulman Tipi", en: "Bearing Type" }, value: "6200ZZ Sealed" },
      { key: { tr: "Dinamik Yük Kapasitesi", en: "Dynamic Load" }, value: "65 kg / tekerlek" },
    ],
    dimensions: {
      length: "120 mm",
      diameter: "46 mm",
      weight: "0.22 kg",
    },
    materials: {
      tr: "Aşınmaya dayanıklı Poliamid (PA6) tekerlek ve çinko kaplı çelik sap",
      en: "Wear-resistant Polyamide (PA6) wheel and zinc-plated steel stem",
    },
    featured: false,
    active: true,
    createdAt: "2026-01-20T08:00:00Z",
    updatedAt: "2026-02-12T16:00:00Z",
  },

  // 5. Track Profile Set
  {
    id: "prod-hw-05",
    type: "hardware",
    categoryId: "cat-tracks",
    slug: "normal-lift-vertical-track-set",
    productCode: "FF-TRK-NL-2MM",
    name: {
      tr: "Normal Lift Dikey & Yatay Ray Seti (2.0mm)",
      en: "Normal Lift Vertical & Horizontal Track Set (2.0mm)",
    },
    shortDescription: {
      tr: "2.0mm sıcak daldırma galvanizli yüksek rijitlikli seksiyonel kapı rayı.",
      en: "2.0mm hot-dip galvanized high-rigidity sectional door track system.",
    },
    description: {
      tr: "EN 10346 normuna uygun sürekli galvaniz kaplamalı sacdan soğuk şekillendirme ile üretilmiştir. Özel büküm profili sayesinde tekerleklerin raydan çıkmasını engeller ve yüksek rüzgar yüklerinde deformasyonu önler.",
      en: "Manufactured from continuous hot-dip galvanized steel sheet according to EN 10346. The proprietary roll-formed profile prevents roller derailment and withstands substantial wind loads.",
    },
    images: ["/images/products/track-main.svg"],
    specifications: [
      { key: { tr: "Sac Kalınlığı", en: "Sheet Thickness" }, value: "2.0 mm" },
      { key: { tr: "Ray Genişliği", en: "Track Width" }, value: "2 inç (50.8 mm)" },
      { key: { tr: "Galvaniz Kaplama", en: "Coating" }, value: "Z275 Hot-dip Galvanized" },
      { key: { tr: "Boy Seçenekleri", en: "Length Options" }, value: "2500 mm - 6500 mm" },
    ],
    dimensions: {
      width: "52 mm",
      thickness: "2.0 mm",
      weight: "3.2 kg / metre",
    },
    materials: {
      tr: "DX51D+Z275 Yapısal Galvanizli Çelik",
      en: "DX51D+Z275 Structural Galvanized Steel",
    },
    featured: false,
    active: true,
    createdAt: "2026-01-25T14:00:00Z",
    updatedAt: "2026-02-18T10:00:00Z",
  },

  // Automation Products
  // 6. Industrial Shaft Operator FF-IND-100
  {
    id: "prod-auto-01",
    type: "automation",
    categoryId: "cat-auto-industrial",
    slug: "industrial-shaft-operator-100nm",
    productCode: "FF-IND-100-3P",
    name: {
      tr: "Endüstriyel Şaft Motoru 100Nm (Üç Faz / 400V)",
      en: "Industrial Shaft Operator 100Nm (Three Phase / 400V)",
    },
    shortDescription: {
      tr: "Yoğun trafikli endüstriyel seksiyonel kapılar için entegre zincirli şaft motoru.",
      en: "Heavy-duty direct drive shaft motor with integrated manual chain hoist.",
    },
    description: {
      tr: "Ağır sanayi, lojistik depoları ve yükleme rampaları için geliştirilmiş yüksek torklu şaft motoru. Dahili mekanik fren, acil durum manuel zincir çekme sistemi ve elektronik enkoder ile mutlak pozisyon kontrolü sunar.",
      en: "High-torque shaft motor designed for heavy industrial doors and logistics centers. Features built-in mechanical brake, emergency manual chain hoist, and absolute electronic encoder positioning.",
    },
    images: [
      "/images/products/motor-ind-main.svg",
      "/images/products/motor-ind-detail.svg",
    ],
    specifications: [
      { key: { tr: "Tork Kapasitesi", en: "Torque Capacity" }, value: "100 Nm" },
      { key: { tr: "Besleme Gerilimi", en: "Power Supply" }, value: "3x400V AC / 50Hz" },
      { key: { tr: "Çıkış Devri", en: "Output Speed" }, value: "24 RPM" },
      { key: { tr: "Koruma Sınıfı", en: "Protection Class" }, value: "IP65 (Su & Toz Geçirmez)" },
      { key: { tr: "Şaft Bağlantı Çapı", en: "Shaft Bore" }, value: "25.4 mm (1\") Keyway" },
      { key: { tr: "Çalışma Rejimi", en: "Duty Cycle" }, value: "ED 60% (S3)" },
    ],
    dimensions: {
      length: "380 mm",
      width: "220 mm",
      height: "150 mm",
      weight: "14.8 kg",
    },
    materials: {
      tr: "Döküm alüminyum gövde ve çelik dişli kutusu",
      en: "Die-cast aluminum housing and hardened steel gear transmission",
    },
    downloads: [
      { title: { tr: "Motor Kullanım & Bağlantı Kılavuzu (PDF)", en: "User & Wiring Manual (PDF)" }, type: "manual", url: "#", fileSize: "3.2 MB" },
      { title: { tr: "Teknik Çizim & Boyutlar (DXF/PDF)", en: "Technical Dimensions (PDF)" }, type: "pdf", url: "#", fileSize: "1.8 MB" },
    ],
    featured: true,
    active: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-20T11:00:00Z",
  },

  // 7. Residential Garage Door Opener
  {
    id: "prod-auto-02",
    type: "automation",
    categoryId: "cat-auto-residential",
    slug: "garage-door-opener-1000n",
    productCode: "FF-RES-1000-BL",
    name: {
      tr: "Kayışlı Garaj Kapısı Motoru 1000N (Sessiz Tip)",
      en: "Belt Drive Garage Door Opener 1000N (Whisper Quiet)",
    },
    shortDescription: {
      tr: "Entegre LED aydınlatmalı, soft-start/stop özellikli 24V DC garaj motoru.",
      en: "24V DC garage operator with integrated LED lighting and soft-start/stop.",
    },
    description: {
      tr: "Müstakil villa ve konut garaj kapıları için geliştirilmiş süper sessiz kayış tahrikli motor seti. Dahili 868 MHz alıcı, engel tanıma emniyet sistemi ve enerji tasarruflu standby modu ile maksimum konfor ve güvenlik sağlar.",
      en: "Ultra-quiet belt drive garage motor kit engineered for residential sectional doors. Built-in 868 MHz rolling-code receiver, obstacle detection safety sensor, and low-power standby mode for optimum energy efficiency.",
    },
    images: ["/images/products/motor-res-main.svg"],
    specifications: [
      { key: { tr: "Çekme Gücü", en: "Pulling Force" }, value: "1000 N" },
      { key: { tr: "Motor Gerilimi", en: "Motor Voltage" }, value: "24V DC Brushless" },
      { key: { tr: "Açılma Hızı", en: "Opening Speed" }, value: "20 cm/saniye" },
      { key: { tr: "Maks. Kapı Alanı", en: "Max Door Area" }, value: "14 m²" },
      { key: { tr: "Radyo Frekansı", en: "Radio Frequency" }, value: "868.35 MHz Rolling Code" },
    ],
    dimensions: {
      length: "3200 mm (Ray dahil)",
      width: "190 mm",
      height: "120 mm",
      weight: "9.5 kg",
    },
    materials: {
      tr: "Darbe dayanımlı ABS polimer gövde ve çelik takviyeli kauçuk kayış",
      en: "High-impact ABS polymer casing and steel-reinforced rubber belt",
    },
    downloads: [
      { title: { tr: "Hızlı Kurulum Kılavuzu (PDF)", en: "Quick Setup Guide (PDF)" }, type: "manual", url: "#", fileSize: "1.9 MB" },
    ],
    featured: true,
    active: true,
    createdAt: "2026-02-05T12:00:00Z",
    updatedAt: "2026-02-22T15:00:00Z",
  },

  // 8. Optical Safety Edge & Control Unit
  {
    id: "prod-auto-03",
    type: "automation",
    categoryId: "cat-auto-control",
    slug: "optical-safety-edge-kit",
    productCode: "FF-SEC-OSE-KIT",
    name: {
      tr: "Optik Alt Emniyet Fitili Kiti (OSE)",
      en: "Optical Safety Edge Kit (OSE)",
    },
    shortDescription: {
      tr: "Alt fitil içi kızılötesi ışın demeti ile EN 12978 uyumlu temassız emniyet.",
      en: "EN 12978 compliant infrared optical sensor kit inside bottom rubber seal.",
    },
    description: {
      tr: "Otomatik seksiyonel kapıların alt fitili içerisine yerleştirilen kızılötesi verici ve alıcı modüllerden oluşur. Kapının altında herhangi bir nesneye temas etmesi durumunda ışın kesilir ve motor anında ters yönde çalışarak kapıyı açar.",
      en: "Consists of infrared transmitter and receiver diodes placed inside the bottom profile rubber seal. Instantly halts and reverses motor direction when obstruction exerts pressure on the rubber, meeting EN 12978 standards.",
    },
    images: ["/images/products/safety-edge-main.svg"],
    specifications: [
      { key: { tr: "Algılama Aralığı", en: "Detection Range" }, value: "0.5m - 10.0m" },
      { key: { tr: "Besleme Voltajı", en: "Supply Voltage" }, value: "10-14V DC" },
      { key: { tr: "Sinyal Tipi", en: "Signal Type" }, value: "Dinamik Frekans (Dynamic Pulse)" },
      { key: { tr: "Koruma", en: "IP Rating" }, value: "IP67 Tam Su Geçirmez" },
    ],
    dimensions: {
      length: "35 mm",
      diameter: "12 mm (Sensör başlığı)",
      weight: "0.45 kg",
    },
    materials: {
      tr: "Poliüretan döküm su geçirmez sensör gövdesi ve spiral kablo",
      en: "Polyurethane cast waterproof sensor housing with coiled spiral cable",
    },
    featured: false,
    active: true,
    createdAt: "2026-02-10T09:00:00Z",
    updatedAt: "2026-02-25T17:00:00Z",
  },
];
