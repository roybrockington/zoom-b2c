"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../components/AuthContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@i18n/navigation";
import { Link } from "@i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? null;
  const isWarrantyRedirect = redirect === "/warranty-extension";
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Forgot password state
  const [view, setView] = useState<"login" | "forgot">("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace((redirect ?? (user.is_admin ? "/admin" : "/account")) as any);
    }
  }, [user, loading, router, redirect]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      router.push((redirect ?? (loggedInUser?.is_admin ? "/admin" : "/account")) as any);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotError(null);
    setForgotSubmitting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      setForgotSent(true);
    } catch {
      setForgotError("Something went wrong. Please try again.");
    } finally {
      setForgotSubmitting(false);
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

        {isWarrantyRedirect && view === "login" && (
          <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-base font-bold text-zinc-900 dark:text-white">Warranty Extension</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              By registering your product within three months from the date of purchase (as indicated on the proof of purchase), you will receive a 1-year warranty extension on your ZOOM product. A free customer account in our web shop is required for product registration.
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {view === "login" ? (
            <>
              <h1 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
                Sign in to your account
              </h1>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
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
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setView("forgot"); setForgotEmail(email); }}
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {t("forgotPassword")}
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-1 w-full rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </button>
              </form>
              <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Don't have an account?{" "}
                <Link href={redirect ? { pathname: "/register", query: { redirect } } as any : "/register"} className="font-medium text-zinc-900 underline dark:text-white">
                  Create one
                </Link>
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">
                {t("forgotPasswordTitle")}
              </h1>
              <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                {t("forgotPasswordDesc")}
              </p>

              {forgotSent ? (
                <p className="rounded-lg bg-green-50 px-3 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {t("resetEmailSent")}
                </p>
              ) : (
                <form onSubmit={handleForgot} className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Email
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
                      placeholder="you@example.com"
                    />
                  </div>

                  {forgotError && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {forgotError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="mt-1 w-full rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    {forgotSubmitting ? t("sending") : t("sendResetLink")}
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => { setView("login"); setForgotSent(false); setForgotError(null); }}
                className="mt-5 flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <span>←</span> {t("backToLogin")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
