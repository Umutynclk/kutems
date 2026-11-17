import type { Metadata } from "next";
import SpringCalculator from "@/components/calculation/SpringCalculator";

export const metadata: Metadata = {
  title: "Yay Hesaplama – KUTEMS Seksiyonel Kapı Yay Hesaplama Programı",
  description:
    "KUTEMS seksiyonel kapı torsiyon yay hesaplama programı. Normal Lift, Low Headroom, High Lift ve Vertical Lift sistemleri için tambur, yay, tur ve halat hesabı.",
  keywords: ["yay hesaplama", "torsiyon yay", "seksiyonel kapı", "KUTEMS", "Normal Lift", "High Lift", "Low Headroom", "Vertical Lift"],
};

export default function CalculationPage() {
  return <SpringCalculator />;
}
