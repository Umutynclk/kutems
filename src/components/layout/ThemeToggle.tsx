"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className={cn(
        "relative h-8 w-8 rounded-lg flex items-center justify-center",
        "text-slate-500 dark:text-slate-400",
        "hover:bg-slate-100 dark:hover:bg-slate-800",
        "hover:text-slate-800 dark:hover:text-slate-200",
        "transition-all duration-150",
        className
      )}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
