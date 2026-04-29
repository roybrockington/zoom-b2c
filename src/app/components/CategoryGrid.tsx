import Image from "next/image";
import Link from "next/link";

const LOCALE_PREFIXES = ["de", "fr", "nl", "pl", "cz"];

type Category = {
  id: number;
  name: string;
  slug: string;
  img: string | null;
};

async function getCategories(locale: string): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?locale=${locale}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function CategoryGrid({ locale = "en" }: { locale?: string }) {
  const categories = await getCategories(locale);
  const localeBase = LOCALE_PREFIXES.includes(locale) ? `/${locale}` : "";
  if (categories.length === 0) return null;

  return (
    <section className="py-10">
      <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`${localeBase}/categories/${cat.slug}`}
            className="group relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
          >
            {/* Image */}
            <div className="relative aspect-3/4 w-full">
              {cat.img ? (
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                <div className="h-full w-full bg-zinc-200 dark:bg-zinc-700" />
              )}
              {/* Dark gradient at bottom */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            </div>

            {/* Name */}
            <span className="absolute bottom-0 left-0 right-0 px-3 py-2.5 text-md font-bold tracking-wide text-white">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
