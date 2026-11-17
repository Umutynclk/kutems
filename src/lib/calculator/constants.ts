import {
  TrackSystem,
  DrumModel,
  HeightBottomSection,
  ShaftDiameter,
  SpringFinish,
  SpringTypeConfig,
  CableType,
  CableDiameter,
  CableTensionSet,
} from "./types";

export const TRACK_SYSTEMS: TrackSystem[] = [
  "Normal Lift",
  "Low Head Room",
  "High Lift",
  "Vertical Lift",
  "Follow Roof NS",
  "Follow Roof LHR",
  "Follow Roof HL",
];

export const HINGED_SECTIONS_OPTIONS = [8, 9, 10, 11] as const;

export const CALC_WEIGHT_OPTIONS = [
  10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14
] as const;

export const DRUM_SPECIFICATIONS = ["Automatic", "Specific"] as const;

export const DRUM_MODELS: DrumModel[] = [
  "FFNL13",
  "FFNL18",
  "FFNL32",
  "FF05NL32",
  "FF05NL32-0.5",
  "FFHL10",
  "FFVL11",
];

export const HEIGHT_BOTTOM_SECTIONS: HeightBottomSection[] = [
  "500 mm",
  "610 mm",
];

export const TORSION_SPRINGS_OPTIONS = [1, 2, 3, 4] as const;

export const SHAFT_CONNECTORS_OPTIONS = [0, 1, 2, 3, 4] as const;

export const SHAFT_DIAMETERS: ShaftDiameter[] = [
  "Shaft 1\" (25.4 mm)",
  "Shaft 1.25\" (31.75 mm)",
];

export const SPRING_FINISHES: SpringFinish[] = [
  "Black",
  "Galvanised",
  "Powder coated",
];

export const MIN_CYCLES_OPTIONS = [
  10000, 15000, 20000, 25000, 50000, 75000, 100000
] as const;

export const SPRING_TYPES: SpringTypeConfig[] = [
  "Simplex Identical",
  "Identical & Dummy",
  "Duplex Identical",
];

export const CABLE_TYPES: CableType[] = [
  "KUTEMS 6x19 PP",
  "KUTEMS 7x19 F",
  "Other cable",
];

export const CABLE_DIAMETERS: CableDiameter[] = ["4 mm", "5 mm"];

export const CABLE_TENSION_SETS: CableTensionSet[] = ["No", "Yes"];

export const DEFAULT_CALCULATION_VALUES = {
  trackSystem: "Normal Lift" as TrackSystem,
  doorWidth: 2500,
  doorHeight: 2125,
  highLiftSize: 0,
  calcWeight: 12,
  totalDoorWeight: 63.75, // (2.5 * 2.125 * 12)
  torsionSprings: 2,
  springFinish: "Powder coated" as SpringFinish,
  minCycles: 20000,
  springTypes: "Simplex Identical" as SpringTypeConfig,
};

