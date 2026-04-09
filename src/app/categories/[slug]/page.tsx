import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const IMG_BASE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  img: string | null;
  header: string | null;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  price: string;
  sale_price: string | null;
  effective_price: string;
  img1: string | null;
};

async function getCategory(slug: string): Promise<Category | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${slug}`,
    { next: { revalidate: 300 } }
  );
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

async function getCategoryProducts(categoryId: number): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?filter[category_id]=${categoryId}&per_page=100`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  return {
    title: category ? `${category.name} — Zoom` : "Category — Zoom",
    description: category?.description ?? undefined,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const products = await getCategoryProducts(category.id);

  return (
    <div>
      {/* Hero header */}
      <div className="relative h-56 w-full overflow-hidden bg-zinc-900 sm:h-72 lg:h-80">
        {category.header && (
          <Image
            src={category.header}
            alt={category.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-3 max-w-xl text-sm text-zinc-300 sm:text-base">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">No products found in this category.</p>
        ) : (
          <>
            <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
              {products.map((product) => {
                const hasDiscount = product.sale_price !== null;
                const imgSrc = product.img1 ? `${IMG_BASE}${product.img1}` : null;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <div className="relative aspect-[278/148] w-full bg-zinc-100 dark:bg-zinc-800">
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
                          No image
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
                      <div className="mt-auto flex items-baseline gap-1.5 pt-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                          €{product.effective_price}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-zinc-400 line-through">
                            €{product.price}
                          </span>
                        )}
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
