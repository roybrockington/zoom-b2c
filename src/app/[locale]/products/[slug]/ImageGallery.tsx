"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const IMG_MAIN  = "https://media.sound-service.eu/Artikelbilder/Shopsystem/890x486/";
const IMG_THUMB = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";
const IMG_LARGE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/1200x837/";

export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const openLightbox  = () => setLightbox(true);
  const closeLightbox = () => setLightbox(false);

  const prev = useCallback(() => setActive(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     closeLightbox();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, prev, next]);

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[890/486] w-full items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-400 dark:bg-zinc-800">
        No image available
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main image — click to open lightbox */}
        <button
          onClick={openLightbox}
          className="relative aspect-[890/486] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 cursor-zoom-in group"
          aria-label="Enlarge image"
        >
          <Image
            key={images[active]}
            src={`${IMG_MAIN}${images[active]}`}
            alt={name}
            fill
            priority
            className="object-contain p-4 transition group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Zoom hint */}
          <span className="absolute bottom-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 group-hover:opacity-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zm3-8H8m3-3v6" />
            </svg>
          </span>
        </button>

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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          {/* Image container — stop propagation so clicking image doesn't close */}
          <div
            className="relative flex items-center justify-center w-full h-full max-w-5xl px-16"
            onClick={e => e.stopPropagation()}
          >
            <Image
              key={images[active]}
              src={`${IMG_LARGE}${images[active]}`}
              alt={name}
              fill
              className="object-contain p-4"
              sizes="100vw"
            />
          </div>

          {/* Close */}
          <button
            onClick={closeLightbox}
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/25"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev / Next — only when multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); next(); }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/25"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setActive(i); }}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
