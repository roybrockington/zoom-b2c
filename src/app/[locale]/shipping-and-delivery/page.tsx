import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Shipping & Delivery — Zoom",
  description: "International carriage charges and delivery information.",
};

export default async function ShippingAndDeliveryPage() {
  const t = await getTranslations("shipping");

  const shippingRates = [
//    { regionKey: "regionUK", carrier: "DHL / UPS", standard: "£4.99", express: "£9.99", freeOver: "£50" },
    { regionKey: "regionDE", carrier: "DHL",        standard: "€5.99", freeOver: "€50" },
    { regionKey: "regionFR", carrier: "DHL",        standard: "€5.99", freeOver: "€75" },
    { regionKey: "regionNL", carrier: "DHL",        standard: "€5.99", freeOver: "€50" },
    { regionKey: "regionPL", carrier: "DHL / UPS",  standard: "€5.99", freeOver: "€75" },
    { regionKey: "regionCZ", carrier: "DHL / UPS",  standard: "€5.99", freeOver: "€75" },
    { regionKey: "regionEU", carrier: "DHL / UPS",  standard: "€5.99", freeOver: "€100" },
//    { regionKey: "regionWorld", carrier: "UPS",     standard: "€14.99", freeOver: "—" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
        {t("title")}
      </h1>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400">
        {t("subtitle")}
      </p>

      <div className="mt-10 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">{t("colRegion")}</th>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">{t("colCarrier")}</th>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">{t("colStandard")}</th>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">{t("colExpress")}</th>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">{t("colFreeOver")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {shippingRates.map((row) => (
              <tr key={row.regionKey} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{t(row.regionKey as Parameters<typeof t>[0])}</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{row.carrier}</td>
                <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{row.standard}</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{row.freeOver}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-zinc-400 dark:text-zinc-500">
        {t("footnote")}
      </p>
    </div>
  );
}
