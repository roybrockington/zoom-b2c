import { notFound } from "next/navigation";
import ImageGallery from "./ImageGallery";
import ProductPagePrice from "./ProductPagePrice";
import AddToCartButton from "./AddToCartButton";

type ProductDescriptions = {
  description: string | null;
  short_description: string | null;
  description_de: string | null;
  short_description_de: string | null;
  description_fr: string | null;
  description_nl: string | null;
  description_cz: string | null;
  description_pl: string | null;
  short_description_fr: string | null;
  short_description_nl: string | null;
  short_description_cz: string | null;
  short_description_pl: string | null;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  price: string;
  sale_price: string | null;
  effective_price: string;
  price_uk: string | null;
  in_stock: boolean;
  sku: string | null;
  stock_quantity: number;
  in_stock: boolean;
  manage_stock: boolean;
  weight: string | null;
  attributes: Record<string, string> | null;
  img1: string | null;
  img2: string | null;
  img3: string | null;
  img4: string | null;
  img5: string | null;
  img6: string | null;
  category: { id: number; name: string; slug: string } | null;
  descriptions: ProductDescriptions | null;
};

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}?include=category,productDescription`,
    { next: { revalidate: 300 } }
  );
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

function resolveDescriptions(
  descriptions: ProductDescriptions | null,
  locale: string
): { description: string | null; short_description: string | null } {
  if (!descriptions) return { description: null, short_description: null };

  switch (locale) {
    case "de":
      return {
        description: descriptions.description_de ?? descriptions.description ?? null,
        short_description: descriptions.short_description_de ?? descriptions.short_description ?? null,
      };
    case "fr":
      return {
        description: descriptions.description_fr ?? descriptions.description ?? null,
        short_description: descriptions.short_description_fr ?? descriptions.short_description ?? null,
      };
    case "nl":
      return {
        description: descriptions.description_nl ?? descriptions.description ?? null,
        short_description: descriptions.short_description_nl ?? descriptions.short_description ?? null,
      };
    case "cz":
      return {
        description: descriptions.description_cz ?? descriptions.description ?? null,
        short_description: descriptions.short_description_cz ?? descriptions.short_description ?? null,
      };
    case "pl":
      return {
        description: descriptions.description_pl ?? descriptions.description ?? null,
        short_description: descriptions.short_description_pl ?? descriptions.short_description ?? null,
      };
    default: // en
      return {
        description: descriptions.description ?? null,
        short_description: descriptions.short_description ?? null,
      };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params;
  const product = await getProduct(slug);
  const { short_description } = resolveDescriptions(product?.descriptions ?? null, locale);
  return {
    title: product ? `Zoom ${product.name} — Zoom` : "Product — Zoom",
    description: short_description ?? undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const hasDiscount = product.sale_price !== null;
  const discountPct = hasDiscount
    ? Math.round((1 - parseFloat(product.sale_price!) / parseFloat(product.price)) * 100)
    : null;

  const images = [
    product.img1, product.img2, product.img3,
    product.img4, product.img5, product.img6,
  ].filter((img): img is string => !!img);

  const { description, short_description } = resolveDescriptions(product.descriptions, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <a href="/" className="hover:text-zinc-600 dark:hover:text-zinc-300">Home</a>
        <span>/</span>
        {product.category && (
          <>
            <a
              href={`/categories/${product.category.slug}`}
              className="hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              {product.category.name}
            </a>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-600 dark:text-zinc-300">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Left — image gallery */}
        <ImageGallery images={images} name={product.name} />

        {/* Right — product info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Zoom
            </p>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {product.name}
            </h1>
            {short_description && (
              <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
                {short_description}
              </p>
            )}
          </div>

          {/* Price */}
          <ProductPagePrice
            price={product.price}
            salePrice={product.sale_price}
            priceUk={product.price_uk}
            discountPct={discountPct}
          />

          {/* Stock status */}
          <div className="flex items-center gap-2 text-sm">
            {product.in_stock ? (
              <>
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-green-600 dark:text-green-400">In stock</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-red-600 dark:text-red-400">Out of stock</span>
              </>
            )}
          </div>

          {/* Add to cart */}
          <div className="flex gap-3">
            <AddToCartButton
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.effective_price}
              price_uk={product.price_uk}
              img={product.img1}
              inStock={product.in_stock}
            />
          </div>

          {/* Meta */}
          <dl className="divide-y divide-zinc-100 border-t border-zinc-100 text-sm dark:divide-zinc-800 dark:border-zinc-800">
            {product.sku && (
              <div className="flex justify-between py-2.5">
                <dt className="text-zinc-500 dark:text-zinc-400">SKU</dt>
                <dd className="font-medium text-zinc-900 dark:text-white">{product.sku}</dd>
              </div>
            )}
            {product.category && (
              <div className="flex justify-between py-2.5">
                <dt className="text-zinc-500 dark:text-zinc-400">Category</dt>
                <dd>
                  <a
                    href={`/categories/${product.category.slug}`}
                    className="font-medium text-zinc-900 hover:underline dark:text-white"
                  >
                    {product.category.name}
                  </a>
                </dd>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between py-2.5">
                <dt className="text-zinc-500 dark:text-zinc-400">Weight</dt>
                <dd className="font-medium text-zinc-900 dark:text-white">{product.weight} kg</dd>
              </div>
            )}
            {product.attributes && Object.entries(product.attributes).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2.5">
                <dt className="capitalize text-zinc-500 dark:text-zinc-400">{key}</dt>
                <dd className="font-medium text-zinc-900 dark:text-white">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="mt-16 border-t border-zinc-100 pt-10 dark:border-zinc-800">
          <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">Product Details</h2>
          <div
            className="prose prose-zinc max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
    </div>
  );
}
