"use client";

import { useCurrency, formatPrice } from "../../../components/CurrencyContext";

type Props = {
  price: string;
  salePrice: string | null;
  priceUk: string | null;
  discountPct: number | null;
};

export default function ProductPagePrice({ price, salePrice, priceUk, discountPct }: Props) {
  const { currency } = useCurrency();

  const effectiveEur = salePrice ?? price;
  const displayPrice = formatPrice(effectiveEur, priceUk, currency);
  const originalPrice = salePrice ? formatPrice(price, null, currency) : null;

  if (!displayPrice) return null;

  return (
    <div className="flex items-baseline gap-3">
      <span className="text-3xl font-bold text-zinc-900 dark:text-white">
        {currency.symbol}{displayPrice}
      </span>
      {originalPrice && (
        <>
          <span className="text-lg text-zinc-400 line-through">
            {currency.symbol}{originalPrice}
          </span>
          {discountPct && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
              -{discountPct}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
