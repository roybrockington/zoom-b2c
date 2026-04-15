"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { routing } from "../../i18n/routing";

const languages = [
  { code: "en", label: "English",    flagCode: "gb" },
  { code: "de", label: "Deutsch",    flagCode: "de" },
  { code: "fr", label: "Français",   flagCode: "fr" },
  { code: "nl", label: "Nederlands", flagCode: "nl" },
  { code: "pl", label: "Polski",     flagCode: "pl" },
  { code: "cz", label: "Čeština",    flagCode: "cz" },
] as const;

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selected = languages.find((l) => l.code === locale) ?? languages[0];

  function openMenu() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeMenu() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  function switchLocale(code: string) {
    setOpen(false);

    // Strip the current locale prefix from the pathname (if present)
    const defaultLocale = routing.defaultLocale;
    let strippedPath = pathname;

    for (const loc of routing.locales) {
      if (loc === defaultLocale) continue; // default has no prefix
      if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
        strippedPath = pathname.slice(loc.length + 1) || "/";
        break;
      }
    }

    // Build the new path
    const newPath = code === defaultLocale
      ? strippedPath
      : `/${code}${strippedPath === "/" ? "" : strippedPath}`;

    router.push(newPath);
  }

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <button
        aria-label="Select language"
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <span className={`fi fi-${selected.flagCode} text-base`} />
        <span className="hidden sm:inline">{selected.code.toUpperCase()}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 min-w-40 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                lang.code === locale
                  ? "font-semibold text-zinc-900 dark:text-white"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <span className={`fi fi-${lang.flagCode} text-base`} />
              <span>{lang.label}</span>
              {lang.code === locale && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-auto h-3.5 w-3.5 text-zinc-900 dark:text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
