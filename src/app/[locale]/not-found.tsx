import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-8">
        <Image src="/logo.svg" alt="ZOOM Europe" width={160} height={70} priority />
      </Link>

      <p className="mb-2 text-8xl font-bold tracking-tight text-zinc-900 dark:text-white">
        404
      </p>
      <h1 className="mb-3 text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
        Page not found
      </h1>
      <p className="mb-8 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Back to home
        </Link>
        <Link
          href="/categories/handy-recorders"
          className="rounded-full border border-zinc-300 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
