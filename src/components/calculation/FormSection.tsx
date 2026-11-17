"use client";

import { ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  open: boolean;
  onToggle: () => void;
  completed?: boolean;
}

export default function FormSection({
  title,
  description,
  children,
  open,
  onToggle,
  completed,
}: FormSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {completed && (
            <span className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</span>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</p>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
        )}
      </button>

      <div
        className={cn(
          "transition-all duration-200 overflow-hidden",
          open ? "max-h-[9999px]" : "max-h-0"
        )}
      >
        <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
