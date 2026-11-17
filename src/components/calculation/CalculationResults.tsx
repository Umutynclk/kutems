"use client";

import { CalculationResult } from "@/lib/calculator/types";
import { useLocale } from "@/context/LocaleContext";
import SolutionCard from "./SolutionCard";
import { formatNumber } from "@/lib/utils";
import { CheckCircle2, Zap, Scale, RotateCcw } from "lucide-react";

interface CalculationResultsProps {
  result: CalculationResult;
}

export default function CalculationResults({ result }: CalculationResultsProps) {
  const { t } = useLocale();

  const metrics = [
    {
      label: t("calculator.fields.totalDoorWeight"),
      value: `${formatNumber(result.totalDoorWeight, 1)} kg`,
      icon: Scale,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: t("calculator.fields.torqueTotal"),
      value: `${formatNumber(result.torqueTotal)} Nmm`,
      icon: Zap,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: t("calculator.fields.torquePerSpring"),
      value: `${formatNumber(result.torquePerSpring)} Nmm`,
      icon: RotateCcw,
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      label: t("calculator.results.solutionsCount"),
      value: result.solutions.length.toString(),
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {t("calculator.results.title")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t("calculator.results.subtitle")}</p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex gap-3 items-start"
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{label}</p>
              <p className={`text-base font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Solution Cards */}
      <div className="space-y-3">
        {result.solutions.map((solution) => (
          <SolutionCard
            key={solution.solutionNumber}
            solution={solution}
            rank={solution.solutionNumber}
          />
        ))}
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500 text-center pt-2">
        Calculated at{" "}
        {new Date(result.calculatedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}
