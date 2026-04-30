import Image from "next/image";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "About Us — Zoom",
  description: "Learn more about Zoom.",
};

const IMG_BASE = "https://media.sound-service.eu/zoom/";

const tiles = [
  { key: "tile1", image: "category-seo/handy-recorders/zoom-h4-handy-recorder.webp" },
  { key: "tile2", image: "category-seo/handy-recorders/zoom-h6-handy-recorder.webp" },
  { key: "tile3", image: "pages/zoom-in-europe.webp" },
  { key: "tile4", image: "pages/zoom-about-berlin.webp" },
];

export default async function AboutUsPage() {
  const t = await getTranslations("aboutUs");

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden bg-zinc-900 sm:h-72 lg:h-80">
        <Image
          src="https://media.sound-service.eu/zoom/pages/zoom-about-head.webp"
          alt={t("title")}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-4">
        <p className="text-zinc-600 dark:text-zinc-300">{t("p1")}</p>
        <p className="text-zinc-600 dark:text-zinc-300">{t("p2")}</p>
        <p className="text-zinc-600 dark:text-zinc-300">{t("p3")}</p>

        <div className="w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          {tiles.map((tile, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={tile.key}
                className={`flex flex-col gap-14 py-12 md:flex-row md:items-center ${isEven ? "" : "md:flex-row-reverse"}`}
              >
                <div className="md:w-2/5 shrink-0">
                  <Image
                    src={`${IMG_BASE}${tile.image}`}
                    alt=""
                    width={600}
                    height={400}
                    className="w-full rounded-xl object-cover"
                  />
                </div>
                <div className="md:w-3/5">
                  <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {t(tile.key as Parameters<typeof t>[0])}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
