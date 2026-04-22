"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/navigation";

type ProductResult = {
  id: number;
  name: string;
  sku: string | null;
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function WarrantyExtensionPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [serialNumber, setSerialNumber] = useState("");
  const [retailer, setRetailer] = useState("");
  const [purchasedAt, setPurchasedAt] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.length < 2 || selectedProduct) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API}/api/warranty/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [query, token, selectedProduct]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectProduct(p: ProductResult) {
    setSelectedProduct(p);
    setQuery(p.name);
    setSuggestions([]);
    setHighlightIndex(-1);
  }

  function clearProduct() {
    setSelectedProduct(null);
    setQuery("");
    setSuggestions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) selectProduct(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/warranty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          serial_number: serialNumber,
          retailer,
          purchased_at: purchasedAt,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        const msg = Object.values(data?.errors ?? {})?.[0]?.[0] ?? data?.message ?? "Submission failed.";
        throw new Error(msg as string);
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !user) return null;

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700";
  const labelClass = "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Warranty Extension</h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Register your Zoom product to extend your warranty. All fields are required.
      </p>

      {success ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20">
          <div className="mb-3 text-3xl">✓</div>
          <h2 className="mb-1 text-lg font-semibold text-green-800 dark:text-green-300">Registration successful</h2>
          <p className="text-sm text-green-700 dark:text-green-400">
            Your warranty for <strong>{selectedProduct?.name}</strong> has been registered.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setSelectedProduct(null);
              setQuery("");
              setSerialNumber("");
              setRetailer("");
              setPurchasedAt("");
            }}
            className="mt-6 rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
          >
            Register another product
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-5">

              {/* Product autocomplete */}
              <div>
                <label className={labelClass}>Product</label>
                <div ref={wrapperRef} className="relative">
                  <input
                    type="text"
                    required={!selectedProduct}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedProduct(null); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by product name or SKU…"
                    className={inputClass}
                    autoComplete="off"
                  />
                  {selectedProduct && (
                    <button
                      type="button"
                      onClick={clearProduct}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                      aria-label="Clear"
                    >
                      ✕
                    </button>
                  )}
                  {searching && (
                    <p className="mt-1 text-xs text-zinc-400">Searching…</p>
                  )}
                  {suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                      {suggestions.map((p, i) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onMouseDown={() => selectProduct(p)}
                            className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${
                              i === highlightIndex
                                ? "bg-zinc-100 dark:bg-zinc-800"
                                : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            }`}
                          >
                            <span className="font-medium text-zinc-900 dark:text-white">{p.name}</span>
                            {p.sku && (
                              <span className="ml-3 shrink-0 font-mono text-xs text-zinc-400">{p.sku}</span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Serial number */}
              <div>
                <label className={labelClass}>Serial number</label>
                <input
                  required
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. Z123456789"
                  className={inputClass}
                />
              </div>

              {/* Retailer */}
              <div>
                <label className={labelClass}>Retailer purchased from</label>
                <input
                  required
                  type="text"
                  value={retailer}
                  onChange={(e) => setRetailer(e.target.value)}
                  placeholder="e.g. Amazon, Thomann, local music store…"
                  className={inputClass}
                />
              </div>

              {/* Date of purchase */}
              <div>
                <label className={labelClass}>Date of purchase</label>
                <input
                  required
                  type="date"
                  value={purchasedAt}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setPurchasedAt(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !selectedProduct}
            className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? "Submitting…" : "Register warranty"}
          </button>
        </form>
      )}
    </div>
  );
}
