"use client";

import { useCurrency, formatPrice } from "./CurrencyContext";

type Props = {
  price: string;
  salePrice: string | null;
  priceUk: string | null;
};

export default function ProductPrice({ price, salePrice, priceUk }: Props) {
  const { currency } = useCurrency();

  const effectiveEur = salePrice ?? price;
  const displayPrice = formatPrice(effectiveEur, priceUk, currency);
  const originalPrice = salePrice ? formatPrice(price, null, currency) : null;

  if (!displayPrice) return null;

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-sm font-semibold text-zinc-900 dark:text-white">
        {currency.symbol}{displayPrice}
      </span>
      {originalPrice && (
        <span className="text-xs text-zinc-400 line-through">
          {currency.symbol}{originalPrice}
        </span>
      )}
    </div>
  );
}
