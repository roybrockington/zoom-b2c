"use client";

import { useEffect, useRef, useState } from "react";

const IMG_BASE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";
const PER_PAGE = 20;

type Product = {
  id: number;
  name: string;
  sku: string | null;
  price: string;
  sale_price: string | null;
  stock_quantity: number | null;
  in_stock: boolean;
  is_featured: boolean;
  category: { name: string } | null;
  img1: string | null;
};

type Meta = {
  current_page: number;
  last_page: number;
  total: number;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      per_page: String(PER_PAGE),
      page: String(page),
      include: "category",
    });
    if (query) params.set("filter[name]", query);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.data ?? []);
        if (d.meta) setMeta(d.meta);
      })
      .catch(() => setError("Failed to load products."))
      .finally(() => setLoading(false));
  }, [page, query]);

  function handleSearch(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
      setQuery(value);
    }, 350);
  }

  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Products
          {!loading && (
            <span className="ml-1 text-sm font-normal text-zinc-400">({meta.total})</span>
          )}
        </h2>
        <input
          type="search"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              {["Product", "SKU", "Category", "Price", "Stock"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-400">Loading…</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-zinc-400">No products found.</td>
              </tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.img1 ? (
                      <img
                        src={`${IMG_BASE}${p.img1}`}
                        alt={p.name}
                        className="h-10 w-14 shrink-0 rounded object-contain bg-zinc-100 dark:bg-zinc-800"
                      />
                    ) : (
                      <div className="h-10 w-14 shrink-0 rounded bg-zinc-100 dark:bg-zinc-800" />
                    )}
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-white">{p.name}</div>
                      {p.is_featured && <span className="text-xs text-amber-500">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">{p.sku ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-900 dark:text-white">
                  {p.sale_price ? (
                    <>
                      <span className="line-through text-zinc-400 mr-1">€{parseFloat(p.price).toFixed(2)}</span>
                      <span className="text-green-600 dark:text-green-400">€{parseFloat(p.sale_price).toFixed(2)}</span>
                    </>
                  ) : (
                    <span>€{parseFloat(p.price).toFixed(2)}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    p.in_stock
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {p.in_stock ? `${p.stock_quantity ?? "✓"} in stock` : "Out of stock"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>
            Page {meta.current_page} of {meta.last_page}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.current_page === 1}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={meta.current_page === meta.last_page}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
