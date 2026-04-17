"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ProductPrice from "../../components/ProductPrice";

const IMG_BASE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";

type Product = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  price: string;
  sale_price: string | null;
  price_uk: string | null;
  img1: string | null;
  category: { name: string; slug: string } | null;
};

export default function SearchPage() {
  const t = useTranslations("search");
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    const params = new URLSearchParams({
      "filter[search]": q,
      include: "category",
      per_page: "40",
      sort: "name",
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.data ?? []);
        setTotal(d.meta?.total ?? d.data?.length ?? 0);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        {t("title")}
      </h1>

      {q && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {loading ? (
            t("searching")
          ) : products.length > 0 ? (
            <>{total} {t("resultsFor")} &ldquo;<span className="font-medium text-zinc-700 dark:text-zinc-300">{q}</span>&rdquo;</>
          ) : (
            <>{t("noResults")} &ldquo;<span className="font-medium text-zinc-700 dark:text-zinc-300">{q}</span>&rdquo;</>
          )}
        </p>
      )}

      {!q && (
        <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">{t("emptyQuery")}</p>
      )}

      {loading && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[278/148] w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
          ))}
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => {
            const imgSrc = product.img1 ? `${IMG_BASE}${product.img1}` : null;
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="relative aspect-[278/148] w-full bg-white dark:bg-zinc-800">
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
                  {product.category && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {product.category.name}
                    </span>
                  )}
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
      )}

      {!loading && q && products.length === 0 && (
        <p className="mt-10 text-sm text-zinc-400 dark:text-zinc-500">{t("tryDifferent")}</p>
      )}
    </div>
  );
}
