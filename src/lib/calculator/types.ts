export type TrackSystem =
  | "Normal Lift"
  | "Low Head Room"
  | "High Lift"
  | "Vertical Lift"
  | "Follow Roof NS"
  | "Follow Roof LHR"
  | "Follow Roof HL";

export type DrumSpecification = "Automatic" | "Specific";
export type DrumModel = "FFNL13" | "FFNL18" | "FFNL32" | "FF05NL32" | "FF05NL32-0.5" | "FFHL10" | "FFVL11";
export type HeightBottomSection = "500 mm" | "610 mm";
export type ShaftDiameter = "Shaft 1\" (25.4 mm)" | "Shaft 1.25\" (31.75 mm)";
export type SpringFinish = "Black" | "Galvanised" | "Powder coated";
export type SpringTypeConfig = "Simplex Identical" | "Identical & Dummy" | "Duplex Identical";
export type CableType = "KUTEMS 6x19 PP" | "KUTEMS 7x19 F" | "Other cable";
export type CableDiameter = "4 mm" | "5 mm";
export type CableTensionSet = "No" | "Yes";

export type CalculationInput = {
  trackSystem: TrackSystem;
  doorWidth: number; // in mm
  doorHeight: number; // in mm
  highLiftSize?: number; // in mm (if High Lift)
  bottomSection?: number; // 500 or 610 mm (default 610)
  calcWeight: number; // kg/m2 (default 12)
  totalDoorWeight: number; // kg (auto-calculated from W*H*calcWeight)
  torsionSprings: number; // 1, 2, 3, 4 (default 2)
  springFinish: SpringFinish; // Powder coated / Galvanised / Black
  minCycles: number; // 10000, 15000, 20000, 25000, 50000, 75000, 100000
  springTypes?: SpringTypeConfig;
  numberOfTurns?: number; // auto-calculated
  drum?: DrumModel; // auto-selected
  shaftDiameter?: ShaftDiameter; // auto-selected
  cableLength?: number; // auto-calculated
  cableMaxLoad?: number; // auto-calculated
};

export type SpringSolution = {
  solutionNumber: number;
  drum: string;
  drumTurns: number;
  springCycles: number;
  wireDiameter: number; // mm (e.g. 8.50, 9.00)
  outerDiameter: number; // mm (e.g. 95, 102, 152)
  innerDiameter: number; // mm
  springLength: number; // mm (e.g. 1390)
  activeCoils: number;
  torquePerTurn: number; // Nmm/Turn (e.g. 8593)
  quantity: number; // 1x, 2x
  direction: "LW" | "RW" | "LW + RW";
  m: number; // Mass in kg
  d: number; // Diameter code
  productCode: string;
  springFinish: string;
  shaftDiameter: string;
  maxStress: string;
  notes?: string;
};

export type CalculationResult = {
  calculatedAt: string;
  inputSummary: {
    doorWidth: number;
    doorHeight: number;
    totalDoorWeight: number;
    openDoorWeight: number;
    trackSystem: string;
    numberOfTurns: number;
  };
  totalDoorWeight: number;
  openDoorWeight: number;
  numberOfTurns: number;
  torqueTotal: number; // Nmm
  torquePerSpring: number; // Nmm
  cableLengthRequired: number; // mm
  cableSafetyFactor: number;
  solutions: SpringSolution[];
};
