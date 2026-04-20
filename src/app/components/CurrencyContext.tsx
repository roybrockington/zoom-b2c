"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Currency = {
  code: "EUR" | "GBP";
  symbol: string;
  label: string;
};

export const currencies: Currency[] = [
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
];

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: currencies[0],
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(currencies[0]);

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    const found = currencies.find((c) => c.code === saved);
    if (found) setCurrencyState(found);
  }, []);

  function setCurrency(c: Currency) {
    localStorage.setItem("currency", c.code);
    setCurrencyState(c);
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function formatPrice(
  eur: string | null | undefined,
  gbp: string | null | undefined,
  currency: Currency
): string | null {
  const raw = currency.code === "GBP" ? gbp : eur;
  if (!raw) return null;
  const num = parseFloat(raw);
  if (isNaN(num)) return null;
  return currency.code === "GBP"
    ? num.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : num.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
