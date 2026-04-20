"use client";

import { useState } from "react";
import { useCart } from "../../../components/CartContext";

type Props = {
  id: number;
  slug: string;
  name: string;
  price: string;
  price_uk: string | null;
  img: string | null;
  inStock: boolean;
};

export default function AddToCartButton({ id, slug, name, price, price_uk, img, inStock }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem({ id, slug, name, price, price_uk, img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className="flex-1 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
