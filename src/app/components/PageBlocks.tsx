import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./ProductPrice";

const IMG_BASE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";

type BlockProduct = {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price: string | null;
  price_uk: string | null;
  img1: string | null;
  short_description: string | null;
};

type Block = {
  title: string;
  products: BlockProduct[];
};

async function getBlocks(page: string): Promise<Block[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/blocks/${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function PageBlocks({ page }: { page: string }) {
  const blocks = await getBlocks(page);

  if (blocks.length === 0) return null;

  return (
    <div className="flex flex-col gap-16">
      {blocks.map((block) => (
        <section key={block.title}>
          <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
            {block.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {block.products.map((product) => {
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
                        className="object-contain p-2 transition group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-3">
                    <p className="line-clamp-2 text-sm font-bold leading-snug text-zinc-800 dark:text-zinc-100">
                      Zoom {product.name}
                    </p>
                    {product.short_description && (
                      <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
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
        </section>
      ))}
    </div>
  );
}
