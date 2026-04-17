"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../components/AuthContext";

type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total: string;
  currency: string;
  status: string;
  payment_status: string;
  created_at: string;
};

const STATUS_COLOURS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  completed:  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled:  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  refunded:   "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const PAYMENT_COLOURS: Record<string, string> = {
  unpaid:             "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  paid:               "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  partially_refunded: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  refunded:           "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

function Badge({ label, colours }: { label: string; colours: Record<string, string> }) {
  const cls = colours[label] ?? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {label.replace("_", " ")}
    </span>
  );
}

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setOrders(d.data ?? []))
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">
        Orders <span className="ml-1 text-sm font-normal text-zinc-400">({orders.length})</span>
      </h2>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              {["Order", "Customer", "Total", "Status", "Payment", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-medium text-zinc-900 dark:text-white">{o.order_number}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-zinc-900 dark:text-white">{o.customer_name}</div>
                  <div className="text-xs text-zinc-400">{o.customer_email}</div>
                </td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                  {o.currency} {parseFloat(o.total).toFixed(2)}
                </td>
                <td className="px-4 py-3"><Badge label={o.status} colours={STATUS_COLOURS} /></td>
                <td className="px-4 py-3"><Badge label={o.payment_status} colours={PAYMENT_COLOURS} /></td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs">
                  {new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-zinc-400">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
