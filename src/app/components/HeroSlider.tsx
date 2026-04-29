"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

type Slide = {
  heading: string;
  subheading: string;
  linkText: string;
  linkUrl: string;
  imageUrl: string;
};

const slideData = [
  {
    heading: "ESSENTIAL SERIES",
    subheading: "32-Bit-Float",
    linkUrl: "/categories/handy-recorders",
    imageUrl: "https://media.sound-service.eu/zoom/home-slides/HARessential.webp",
  },
  {
    heading: "L6 LIVETRAK",
    subheading: "10-TRACK DIGITAL MIXER/RECORDER",
    linkUrl: "/products/livetrak-l6-eu-10-channel-mixer-recorder-eu",
    imageUrl: "https://media.sound-service.eu/zoom/home-slides/L6_Livetrak_Banner.webp",
  }
];

const AUTOPLAY_INTERVAL = 5000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = useTranslations("home.heroSlider");
  const slides = slideData.map(s => ({ ...s, linkText: t("showMore") }));

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  return (
    <div
      className="relative w-full overflow-hidden bg-zinc-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative min-w-full">
            <div className="relative h-[420px] w-full sm:h-[500px] lg:h-[560px]">
              <Image
                src={slide.imageUrl}
                alt={slide.heading}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            </div>

            {/* Text content */}
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-300">
                  {slide.subheading}
                </p>
                <h2 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                  {slide.heading}
                </h2>
                <Link
                  href={slide.linkUrl}
                  className="mt-6 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                >
                  {slide.linkText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
