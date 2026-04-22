"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../components/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL;

const COUNTRIES = [
  "United Kingdom", "Germany", "France", "Netherlands", "Poland",
  "Czech Republic", "Austria", "Belgium", "Switzerland", "Spain",
  "Italy", "Sweden", "Denmark", "Norway", "Finland", "Ireland",
  "Portugal", "Hungary", "Romania", "Bulgaria", "Croatia",
  "Slovakia", "Slovenia", "Estonia", "Latvia", "Lithuania",
  "Luxembourg", "Malta", "Cyprus", "Greece", "United States",
  "Canada", "Australia", "Japan", "Other",
];

type ProductResult = { id: number; name: string; sku: string | null };

type FormState = {
  title: "Mr" | "Ms" | "";
  company: string;
  name: string;
  email: string;
  phone: string;
  request_type: string;
  subject: string;
  message: string;
  street: string;
  postcode_city: string;
  country: string;
  consent: boolean;
};

const empty = (): FormState => ({
  title: "", company: "", name: "", email: "", phone: "",
  request_type: "Technical Support",
  subject: "", message: "", street: "", postcode_city: "", country: "", consent: false,
});

export default function TechnicalSupportPage() {
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(empty);
  const [file, setFile] = useState<File | null>(null);

  const [productQuery, setProductQuery] = useState("");
  const [productSuggestions, setProductSuggestions] = useState<ProductResult[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(null);
  const [productSearching, setProductSearching] = useState(false);
  const [productHighlight, setProductHighlight] = useState(-1);
  const productDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productWrapperRef = useRef<HTMLDivElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill name/email if logged in
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.name || "",
        email: f.email || user.email || "",
      }));
    }
  }, [user]);

  // Product autocomplete
  useEffect(() => {
    if (productDebounce.current) clearTimeout(productDebounce.current);
    if (!productQuery || productQuery.length < 2 || selectedProduct) {
      setProductSuggestions([]);
      return;
    }
    productDebounce.current = setTimeout(async () => {
      setProductSearching(true);
      try {
        const res = await fetch(`${API}/api/support/products?q=${encodeURIComponent(productQuery)}`, {
          headers: { Accept: "application/json" },
        });
        setProductSuggestions(await res.json());
      } catch {
        setProductSuggestions([]);
      } finally {
        setProductSearching(false);
      }
    }, 300);
  }, [productQuery, selectedProduct]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (productWrapperRef.current && !productWrapperRef.current.contains(e.target as Node)) {
        setProductSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectProduct(p: ProductResult) {
    setSelectedProduct(p);
    setProductQuery(p.name);
    setProductSuggestions([]);
    setProductHighlight(-1);
  }

  function clearProduct() {
    setSelectedProduct(null);
    setProductQuery("");
  }

  function handleProductKeyDown(e: React.KeyboardEvent) {
    if (!productSuggestions.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setProductHighlight((i) => Math.min(i + 1, productSuggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setProductHighlight((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (productHighlight >= 0) selectProduct(productSuggestions[productHighlight]); }
    else if (e.key === "Escape") setProductSuggestions([]);
  }

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) { setError("Please select a product from the list."); return; }
    setError(null);
    setSubmitting(true);

    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => body.append(k, String(v)));
      body.append("product", selectedProduct.name);
      if (file) body.append("file", file);

      const res = await fetch(`${API}/api/support`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body,
      });

      const data = await res.json();
      if (!res.ok) {
        const msg = Object.values(data?.errors ?? {})?.[0]?.[0] ?? data?.message ?? "Submission failed.";
        throw new Error(msg as string);
      }
      setSuccess(data.ticket_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700";
  const labelClass = "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";
  const reqStar = <span className="ml-0.5 text-red-500">*</span>;

  if (success) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 sm:px-6 text-center">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-10 dark:border-green-800 dark:bg-green-900/20">
          <div className="mb-3 text-4xl">✓</div>
          <h2 className="mb-2 text-xl font-bold text-green-800 dark:text-green-300">Ticket submitted</h2>
          <p className="text-sm text-green-700 dark:text-green-400">
            Your support request has been received. Reference: <strong>#{success}</strong>
          </p>
          <p className="mt-2 text-sm text-green-600 dark:text-green-500">
            Our team will be in touch at <strong>{form.email}</strong>.
          </p>
          <button
            onClick={() => { setSuccess(null); setForm(empty()); setFile(null); setSelectedProduct(null); setProductQuery(""); }}
            className="mt-6 rounded-full bg-green-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
          >
            Submit another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Support</h1>
      <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-400">
        Fields marked <span className="text-red-500">*</span> are required.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Personal data */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Personal Data</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title {reqStar}</label>
              <select required className={inputClass} value={form.title} onChange={(e) => set("title", e.target.value as "Mr" | "Ms")}>
                <option value="">Select…</option>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input type="text" className={inputClass} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Optional" />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Name {reqStar}</label>
              <input required type="text" className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>E-mail address {reqStar}</label>
              <input required type="email" className={inputClass} value={form.email} onChange={(e) => set("email", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Phone {reqStar}</label>
              <input required type="tel" className={inputClass} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+44 …" />
            </div>
          </div>
        </div>

        {/* Support details */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Support Details</h2>
          <div className="flex flex-col gap-4">

            {/* Product autocomplete */}
            <div>
              <label className={labelClass}>Product {reqStar}</label>
              <div ref={productWrapperRef} className="relative">
                <input
                  type="text"
                  value={productQuery}
                  onChange={(e) => { setProductQuery(e.target.value); setSelectedProduct(null); }}
                  onKeyDown={handleProductKeyDown}
                  placeholder="Search by product name or SKU…"
                  className={inputClass}
                  autoComplete="off"
                />
                {selectedProduct && (
                  <button type="button" onClick={clearProduct} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">✕</button>
                )}
                {productSearching && <p className="mt-1 text-xs text-zinc-400">Searching…</p>}
                {productSuggestions.length > 0 && (
                  <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                    {productSuggestions.map((p, i) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onMouseDown={() => selectProduct(p)}
                          className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition ${i === productHighlight ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"}`}
                        >
                          <span className="font-medium text-zinc-900 dark:text-white">{p.name}</span>
                          {p.sku && <span className="ml-3 shrink-0 font-mono text-xs text-zinc-400">{p.sku}</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>Request type {reqStar}</label>
              <select required className={inputClass} value={form.request_type} onChange={(e) => set("request_type", e.target.value)}>
                <option value="Technical Support">Technical Support</option>
                <option value="Sales Support">Sales Support</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Subject {reqStar}</label>
              <input required type="text" className={inputClass} value={form.subject} onChange={(e) => set("subject", e.target.value)} />
            </div>

            <div>
              <label className={labelClass}>Message {reqStar}</label>
              <textarea
                required
                rows={5}
                className={inputClass}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Please describe your issue in as much detail as possible…"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Address</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Street {reqStar}</label>
              <input required type="text" className={inputClass} value={form.street} onChange={(e) => set("street", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Postcode / City {reqStar}</label>
                <input required type="text" className={inputClass} value={form.postcode_city} onChange={(e) => set("postcode_city", e.target.value)} placeholder="SW1A 2AA London" />
              </div>
              <div>
                <label className={labelClass}>Country {reqStar}</label>
                <select required className={inputClass} value={form.country} onChange={(e) => set("country", e.target.value)}>
                  <option value="">Select country…</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Attachment */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Attachment</h2>
          <label className={labelClass}>File <span className="text-zinc-400 font-normal">(jpg, png, pdf, txt, zip — max 10 MB)</span></label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.txt,.zip"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 file:px-3 file:py-1 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:file:bg-zinc-700 dark:file:text-zinc-300"
          />
          {file && (
            <p className="mt-2 text-xs text-zinc-500">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>
          )}
        </div>

        {/* Consent */}
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <input
            type="checkbox"
            required
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 accent-zinc-900 dark:border-zinc-600"
          />
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            I agree to the transfer of my data to third parties for the purpose of processing this support request. {reqStar}
          </span>
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {submitting ? "Submitting…" : "Submit support request"}
        </button>
      </form>
    </div>
  );
}
