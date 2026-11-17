import { z } from "zod";

export const calculationInputSchema = z.object({
  trackSystem: z.enum([
    "Normal Lift",
    "Low Head Room",
    "High Lift",
    "Vertical Lift",
    "Follow Roof NS",
    "Follow Roof LHR",
    "Follow Roof HL",
  ]),
  doorWidth: z
    .number()
    .min(1000, "Kapı genişliği en az 1000 mm olmalıdır")
    .max(12000, "Kapı genişliği en fazla 12000 mm olabilir"),
  doorHeight: z
    .number()
    .min(1500, "Kapı yüksekliği en az 1500 mm olmalıdır")
    .max(10000, "Kapı yüksekliği en fazla 10000 mm olabilir"),
  highLiftSize: z.number().min(0).optional(),
  calcWeight: z.number().min(5).max(30),
  totalDoorWeight: z
    .number()
    .min(20, "Toplam kapı ağırlığı en az 20 kg olmalıdır")
    .max(2000, "Toplam kapı ağırlığı en fazla 2000 kg olabilir"),
  torsionSprings: z.number().min(1).max(4),
  springFinish: z.enum(["Black", "Galvanised", "Powder coated"]),
  minCycles: z.number().min(10000).max(100000),
  springTypes: z
    .enum(["Simplex Identical", "Identical & Dummy", "Duplex Identical"])
    .optional(),
  numberOfTurns: z.number().optional(),
  drum: z.enum(["FFNL13", "FFNL18", "FFNL32", "FF05NL32", "FF05NL32-0.5", "FFHL10", "FFVL11"]).optional(),
  shaftDiameter: z.enum(["Shaft 1\" (25.4 mm)", "Shaft 1.25\" (31.75 mm)"]).optional(),
  cableLength: z.number().optional(),
  cableMaxLoad: z.number().optional(),
});

export type CalculationFormValues = z.infer<typeof calculationInputSchema>;


