import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Mic, Film, Guitar, Headphones, type LucideIcon } from "lucide-react";

const IMG_BASE = "https://media.sound-service.eu/zoom/home-profession/";

const tiles: { key: string; icon: LucideIcon; image: string; link: string }[] = [
    { key: "podcasting",  icon: Mic,        image: "podcaster.webp",     link: "/podcasting"  },
    { key: "filmmaking",  icon: Film,       image: "filmmaker.webp",     link: "/filmmaking"  },
    { key: "music",       icon: Guitar,     image: "musician.webp",      link: "/music"       },
    { key: "soundDesign", icon: Headphones, image: "sounddesigner.webp", link: "/sound-design"},
];

export default async function Creators() {
  const t = await getTranslations("home.creators");

  if (tiles.length === 0) return null;

  return (
    <section id="creators" className="py-10">
      <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
        {t("title")}
      </h2>
      <p className="my-7">
        {t("body")} <strong>{t("bodyBold")}</strong> {t("bodyEnd")}
      </p>
      <div className="w-full flex flex-col md:flex-row flex-wrap">
        {tiles.map(tile => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.key}
              className="md:w-1/2 h-72 relative bg-cover bg-center border border-white"
              style={{ backgroundImage: `url(${IMG_BASE}${tile.image})` }}
            >
              <Link href={tile.link} className="absolute inset-0 flex items-center gap-2 px-4 py-2 bg-black/40 text-white hover:bg-black/60 transition-colors justify-center">
                <Icon size={20} />
                <span className="font-semibold text-xl">{t(tile.key as "podcasting" | "filmmaking" | "music" | "soundDesign")}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
