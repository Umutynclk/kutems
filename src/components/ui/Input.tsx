import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  unit?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, unit, leftIcon, rightElement, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-500 dark:text-slate-400">{leftIcon}</div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500",
              "border-slate-300 dark:border-slate-700",
              "px-3.5 py-2.5 text-sm",
              "transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800",
              error && "border-red-400 dark:border-red-500 focus:ring-red-400",
              leftIcon && "pl-10",
              (unit || rightElement) && "pr-16",
              className
            )}
            {...props}
          />
          {unit && (
            <div className="absolute right-3 text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
              {unit}
            </div>
          )}
          {rightElement && (
            <div className="absolute right-3">{rightElement}</div>
          )}
        </div>
        {hint && !error && (
          <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
