import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ProductPrice from "../../../components/ProductPrice";

const IMG_BASE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";

type Product = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  price: string;
  sale_price: string | null;
  effective_price: string;
  price_uk: string | null;
  img1: string | null;
};

async function getSaleProducts(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?filter[sale]=1&per_page=200`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function generateMetadata() {
  return {
    title: "Sale - ZOOM EUROPE",
  };
}

export default async function SalePage() {
  const [products, t] = await Promise.all([getSaleProducts(), getTranslations("category")]);

  return (
    <div>
      {/* Hero header */}
      <div className="relative h-56 w-full overflow-hidden bg-zinc-900 sm:h-72 lg:h-80">
        <Image
          src="https://media.sound-service.eu/zoom/category-header/cat-sale.jpg"
          alt="Sale"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Sale
            </h1>
            <p className="mt-3 max-w-xl text-sm text-zinc-300 sm:text-base">
              End-Of-Life and B-Stock* items from ZOOM on SALE at special prices! Secure discount now!
            </p>
            <p className="mt-2 max-w-xl text-xs text-zinc-400">
              * Tested, technically flawless product with complete accessories and full warranty. Possibly with minimal signs of usage or chipped packaging.
            </p>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">{t("noProducts")}</p>
        ) : (
          <>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              {products.length} {products.length === 1 ? t("product") : t("products")}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {products.map((product) => {
                const imgSrc = product.img1 ? `${IMG_BASE}${product.img1}` : null;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <div className="relative aspect-[278/148] w-full dark:bg-zinc-800">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={product.name}
                          fill
                          className="object-contain p-2 transition duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                          {t("noImage")}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-3">
                      <p className="line-clamp-2 text-lg font-bold leading-snug text-zinc-800 dark:text-zinc-100">
                        Zoom {product.name}
                      </p>
                      {product.short_description && (
                        <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {product.short_description}
                        </p>
                      )}
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
          </>
        )}
      </div>
    </div>
  );
}
