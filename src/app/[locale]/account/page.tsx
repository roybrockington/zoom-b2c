"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  id: number;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: string;
  total: string;
};

type Address = {
  id: number;
  type: string;
  first_name: string;
  last_name: string;
  company: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string | null;
  postcode: string;
  country: string;
  phone: string | null;
};

type Order = {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total: string;
  currency: string;
  created_at: string;
  items: OrderItem[];
};

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shipped:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered:  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled:  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const PAYMENT_STYLES: Record<string, string> = {
  unpaid: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  paid:   "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function AccountPage() {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const [billingAddress, setBillingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrders(data.data ?? []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data: Address[]) => setBillingAddress(data.find((a) => a.type === "billing") ?? null))
      .catch(() => {});
  }, [token]);

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Account</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Sign out
        </button>
      </div>

      {/* Account info card */}
      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Account Details
        </h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">Name</dt>
            <dd className="mt-0.5 font-medium text-zinc-900 dark:text-white">{user.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">Email</dt>
            <dd className="mt-0.5 font-medium text-zinc-900 dark:text-white">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">Account type</dt>
            <dd className="mt-0.5">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.is_admin ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                {user.is_admin ? "Admin" : "Customer"}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Billing address */}
      <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Billing Address
        </h2>
        {billingAddress ? (
          <address className="not-italic text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <span className="font-medium text-zinc-900 dark:text-white">
              {billingAddress.first_name} {billingAddress.last_name}
            </span>
            {billingAddress.company && <><br />{billingAddress.company}</>}
            <br />{billingAddress.address_line_1}
            {billingAddress.address_line_2 && <><br />{billingAddress.address_line_2}</>}
            <br />{billingAddress.city}{billingAddress.state ? `, ${billingAddress.state}` : ""} {billingAddress.postcode}
            <br />{billingAddress.country}
            {billingAddress.phone && <><br />{billingAddress.phone}</>}
          </address>
        ) : (
          <p className="text-sm text-zinc-400 dark:text-zinc-500">No billing address on file.</p>
        )}
      </div>

      {/* Orders */}
      <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Order History
          </h2>
        </div>

        {ordersLoading ? (
          <div className="px-6 py-12 text-center text-sm text-zinc-400">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="mt-3 inline-block text-sm font-medium text-zinc-900 underline dark:text-white"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {orders.map((order) => (
              <li key={order.id}>
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {order.order_number}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[order.status] ?? "bg-zinc-100 text-zinc-600"}`}>
                      {order.status}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${PAYMENT_STYLES[order.payment_status] ?? "bg-zinc-100 text-zinc-600"}`}>
                      {order.payment_status}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {order.currency} {parseFloat(order.total).toFixed(2)}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${expandedOrder === order.id ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedOrder === order.id && (
                  <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-zinc-400 dark:text-zinc-500">
                          <th className="pb-2 font-medium">Product</th>
                          <th className="pb-2 font-medium">SKU</th>
                          <th className="pb-2 text-right font-medium">Qty</th>
                          <th className="pb-2 text-right font-medium">Unit</th>
                          <th className="pb-2 text-right font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-2 font-medium text-zinc-900 dark:text-white">{item.product_name}</td>
                            <td className="py-2 text-zinc-400">{item.product_sku ?? "—"}</td>
                            <td className="py-2 text-right text-zinc-600 dark:text-zinc-400">{item.quantity}</td>
                            <td className="py-2 text-right text-zinc-600 dark:text-zinc-400">{parseFloat(item.unit_price).toFixed(2)}</td>
                            <td className="py-2 text-right font-medium text-zinc-900 dark:text-white">{parseFloat(item.total).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
