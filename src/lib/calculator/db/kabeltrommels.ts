export interface FFKabeltrommel {
  type: string;
  asDiameter: number; // 0 = 1" (25.4mm), 1 = 1.25" (31.75mm)
  soort: number; // 0 = Normal Lift, 1 = High Lift, 2 = Vertical Lift
  volgorde: number;
  maxGewicht: number; // kg
  maxHilift: number; // mm
  maxKabeldikte: number; // mm
  maxHoogte: number; // mm
  liftArmHiMoment: number;
  liftArmFlatMoment: number;
  omtrekVlak: number; // mm (2 * pi * r)
  kabelCorrectie: number; // mm
  treksetCorrectie: number; // mm
  flangeDiameter: number; // mm
  detailTabelNummer: number; // 0 = flat, >0 = spiral curve
}

export const FF_KABELTROMMELS: FFKabeltrommel[] = [
  { type: "FF-54LC", asDiameter: 0, soort: 1, volgorde: 1, maxGewicht: 240, maxHilift: 1260, maxKabeldikte: 3.0, maxHoogte: 3050, liftArmHiMoment: 0, liftArmFlatMoment: 52.4, omtrekVlak: 328.93, kabelCorrectie: 1600, treksetCorrectie: 0, flangeDiameter: 147, detailTabelNummer: 4 },
  { type: "FF-4X8", asDiameter: 0, soort: 0, volgorde: 1, maxGewicht: 240, maxHilift: 0, maxKabeldikte: 3.0, maxHoogte: 2440, liftArmHiMoment: 58.19, liftArmFlatMoment: 52.78, omtrekVlak: 331.622, kabelCorrectie: 571, treksetCorrectie: 780, flangeDiameter: 126, detailTabelNummer: 0 },
  { type: "FF-NL-10", asDiameter: 0, soort: 0, volgorde: 1, maxGewicht: 100, maxHilift: 0, maxKabeldikte: 3.0, maxHoogte: 2628, liftArmHiMoment: 39.5, liftArmFlatMoment: 39.5, omtrekVlak: 248.0, kabelCorrectie: 650, treksetCorrectie: 250, flangeDiameter: 86, detailTabelNummer: 0 },
  { type: "FF05NL12", asDiameter: 0, soort: 0, volgorde: 2, maxGewicht: 340, maxHilift: 0, maxKabeldikte: 4.0, maxHoogte: 3730, liftArmHiMoment: 58.19, liftArmFlatMoment: 52.78, omtrekVlak: 331.622, kabelCorrectie: 605, treksetCorrectie: 250, flangeDiameter: 124, detailTabelNummer: 0 },
  { type: "FF-NL-12", asDiameter: 0, soort: 0, volgorde: 2, maxGewicht: 500, maxHilift: 0, maxKabeldikte: 5.0, maxHoogte: 3680, liftArmHiMoment: 58.19, liftArmFlatMoment: 52.78, omtrekVlak: 331.622, kabelCorrectie: 1165, treksetCorrectie: 250, flangeDiameter: 124, detailTabelNummer: 0 },
  { type: "FF05NL18", asDiameter: 0, soort: 0, volgorde: 3, maxGewicht: 500, maxHilift: 0, maxKabeldikte: 4.0, maxHoogte: 5510, liftArmHiMoment: 74.6, liftArmFlatMoment: 69.06, omtrekVlak: 433.832, kabelCorrectie: 673, treksetCorrectie: 330, flangeDiameter: 152, detailTabelNummer: 0 },
  { type: "FF-NL-18", asDiameter: 0, soort: 0, volgorde: 3, maxGewicht: 500, maxHilift: 0, maxKabeldikte: 5.0, maxHoogte: 5570, liftArmHiMoment: 74.6, liftArmFlatMoment: 69.06, omtrekVlak: 433.832, kabelCorrectie: 1380, treksetCorrectie: 330, flangeDiameter: 152, detailTabelNummer: 0 },
  { type: "FF05NL32", asDiameter: 0, soort: 0, volgorde: 4, maxGewicht: 900, maxHilift: 0, maxKabeldikte: 6.0, maxHoogte: 9750, liftArmHiMoment: 109.54, liftArmFlatMoment: 104.78, omtrekVlak: 658.368, kabelCorrectie: 874, treksetCorrectie: 780, flangeDiameter: 229, detailTabelNummer: 0 },
  { type: "FF-NL-32", asDiameter: 0, soort: 0, volgorde: 4, maxGewicht: 700, maxHilift: 0, maxKabeldikte: 6.0, maxHoogte: 10000, liftArmHiMoment: 109.54, liftArmFlatMoment: 104.78, omtrekVlak: 658.368, kabelCorrectie: 1905, treksetCorrectie: 780, flangeDiameter: 229, detailTabelNummer: 0 },
  { type: "FF05NL32-125", asDiameter: 1, soort: 0, volgorde: 4, maxGewicht: 900, maxHilift: 0, maxKabeldikte: 6.0, maxHoogte: 9750, liftArmHiMoment: 109.54, liftArmFlatMoment: 104.78, omtrekVlak: 658.368, kabelCorrectie: 874, treksetCorrectie: 780, flangeDiameter: 229, detailTabelNummer: 0 },
  { type: "FF-NL-32-5/4", asDiameter: 1, soort: 0, volgorde: 4, maxGewicht: 700, maxHilift: 0, maxKabeldikte: 6.0, maxHoogte: 10000, liftArmHiMoment: 109.54, liftArmFlatMoment: 104.78, omtrekVlak: 658.368, kabelCorrectie: 1905, treksetCorrectie: 780, flangeDiameter: 229, detailTabelNummer: 0 },
  // High Lift
  { type: "FF05HL54", asDiameter: 0, soort: 1, volgorde: 2, maxGewicht: 455, maxHilift: 1370, maxKabeldikte: 4.0, maxHoogte: 4720, liftArmHiMoment: 0, liftArmFlatMoment: 69.04, omtrekVlak: 433.832, kabelCorrectie: 1835, treksetCorrectie: 0, flangeDiameter: 188, detailTabelNummer: 1 },
  { type: "FF-HL-54", asDiameter: 0, soort: 1, volgorde: 2, maxGewicht: 500, maxHilift: 1370, maxKabeldikte: 5.0, maxHoogte: 4800, liftArmHiMoment: 0, liftArmFlatMoment: 69.04, omtrekVlak: 433.832, kabelCorrectie: 2690, treksetCorrectie: 0, flangeDiameter: 188, detailTabelNummer: 1 },
  { type: "FF05HL120", asDiameter: 0, soort: 1, volgorde: 3, maxGewicht: 455, maxHilift: 3010, maxKabeldikte: 4.0, maxHoogte: 4720, liftArmHiMoment: 0, liftArmFlatMoment: 75.39, omtrekVlak: 473.71, kabelCorrectie: 3688, treksetCorrectie: 0, flangeDiameter: 238, detailTabelNummer: 2 },
  { type: "FF-HL-120", asDiameter: 0, soort: 1, volgorde: 3, maxGewicht: 500, maxHilift: 3050, maxKabeldikte: 5.0, maxHoogte: 4800, liftArmHiMoment: 0, liftArmFlatMoment: 75.39, omtrekVlak: 473.71, kabelCorrectie: 4830, treksetCorrectie: 0, flangeDiameter: 238, detailTabelNummer: 2 },
  { type: "FF05HL164", asDiameter: 0, soort: 1, volgorde: 4, maxGewicht: 900, maxHilift: 4110, maxKabeldikte: 6.0, maxHoogte: 6000, liftArmHiMoment: 0, liftArmFlatMoment: 84.15, omtrekVlak: 528.65, kabelCorrectie: 4952, treksetCorrectie: 0, flangeDiameter: 279, detailTabelNummer: 3 },
  { type: "FF-HL-164", asDiameter: 0, soort: 1, volgorde: 4, maxGewicht: 650, maxHilift: 4100, maxKabeldikte: 6.0, maxHoogte: 6000, liftArmHiMoment: 0, liftArmFlatMoment: 84.15, omtrekVlak: 528.65, kabelCorrectie: 6205, treksetCorrectie: 0, flangeDiameter: 279, detailTabelNummer: 3 },
  { type: "FF05HL164-125", asDiameter: 1, soort: 1, volgorde: 4, maxGewicht: 900, maxHilift: 4110, maxKabeldikte: 6.0, maxHoogte: 6000, liftArmHiMoment: 0, liftArmFlatMoment: 84.15, omtrekVlak: 528.65, kabelCorrectie: 4952, treksetCorrectie: 0, flangeDiameter: 279, detailTabelNummer: 3 },
  { type: "FF-HL-164-5/4", asDiameter: 1, soort: 1, volgorde: 4, maxGewicht: 650, maxHilift: 4100, maxKabeldikte: 6.0, maxHoogte: 6000, liftArmHiMoment: 0, liftArmFlatMoment: 84.15, omtrekVlak: 528.65, kabelCorrectie: 6205, treksetCorrectie: 0, flangeDiameter: 279, detailTabelNummer: 3 },
  // Vertical Lift
  { type: "FF05VL11", asDiameter: 0, soort: 2, volgorde: 1, maxGewicht: 385, maxHilift: 0, maxKabeldikte: 4.0, maxHoogte: 3290, liftArmHiMoment: 0, liftArmFlatMoment: 0, omtrekVlak: 0, kabelCorrectie: 3908, treksetCorrectie: 0, flangeDiameter: 218, detailTabelNummer: 9 },
  { type: "FF-VL-11", asDiameter: 0, soort: 2, volgorde: 1, maxGewicht: 500, maxHilift: 0, maxKabeldikte: 5.0, maxHoogte: 3300, liftArmHiMoment: 0, liftArmFlatMoment: 0, omtrekVlak: 0, kabelCorrectie: 4895, treksetCorrectie: 0, flangeDiameter: 218, detailTabelNummer: 9 },
  { type: "FF05VL18", asDiameter: 0, soort: 2, volgorde: 2, maxGewicht: 500, maxHilift: 0, maxKabeldikte: 4.0, maxHoogte: 5585, liftArmHiMoment: 0, liftArmFlatMoment: 0, omtrekVlak: 0, kabelCorrectie: 6263, treksetCorrectie: 0, flangeDiameter: 284, detailTabelNummer: 9 },
  { type: "FF-VL-18", asDiameter: 0, soort: 2, volgorde: 2, maxGewicht: 500, maxHilift: 0, maxKabeldikte: 5.0, maxHoogte: 6000, liftArmHiMoment: 0, liftArmFlatMoment: 0, omtrekVlak: 0, kabelCorrectie: 8105, treksetCorrectie: 0, flangeDiameter: 284, detailTabelNummer: 9 },
  { type: "FF05VL18-125", asDiameter: 1, soort: 2, volgorde: 2, maxGewicht: 500, maxHilift: 0, maxKabeldikte: 4.0, maxHoogte: 5585, liftArmHiMoment: 0, liftArmFlatMoment: 0, omtrekVlak: 0, kabelCorrectie: 6263, treksetCorrectie: 0, flangeDiameter: 284, detailTabelNummer: 9 },
  { type: "FF-VL-18-5/4", asDiameter: 1, soort: 2, volgorde: 2, maxGewicht: 500, maxHilift: 0, maxKabeldikte: 5.0, maxHoogte: 6000, liftArmHiMoment: 0, liftArmFlatMoment: 0, omtrekVlak: 0, kabelCorrectie: 8105, treksetCorrectie: 0, flangeDiameter: 284, detailTabelNummer: 9 },
  { type: "FF-VL-28", asDiameter: 0, soort: 2, volgorde: 3, maxGewicht: 825, maxHilift: 0, maxKabeldikte: 6.0, maxHoogte: 7000, liftArmHiMoment: 0, liftArmFlatMoment: 0, omtrekVlak: 0, kabelCorrectie: 8950, treksetCorrectie: 0, flangeDiameter: 360, detailTabelNummer: 9 },
  { type: "FF-VL-28-5/4", asDiameter: 1, soort: 2, volgorde: 3, maxGewicht: 825, maxHilift: 0, maxKabeldikte: 6.0, maxHoogte: 7000, liftArmHiMoment: 0, liftArmFlatMoment: 0, omtrekVlak: 0, kabelCorrectie: 8950, treksetCorrectie: 0, flangeDiameter: 360, detailTabelNummer: 9 },
];
