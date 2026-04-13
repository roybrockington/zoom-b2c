import Link from "next/link";
import { Mic, Film, Guitar, Headphones, type LucideIcon } from "lucide-react";

const IMG_BASE = "https://media.sound-service.eu/zoom/home-profession/";

const tiles: { name: string; icon: LucideIcon; image: string; link: string }[] = [
    { name: "Podcasting",  icon: Mic,        image: "podcaster.webp",     link: "/podcasting"  },
    { name: "Filmmaking",  icon: Film,       image: "filmmaker.webp",     link: "/filmmaking"  },
    { name: "Music",       icon: Guitar,     image: "musician.webp",      link: "/music"       },
    { name: "Sound Design",icon: Headphones, image: "sounddesigner.webp", link: "/sound-design"},
];

export default async function Creators() {

  if (tiles.length === 0) return null;

  return (
    <section id="mostWanted" className="py-10">
      <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
        We're for Creators
      </h2>
      <p className="my-7">Even at the development stage, we look at how our products can help creators unleash their creativity. <span className="font-bold">Select your profession here</span> or scroll down to select by product category.</p>
      <div className="w-full flex flex-wrap">
        {tiles.map(tile => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.name}
              className="md:w-1/2 h-72 relative bg-cover bg-center border border-white"
              style={{ backgroundImage: `url(${IMG_BASE}${tile.image})` }}
            >
              <Link href={tile.link} className="absolute inset-0 flex items-center gap-2 px-4 py-2 bg-black/40 text-white hover:bg-black/60 transition-colors justify-center">
                <Icon size={20} />
                <span className="font-semibold text-xl">{tile.name}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

