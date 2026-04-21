"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";

type Coupon = {
  id: number;
  name: string;
  code: string;
  start: string;
  end: string;
  uses: number;
  used: number;
  type: "percentage" | "sum";
  value: string;
};

type FormState = {
  name: string;
  code: string;
  start: string;
  end: string;
  uses: string;
  type: "percentage" | "sum";
  value: string;
};

const emptyForm = (): FormState => ({
  name: "", code: "", start: "", end: "", uses: "", type: "percentage", value: "",
});

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function isActive(coupon: Coupon) {
  const today = new Date().toISOString().slice(0, 10);
  return coupon.start <= today && coupon.end >= today && (coupon.uses === 0 || coupon.used < coupon.uses);
}

function CouponTable({
  coupons,
  onDelete,
}: {
  coupons: Coupon[];
  onDelete: (id: number) => void;
}) {
  if (coupons.length === 0) {
    return <p className="py-6 text-center text-sm text-zinc-400">None.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-900">
          <tr>
            {["Name", "Code", "Discount", "Valid", "Usage", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
          {coupons.map((c) => (
            <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{c.name}</td>
              <td className="px-4 py-3">
                <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs dark:bg-zinc-800 dark:text-zinc-200">
                  {c.code}
                </span>
              </td>
              <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                {c.type === "percentage"
                  ? `${parseFloat(c.value)}%`
                  : `€${parseFloat(c.value).toFixed(2)}`}
              </td>
              <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs">
                {fmt(c.start)} – {fmt(c.end)}
              </td>
              <td className="px-4 py-3">
                {c.uses === 0 ? (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{c.used} / ∞</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-zinc-900 dark:bg-white"
                        style={{ width: `${Math.min(100, (c.used / c.uses) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {c.used}/{c.uses}
                    </span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(c.id)}
                  className="text-xs text-zinc-400 underline transition hover:text-red-500 dark:hover:text-red-400"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const active    = coupons.filter(isActive);
  const expired   = coupons.filter((c) => !isActive(c) && c.end < today);
  const exhausted = coupons.filter((c) => !isActive(c) && c.end >= today);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/coupons`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCoupons)
      .catch(() => setError("Failed to load coupons."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(id: number) {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/coupons/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, uses: parseInt(form.uses) }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg = Object.values(data?.errors ?? {})?.[0]?.[0] ?? data?.message ?? "Failed to save.";
        throw new Error(msg as string);
      }

      const created = await res.json();
      setCoupons((prev) => [created, ...prev]);
      setForm(emptyForm());
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  function set(key: keyof FormState, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  const inputClass = "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500";
  const labelClass = "mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400";

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-8">

      {/* Create form */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-white">New Coupon</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>Name</label>
              <input required className={inputClass} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Summer Sale" />
            </div>
            <div>
              <label className={labelClass}>Code</label>
              <div className="flex gap-2">
                <input required className={inputClass} value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="SUMMER20" />
                <button
                  type="button"
                  onClick={() => set("code", Math.random().toString(36).slice(2, 10).toUpperCase())}
                  className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select required className={inputClass} value={form.type} onChange={(e) => set("type", e.target.value as "percentage" | "sum")}>
                <option value="percentage">Percentage (%)</option>
                <option value="sum">Fixed amount (€)</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>{form.type === "percentage" ? "Discount %" : "Discount €"}</label>
              <input required type="number" min="0" step="0.01" className={inputClass} value={form.value} onChange={(e) => set("value", e.target.value)} placeholder={form.type === "percentage" ? "20" : "10.00"} />
            </div>
            <div>
              <label className={labelClass}>Start date</label>
              <input required type="date" className={inputClass} value={form.start} onChange={(e) => set("start", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>End date</label>
              <input required type="date" min={form.start || today} className={inputClass} value={form.end} onChange={(e) => set("end", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Max uses (0 = unlimited)</label>
              <input required type="number" min="0" className={inputClass} value={form.uses} onChange={(e) => set("uses", e.target.value)} placeholder="0" />
            </div>
            <div className="flex items-end">
            </div>
          </div>

          {formError && (
            <p className="mt-3 text-sm text-red-500">{formError}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {saving ? "Saving…" : "Create Coupon"}
          </button>
        </form>
      </div>

      {/* Active */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-white">
          Active <span className="ml-1 text-sm font-normal text-zinc-400">({active.length})</span>
        </h2>
        <CouponTable coupons={active} onDelete={handleDelete} />
      </div>

      {/* Exhausted */}
      {exhausted.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-white">
            Exhausted <span className="ml-1 text-sm font-normal text-zinc-400">({exhausted.length})</span>
          </h2>
          <CouponTable coupons={exhausted} onDelete={handleDelete} />
        </div>
      )}

      {/* Expired */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-zinc-900 dark:text-white">
          Expired <span className="ml-1 text-sm font-normal text-zinc-400">({expired.length})</span>
        </h2>
        <CouponTable coupons={expired} onDelete={handleDelete} />
      </div>

    </div>
  );
}
