import Construction from "@/app/components/Construction";

export const metadata = {
  title: "Returns — Zoom",
  description: "Returns policy and information.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
        Returns
      </h1>
            <Construction />
{/*      <iframe
        className="embed-responsive-item lazyload mt-4 w-full h-screen"
        src="https://return.4sellers.de/?key=WVQYQAKKKL&displayMode=1&lang=EN"
      />
      */}
    </div>
  );
}
