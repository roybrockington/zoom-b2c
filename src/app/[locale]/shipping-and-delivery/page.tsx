export const metadata = {
  title: "Shipping & Delivery — Zoom",
  description: "International carriage charges and delivery information.",
};

const shippingRates = [
  { region: "United Kingdom", carrier: "DHL / UPS", standard: "£4.99", express: "£9.99", freeOver: "£50" },
  { region: "Germany", carrier: "DHL", standard: "€3.99", express: "€7.99", freeOver: "€50" },
  { region: "France", carrier: "DHL", standard: "€5.99", express: "€10.99", freeOver: "€75" },
  { region: "Netherlands", carrier: "DHL", standard: "€4.99", express: "€8.99", freeOver: "€50" },
  { region: "Poland", carrier: "DHL / UPS", standard: "€5.99", express: "€11.99", freeOver: "€75" },
  { region: "Czech Republic", carrier: "DHL / UPS", standard: "€5.99", express: "€11.99", freeOver: "€75" },
  { region: "Rest of Europe", carrier: "DHL / UPS", standard: "€8.99", express: "€14.99", freeOver: "€100" },
  { region: "Rest of World", carrier: "UPS", standard: "€14.99", express: "€24.99", freeOver: "—" },
];

export default function ShippingAndDeliveryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
        Shipping &amp; Delivery
      </h1>
      <p className="mt-4 text-zinc-500 dark:text-zinc-400">
        We ship worldwide. Delivery times and carriage charges vary by destination.
      </p>

      <div className="mt-10 overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">Region</th>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">Carrier</th>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">Standard</th>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">Express</th>
              <th className="px-6 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">Free over</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
            {shippingRates.map((row) => (
              <tr key={row.region} className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{row.region}</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{row.carrier}</td>
                <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{row.standard}</td>
                <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{row.express}</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">{row.freeOver}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-zinc-400 dark:text-zinc-500">
        All prices include VAT where applicable. Delivery times are estimates and may vary. Express delivery is next working day for most destinations.
      </p>
    </div>
  );
}
