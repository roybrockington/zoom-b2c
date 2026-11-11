import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: t("successMetaTitle") };
}

export default async function CheckoutSuccessPage() {
  const t = await getTranslations("checkout");
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <div className="mb-6 flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </div>
      <h1 className="mb-3 text-2xl font-bold text-zinc-900 dark:text-white">{t("successTitle")}</h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {t("successBody")}
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/account"
          className="rounded-full bg-zinc-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {t("viewOrders")}
        </Link>
        <Link
          href="/"
          className="rounded-full border border-zinc-300 px-8 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {t("continueShoppingButton")}
        </Link>
      </div>
    </div>
  );
}
