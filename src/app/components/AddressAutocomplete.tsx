"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = {
  place_id: string;
  formatted: string;
  address_line1: string;
  city: string;
  postcode: string;
  country_code: string;
};

type Props = {
  value: string;
  onChange: (raw: string) => void;
  onSelect: (fields: { address_line_1: string; city: string; postcode: string; country: string }) => void;
  inputClass: string;
  placeholder?: string;
};

export default function AddressAutocomplete({ value, onChange, onSelect, inputClass, placeholder }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInput(raw: string) {
    onChange(raw);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (raw.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const key = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
      if (!key) return;

      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(raw)}&limit=5&format=json&apiKey=${key}`
        );
        const data = await res.json();
        const results: Suggestion[] = (data.results ?? []).map((r: Record<string, string>) => ({
          place_id: r.place_id ?? r.result_type + r.formatted,
          formatted: r.formatted ?? "",
          address_line1: r.address_line1 ?? "",
          city: r.city ?? r.town ?? r.village ?? "",
          postcode: r.postcode ?? "",
          country_code: (r.country_code ?? "").toUpperCase(),
        }));
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 300);
  }

  function handleSelect(s: Suggestion) {
    onSelect({
      address_line_1: s.address_line1 || s.formatted,
      city: s.city,
      postcode: s.postcode,
      country: s.country_code,
    });
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        required
        type="text"
        className={inputClass}
        placeholder={placeholder ?? "Street and number"}
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 overflow-hidden">
          {suggestions.map((s, i) => (
            <li
              key={s.place_id}
              onMouseDown={() => handleSelect(s)}
              className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                i === activeIndex
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {s.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
