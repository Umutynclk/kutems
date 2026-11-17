"use client";

import { useState } from "react";
import { SpringSolution } from "@/lib/calculator/types";
import { useLocale } from "@/context/LocaleContext";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

interface SolutionCardProps {
  solution: SpringSolution;
  rank: number;
}

export default function SolutionCard({ solution, rank }: SolutionCardProps) {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(rank === 1);

  const isRecommended = rank === 1;

  const cycleLabel =
    solution.springCycles >= 1000
      ? `${(solution.springCycles / 1000).toFixed(0)}K`
      : solution.springCycles.toString();

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-200",
        isRecommended
          ? "border-blue-300 dark:border-blue-700 shadow-md shadow-blue-100 dark:shadow-blue-900/20"
          : "border-slate-200 dark:border-slate-700"
      )}
    >
      {isRecommended && (
        <div className="bg-blue-600 text-white px-4 py-1.5 flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide">
            ★ ÖNERİLEN ÇÖZÜM — En Yüksek Balans Stabilitesi
          </span>
        </div>
      )}

      {/* Column Headers */}
      <div
        className={cn(
          "px-4 py-2 grid items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800",
          "grid-cols-[24px_70px_50px_45px_45px_65px_100px_45px_50px_55px_55px_60px_55px_85px_60px_50px]",
          isRecommended ? "bg-blue-50 dark:bg-blue-900/20" : "bg-slate-50 dark:bg-slate-800/60"
        )}
      >
        <span>#</span>
        <span>Drum</span>
        <span>Turns</span>
        <span>Finish</span>
        <span>Req.</span>
        <span>Total m</span>
        <span>Total M</span>
        <span>Qty</span>
        <span>Dir</span>
        <span>d (mm)</span>
        <span>D (mm)</span>
        <span>L (mm)</span>
        <span>m (kg)</span>
        <span>M (Nmm/T)</span>
        <span>Cycles</span>
        <span className="text-right">Detay</span>
      </div>

      {/* Main & Component Rows */}
      <div className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800/60">
        {/* Component 1 (LW) */}
        <div
          className={cn(
            "px-4 py-2.5 grid items-center gap-1 text-xs",
            "grid-cols-[24px_70px_50px_45px_45px_65px_100px_45px_50px_55px_55px_60px_55px_85px_60px_50px]"
          )}
        >
          <span
            className={cn(
              "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
              isRecommended
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
            )}
          >
            {rank}
          </span>

          <span className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
            {solution.drum}
          </span>

          <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
            {solution.drumTurns}
          </span>

          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
            PWD
          </span>

          <span className="text-[10px] text-slate-500 font-mono">
            {solution.springCycles >= 1000 ? `${(solution.springCycles / 1000).toFixed(0)}K` : solution.springCycles}
          </span>

          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {(solution.m * (solution.direction === "LW + RW" ? 2 : 1)).toFixed(1)} kg
          </span>

          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {formatNumber(solution.torquePerTurn * (solution.direction === "LW + RW" ? 2 : 1))}
          </span>

          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
            1x
          </span>

          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
            LW
          </span>

          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {solution.wireDiameter.toFixed(2)}
          </span>

          <span className="font-mono text-slate-700 dark:text-slate-300">
            {solution.outerDiameter}
          </span>

          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
            {solution.springLength}
          </span>

          <span className="font-mono text-slate-700 dark:text-slate-300">
            {solution.m.toFixed(1)}
          </span>

          <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
            {formatNumber(solution.torquePerTurn)}
          </span>

          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block text-center",
              solution.springCycles >= 30000
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            )}
          >
            {cycleLabel}
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-end gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Component 2 (RW) if dual spring */}
        {solution.direction === "LW + RW" && (
          <div
            className={cn(
              "px-4 py-2 grid items-center gap-1 text-xs bg-slate-50/40 dark:bg-slate-800/30 text-slate-500",
              "grid-cols-[24px_70px_50px_45px_45px_65px_100px_45px_50px_55px_55px_60px_55px_85px_60px_50px]"
            )}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">1x</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              RW
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{solution.wireDiameter.toFixed(2)}</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{solution.outerDiameter}</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{solution.springLength}</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{solution.m.toFixed(1)}</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{formatNumber(solution.torquePerTurn)}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-center text-slate-600 dark:text-slate-400">
              {cycleLabel}
            </span>
            <span></span>
          </div>
        )}
      </div>

      {/* Expanded Detail Panel */}
      {expanded && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Tel Çapı (d)", value: `${solution.wireDiameter.toFixed(2)} mm` },
              { label: "İç Çap (Di)", value: `${solution.innerDiameter} mm` },
              { label: "Dış Çap (D)", value: `${solution.outerDiameter} mm` },
              { label: "Yay Uzunluğu (L)", value: `${solution.springLength} mm` },
              { label: "Aktif Sarım", value: `${solution.activeCoils}` },
              { label: "Tork/Tur (M)", value: `${formatNumber(solution.torquePerTurn)} Nmm/T` },
              { label: "Ön Tur Sayısı", value: `${solution.drumTurns}` },
              { label: "Kütle (m)", value: `${solution.m.toFixed(2)} kg` },
              { label: "Tambur", value: solution.drum },
              { label: "Ürün Kodu", value: solution.productCode },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5 uppercase tracking-wide">{label}</p>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">{value}</p>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <span className="font-semibold">Maksimum Gerilim (sigma): </span>
              {solution.maxStress}
            </p>
          </div>

          {solution.notes && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
              <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">{solution.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
