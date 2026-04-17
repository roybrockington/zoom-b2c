"use client";

import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number | null;
  parent_id: number | null;
  children: Category[];
};

function CategoryRow({ cat, depth = 0 }: { cat: Category; depth?: number }) {
  return (
    <>
      <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
        <td className="px-4 py-3">
          <span style={{ paddingLeft: depth * 20 }} className="font-medium text-zinc-900 dark:text-white">
            {depth > 0 && <span className="mr-1 text-zinc-300 dark:text-zinc-600">↳</span>}
            {cat.name}
          </span>
        </td>
        <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-400">{cat.slug}</td>
        <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs">{cat.sort_order ?? "—"}</td>
        <td className="px-4 py-3">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            cat.is_active
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          }`}>
            {cat.is_active ? "Active" : "Inactive"}
          </span>
        </td>
      </tr>
      {cat.children?.map((child) => (
        <CategoryRow key={child.id} cat={child} depth={depth + 1} />
      ))}
    </>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.data ?? []))
      .catch(() => setError("Failed to load categories."))
      .finally(() => setLoading(false));
  }, []);

  const roots = categories.filter((c) => !c.parent_id);

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
        Categories <span className="ml-1 text-sm font-normal text-zinc-400">({categories.length})</span>
      </h2>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              {["Name", "Slug", "Order", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {roots.map((cat) => (
              <CategoryRow key={cat.id} cat={cat} />
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-400">No categories found.</p>
        )}
      </div>
    </div>
  );
}
