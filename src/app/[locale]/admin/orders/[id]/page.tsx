"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../components/AuthContext";
import { useParams } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: string;
  total: string;
};

type Address = {
  first_name?: string;
  last_name?: string;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  postcode?: string;
  country?: string;
};

type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: string;
  payment_status: string;
  payment_method: string;
  currency: string;
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  coupon_code: string | null;
  total: string;
  shipping_address: Address | null;
  billing_address: Address | null;
  notes: string | null;
  items: OrderItem[];
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
      {label.replace(/_/g, " ")}
    </span>
  );
}

function AddressBlock({ address, label }: { address: Address | null; label: string }) {
  if (!address) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        {[address.first_name, address.last_name].filter(Boolean).join(" ")}<br />
        {address.address_line_1}<br />
        {address.address_line_2 && <>{address.address_line_2}<br /></>}
        {[address.city, address.postcode, address.country].filter(Boolean).join(", ")}
      </p>
    </div>
  );
}

export default function AdminOrderShowPage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setOrder(d.data ?? null))
      .catch(() => setError("Failed to load order."))
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) return <p className="text-sm text-zinc-400">Loading…</p>;
  if (error || !order) return <p className="text-sm text-red-500">{error ?? "Order not found."}</p>;

  const fmt = (val: string) => `${order.currency} ${parseFloat(val).toFixed(2)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="../orders" className="mb-2 inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            ← Back to orders
          </Link>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Order <span className="font-mono">{order.order_number}</span>
          </h2>
          <p className="text-xs text-zinc-400">
            {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <Badge label={order.status} colours={STATUS_COLOURS} />
          <Badge label={order.payment_status} colours={PAYMENT_COLOURS} />
          <span className="text-xs text-zinc-400">{order.payment_method === "paypal" ? "PayPal" : "Prepayment"}</span>
        </div>
      </div>

      {/* Customer + Addresses */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:grid-cols-3">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Customer</p>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">{order.customer_name}</p>
          <p className="text-sm text-zinc-500">{order.customer_email}</p>
          {order.customer_phone && <p className="text-sm text-zinc-500">{order.customer_phone}</p>}
        </div>
        <AddressBlock address={order.shipping_address} label="Shipping address" />
        <AddressBlock address={order.billing_address} label="Billing address" />
      </div>

      {/* Order items */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              {["SKU", "Product", "Qty", "Unit price", "Total"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {order.items.map((item) => (
              <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-zinc-400">{item.product_sku}</td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{item.product_name}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{item.quantity}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{fmt(item.unit_price)}</td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{fmt(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="ml-auto w-full max-w-xs rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <dt>Subtotal</dt><dd>{fmt(order.subtotal)}</dd>
          </div>
          {parseFloat(order.shipping) > 0 && (
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <dt>Shipping</dt><dd>{fmt(order.shipping)}</dd>
            </div>
          )}
          {parseFloat(order.discount) > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <dt>Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}</dt>
              <dd>− {fmt(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between text-zinc-500 dark:text-zinc-500 text-xs">
            <dt>Tax (incl.)</dt><dd>{fmt(order.tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 font-semibold text-zinc-900 dark:border-zinc-700 dark:text-white">
            <dt>Total</dt><dd>{fmt(order.total)}</dd>
          </div>
        </dl>
      </div>

      {order.notes && (
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">Notes</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
