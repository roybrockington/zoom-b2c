"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";

type User = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
};

type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (debouncedSearch) params.set("search", debouncedSearch);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.data ?? []);
        setMeta({
          current_page: d.current_page,
          last_page:    d.last_page,
          per_page:     d.per_page,
          total:        d.total,
        });
      })
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, [token, page, debouncedSearch]);

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;
  if (error)   return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Users{meta && <span className="ml-1 text-sm font-normal text-zinc-400">({meta.total})</span>}
        </h2>
        <input
          type="search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:ring-zinc-600"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              {["ID", "Name", "Email", "Role", "Joined"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <td className="px-4 py-3 text-xs text-zinc-400 dark:text-zinc-500">#{u.id}</td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{u.name}</td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.is_admin
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {u.is_admin ? "Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-400 dark:text-zinc-500">
                  {new Date(u.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-400">No users found.</p>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>
            Page {meta.current_page} of {meta.last_page} — {meta.total} users
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={meta.current_page === 1}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.current_page === meta.last_page}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
