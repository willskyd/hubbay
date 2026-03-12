"use client";

import { MoonStar, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function resolveInitialTheme() {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("hubbay-theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialDark = resolveInitialTheme();
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("hubbay-theme", next ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hubbay-gold/35 bg-hubbay-surface/80 text-hubbay-gold"
        aria-label="Toggle color theme"
      >
        <Sun size={14} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hubbay-gold/35 bg-hubbay-surface/80 text-hubbay-gold transition hover:border-hubbay-gold hover:shadow-[0_8px_22px_rgba(212,175,55,0.2)]"
      aria-label="Toggle color theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={14} /> : <MoonStar size={14} />}
    </button>
  );
}
