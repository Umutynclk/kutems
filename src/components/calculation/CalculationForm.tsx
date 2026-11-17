"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculationInputSchema, CalculationFormValues } from "@/lib/calculator/validators";
import { CalculationResult } from "@/lib/calculator/types";
import { getCalculationProvider } from "@/lib/calculator/provider";
import {
  DEFAULT_CALCULATION_VALUES,
  TRACK_SYSTEMS,
  CALC_WEIGHT_OPTIONS,
  TORSION_SPRINGS_OPTIONS,
  SPRING_FINISHES,
  MIN_CYCLES_OPTIONS,
  SPRING_TYPES,
} from "@/lib/calculator/constants";
import { useLocale } from "@/context/LocaleContext";
import CalculationResults from "./CalculationResults";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { CalculationResultSkeleton } from "@/components/ui/Skeleton";
import {
  AlertCircle,
  RefreshCw,
  Calculator,
  DoorClosed,
  RotateCw,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle,
} from "lucide-react";

export default function CalculationForm() {
  const { t } = useLocale();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CalculationFormValues>({
    resolver: zodResolver(calculationInputSchema),
    defaultValues: DEFAULT_CALCULATION_VALUES,
  });

  const watchWidth = watch("doorWidth");
  const watchHeight = watch("doorHeight");
  const watchCalcWeight = watch("calcWeight");
  const watchTrackSystem = watch("trackSystem");
  const watchTorsionSprings = watch("torsionSprings");

  // Real-time automatic calculation of Total Door Weight when width, height, or calcWeight changes
  useEffect(() => {
    if (watchWidth > 0 && watchHeight > 0) {
      const density = watchCalcWeight || 12;
      const computed = Math.round((watchWidth / 1000) * (watchHeight / 1000) * density * 10) / 10;
      setValue("totalDoorWeight", computed, { shouldValidate: true });
    }
  }, [watchWidth, watchHeight, watchCalcWeight, setValue]);

  // Real-time live calculated values for the preview bar
  // Drum selection logic (mirrors engine.ts)
  const isHighLift = watchTrackSystem === "High Lift";
  const isVerticalLift = watchTrackSystem === "Vertical Lift";
  const isLowHeadRoom = watchTrackSystem === "Low Head Room";
  const h = watchHeight || 2125;
  const w = watchWidth || 2500;
  const computedWeight = (w / 1000) * (h / 1000) * (watchCalcWeight || 12);

  const liveDrum = isHighLift
    ? "FFHL10"
    : isVerticalLift
    ? "FFVL11"
    : isLowHeadRoom
    ? "FF05NL32"
    : (h >= 4500 || w >= 4500 || computedWeight >= 200)
    ? "FFNL18"
    : h > 3200
    ? "FFNL18"
    : "FFNL13";

  // Cable correction: 780mm for FFNL18, 560mm for FFNL13, 1835mm for HL, 3908mm for VL
  const liveCableCorrection = isHighLift ? 1835 : isVerticalLift ? 3908 : isLowHeadRoom ? 874 : liveDrum.includes("18") ? 780 : 560;
  const liveCableLength = h + 610 + liveCableCorrection;

  // Live turns
  const liveTurns = liveDrum.includes("18")
    ? Math.round((1.20 + h / 433.832) * 10) / 10
    : liveDrum.includes("32")
    ? Math.round((1.20 + h / 658.368) * 10) / 10
    : Math.round((1.30 + h / 322.58) * 10) / 10;

  const onSubmit = async (data: CalculationFormValues) => {
    setCalculating(true);
    setError(null);
    try {
      const provider = getCalculationProvider();
      const res = await provider.calculate(data);
      setResult(res);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hesaplama hatası oluştu.");
    } finally {
      setCalculating(false);
    }
  };

  const handleReset = () => {
    reset(DEFAULT_CALCULATION_VALUES);
    setResult(null);
    setError(null);
  };

  const toOptions = (items: readonly (string | number)[]) =>
    items.map((v) => ({ label: String(v), value: v }));

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Unified Engineering Table Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          
          {/* Table Header Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Torsiyon Yay Konfigürasyon Tablosu
                </h2>
                <p className="text-xs text-slate-300">
                  Kapı ölçülerinizi girin; ağırlık, tur sayısı, tambur ve halat değerleri otomatik hesaplansın
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Otomatik Mühendislik Motoru
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            
            {/* ── 1. KAPI VE RAY PARAMETRELERİ ─────────────────────────── */}
            <div className="p-6">
              <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <DoorClosed className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Kapı Ölçüleri ve Ray Sistemi
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Controller
                  name="trackSystem"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={t("calculator.fields.trackSystem")}
                      options={toOptions(TRACK_SYSTEMS)}
                      {...field}
                      error={errors.trackSystem?.message}
                    />
                  )}
                />
                <Input
                  label="Kapı Genişliği (Width)"
                  type="number"
                  unit="mm"
                  placeholder="Örn: 2500"
                  {...register("doorWidth", { valueAsNumber: true })}
                  error={errors.doorWidth?.message}
                />
                <Input
                  label="Kapı Yüksekliği (Height)"
                  type="number"
                  unit="mm"
                  placeholder="Örn: 2125"
                  {...register("doorHeight", { valueAsNumber: true })}
                  error={errors.doorHeight?.message}
                />
                <Controller
                  name="calcWeight"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Panel m² Ağırlığı"
                      options={CALC_WEIGHT_OPTIONS.map((v) => ({ label: `${v} kg/m²`, value: v }))}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <div className="sm:col-span-2 lg:col-span-2">
                  <Input
                    label="Toplam Kapı Ağırlığı (Otomatik / Düzenlenebilir)"
                    type="number"
                    unit="kg"
                    placeholder="Örn: 63.75"
                    {...register("totalDoorWeight", { valueAsNumber: true })}
                    error={errors.totalDoorWeight?.message}
                  />
                </div>
                {watchTrackSystem === "High Lift" && (
                  <div className="sm:col-span-2 lg:col-span-2">
                    <Input
                      label={t("calculator.fields.highLiftSize")}
                      type="number"
                      unit="mm"
                      placeholder={t("calculator.placeholders.highLiftSize")}
                      {...register("highLiftSize", { valueAsNumber: true })}
                      error={errors.highLiftSize?.message}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── 2. YAY ÖMÜR VE DONANIM TERCİHLERİ ─────────────────────── */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <RotateCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Yay Konfigürasyonu ve Çevrim Ömrü
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Controller
                  name="torsionSprings"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={t("calculator.fields.torsionSprings")}
                      options={TORSION_SPRINGS_OPTIONS.map((v) => ({ label: `${v} Yay / Springs`, value: v }))}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <Controller
                  name="minCycles"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={t("calculator.fields.minCycles")}
                      options={MIN_CYCLES_OPTIONS.map((v) => ({
                        label: `${(v / 1000).toFixed(0)}K (${v.toLocaleString()} Çevrim)`,
                        value: v,
                      }))}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
                <Controller
                  name="springFinish"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={t("calculator.fields.springFinish")}
                      options={toOptions(SPRING_FINISHES)}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="springTypes"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={t("calculator.fields.springTypes")}
                      options={toOptions(SPRING_TYPES)}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            {/* ── 3. OTOMATİK HESAPLANAN SİSTEM BİLGİLERİ (READ-ONLY LIVE METRICS) ── */}
            <div className="p-6">
              <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  Sistem Tarafından Otomatik Hesaplanacak Parametreler
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Ön Tur Sayısı</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                    ~{liveTurns} Tur
                  </span>
                  <span className="text-[11px] text-slate-400">Yükseklik & Tambura göre otomatik</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Önerilen Tambur</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                    {liveDrum} Modeli
                  </span>
                  <span className="text-[11px] text-slate-400">Ray sistemine göre optimize</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Mil Çapı</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    1&quot; (25.4 mm) Standart
                  </span>
                  <span className="text-[11px] text-slate-400">Kapı ağırlığına göre seçilir</span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Halat & Güvenlik</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    Ø4 mm ({liveCableLength} mm)
                  </span>
                  <span className="text-[11px] text-slate-400">6.5x EN 13241-1 Güvenlik Faktörü</span>
                </div>
              </div>
            </div>

          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 mx-6 my-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Table Footer Bar & Action Buttons */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Genişlik ve yükseklik girildiğinde tüm torsiyon yay alternatifleri otomatik türetilir.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleReset}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className="h-4 w-4" />
                {t("calculator.buttons.reset")}
              </Button>
              <Button
                type="submit"
                size="md"
                loading={calculating}
                className="flex-1 sm:flex-none px-6 shadow-md hover:shadow-lg"
              >
                <Sparkles className="h-4 w-4" />
                {calculating ? t("calculator.buttons.calculating") : "Yay Sistemini Hesapla"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Results Section */}
      <div id="results" className="pt-2">
        {calculating && <CalculationResultSkeleton />}
        {!calculating && result && <CalculationResults result={result} />}
      </div>
    </div>
  );
}

