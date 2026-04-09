"use client";

import Image from "next/image";
import { useState } from "react";

const IMG_MAIN = "https://media.sound-service.eu/Artikelbilder/Shopsystem/890x486/";
const IMG_THUMB = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";

export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[890/486] w-full items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-800">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-[890/486] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <Image
          key={images[active]}
          src={`${IMG_MAIN}${images[active]}`}
          alt={name}
          fill
          priority
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active
                  ? "border-zinc-900 dark:border-white"
                  : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
              }`}
            >
              <Image
                src={`${IMG_THUMB}${img}`}
                alt={`${name} view ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
