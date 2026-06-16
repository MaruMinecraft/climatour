"use client";

import type { Locale } from "@/types/travel";

interface LanguageSwitcherProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export function LanguageSwitcher({ locale, onLocaleChange }: LanguageSwitcherProps) {
  return (
    <div className="language-switcher" aria-label="Language">
      {(["ru", "en"] as const).map((item) => (
        <button
          className={item === locale ? "active" : ""}
          key={item}
          onClick={() => onLocaleChange(item)}
          type="button"
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
