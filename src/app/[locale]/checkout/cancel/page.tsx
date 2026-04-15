import Link from "next/link";

export const metadata = {
  title: "Payment Cancelled — Zoom",
};

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
          </svg>
        </span>
      </div>
      <h1 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-white">Payment Cancelled</h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        Your payment was cancelled. Your cart has been saved — you can return and try again whenever you're ready.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/cart"
          className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Return to Cart
        </Link>
        <Link
          href="/"
          className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
