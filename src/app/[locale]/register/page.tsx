"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../components/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const TURNSTILE_SITE_KEY = "0x4AAAAAADGXBHifGNNPydMV";

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default function RegisterPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWarrantyRedirect = searchParams.get("redirect") === "/warranty-extension";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const widgetRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && user) router.replace("/account");
  }, [user, loading, router]);

  useEffect(() => {
    const scriptId = "cf-turnstile-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const interval = setInterval(() => {
      if (window.turnstile && containerRef.current && !widgetRef.current) {
        widgetRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(null),
          "error-callback": () => setTurnstileToken(null),
        });
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (window.turnstile && widgetRef.current) {
        window.turnstile.remove(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the human verification.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          cf_turnstile_response: turnstileToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const firstError =
          (Object.values(data?.errors ?? {}) as string[][])?.[0]?.[0] ??
          data?.message ??
          "Registration failed.";
        // Reset widget on failure so user can retry
        if (window.turnstile && widgetRef.current) {
          window.turnstile.reset(widgetRef.current);
          setTurnstileToken(null);
        }
        throw new Error(firstError as string);
      }

      await login(email, password);
      router.push(isWarrantyRedirect ? "/warranty-extension" : "/account");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Image src="/logo.svg" alt="Zoom" width={140} height={60} />
          </Link>
        </div>

        {isWarrantyRedirect && (
          <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-base font-bold text-zinc-900 dark:text-white">Warranty Extension</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              By registering your product within three months from the date of purchase (as indicated on the proof of purchase), you will receive a 1-year warranty extension on your ZOOM product. A free customer account in our web shop is required for product registration.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
            Create an account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label htmlFor="password_confirmation" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Confirm password
              </label>
              <input
                id="password_confirmation"
                type="password"
                autoComplete="new-password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
                placeholder="••••••••"
              />
            </div>

            {/* Turnstile widget */}
            <div ref={containerRef} />

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !turnstileToken}
              className="mt-1 w-full rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-zinc-900 underline dark:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
