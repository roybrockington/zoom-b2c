"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function CookieBar() {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookie");

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-zinc-200 bg-white px-4 py-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t("message")}{" "}
          <Link href="/privacy-policy" className="underline hover:text-zinc-900 dark:hover:text-white">
            {t("privacyPolicy")}
          </Link>
          {". "}{t("seeAlso")}{" "}
          <Link href="/imprint" className="underline hover:text-zinc-900 dark:hover:text-white">
            {t("imprint")}
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
