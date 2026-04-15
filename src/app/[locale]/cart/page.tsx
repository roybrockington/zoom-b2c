"use client";

import { useCart } from "../../components/CartContext";
import { useAuth } from "../../components/AuthContext";
import { useCurrency, formatPrice } from "../../components/CurrencyContext";
import Image from "next/image";
import Link from "next/link";

const IMG_BASE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";

export default function CartPage() {
  const { items, removeItem, updateQty, totalItems } = useCart();
  const { user } = useAuth();
  const { currency } = useCurrency();

  const subtotal = items.reduce((sum, item) => {
    const price = currency.code === "GBP" && item.price_uk
      ? parseFloat(item.price_uk)
      : parseFloat(item.price);
    return sum + price * item.quantity;
  }, 0);

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-white">Your cart is empty</h1>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">Add some products to get started.</p>
        <Link
          href="/"
          className="inline-block rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">Your Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        {/* Line items */}
        <div className="lg:col-span-2">
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((item) => {
              const unitPrice = currency.code === "GBP" && item.price_uk
                ? parseFloat(item.price_uk)
                : parseFloat(item.price);
              const lineTotal = unitPrice * item.quantity;
              const imgSrc = item.img ? `${IMG_BASE}${item.img}` : null;

              return (
                <li key={item.id} className="flex gap-4 py-4">
                  {/* Image */}
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        sizes="112px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-semibold text-zinc-900 hover:underline dark:text-white"
                    >
                      Zoom {item.name}
                    </Link>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {currency.symbol}{unitPrice.toLocaleString(currency.code === "GBP" ? "en-GB" : "de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each
                    </p>

                    {/* Qty controls */}
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-zinc-200 dark:border-zinc-700">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-lg text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium text-zinc-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-lg text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-zinc-400 underline transition hover:text-red-500 dark:hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-right">
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {currency.symbol}{lineTotal.toLocaleString(currency.code === "GBP" ? "en-GB" : "de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Order Summary
            </h2>

            <dl className="mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </dt>
                <dd className="font-semibold text-zinc-900 dark:text-white">
                  {currency.symbol}{subtotal.toLocaleString(currency.code === "GBP" ? "en-GB" : "de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">Shipping</dt>
                <dd className="text-zinc-500 dark:text-zinc-400">Calculated at checkout</dd>
              </div>
            </dl>

            <div className="mb-6 border-t border-zinc-100 pt-4 dark:border-zinc-800">
              <div className="flex justify-between text-base font-bold">
                <span className="text-zinc-900 dark:text-white">Total</span>
                <span className="text-zinc-900 dark:text-white">
                  {currency.symbol}{subtotal.toLocaleString(currency.code === "GBP" ? "en-GB" : "de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {user ? (
              <Link
                href="/checkout"
                className="block w-full rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Proceed to Checkout
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  className="block w-full rounded-full bg-zinc-900 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Sign in to Checkout
                </Link>
                <Link
                  href="/register"
                  className="block w-full rounded-full border border-zinc-300 px-6 py-3 text-center text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Create an Account
                </Link>
                <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
                  You must be signed in to complete your purchase.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
