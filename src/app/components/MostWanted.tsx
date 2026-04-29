import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./ProductPrice";
import { getTranslations } from "next-intl/server";

const IMG_BASE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";

type Product = {
  id: number;
  name: string;
  short_description: string | null;
  slug: string;
  price: string;
  sale_price: string | null;
  effective_price: string;
  price_uk: string | null;
  img1: string | null;
};

async function getWantedProducts(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?filter[wanted]=1&per_page=12`,
    { next: { revalidate: 300 } }
  );

  if (!res.ok) return [];

  const json = await res.json();
  return json.data ?? [];
}

export default async function MostWanted() {
  const [products, t] = await Promise.all([getWantedProducts(), getTranslations("mostWanted")]);

  if (products.length === 0) return null;

  return (
    <section id="mostWanted" className="py-10">
      <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
        {t("title")}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {products.map((product) => {
          const imgSrc = product.img1 ? `${IMG_BASE}${product.img1}` : null;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Image */}
              <div className="relative aspect-278/148 w-full">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={product.name}
                    fill
                    className="object-contain p-2 transition group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-1 p-3">
                <p className="line-clamp-2 text-lg font-bold leading-snug text-zinc-800 dark:text-zinc-100">
                  Zoom {product.name}
                </p>
                <p className="text-sm">{product.short_description}</p>
                <div className="mt-auto pt-2">
                  <ProductPrice
                    price={product.price}
                    salePrice={product.sale_price}
                    priceUk={product.price_uk}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
