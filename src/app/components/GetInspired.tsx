import Link from "next/link";
import { Mic, Film, Guitar, Headphones, type LucideIcon } from "lucide-react";

const IMG_BASE = "https://media.sound-service.eu/zoom/";

const tiles: { name: string; description: string; image: string; link: string }[] = [
    { name: "Music",       image: "category-seo/inspiration-musicians.webp",      link: "/music", description: "Musicians never stop creating, sampling, recording, mixing and listening."       },
    { name: "Podcasting",  image: "category-seo/inspiration-podcasters.webp",     link: "/podcasting", description: "Creators are evolving - and so are we."   },
    { name: "Filmmaking",  image: "category-seo/inspiration-filmmakers.webp",     link: "/filmmaking", description: "Sound is a vital part of your work."  },
    { name: "Sound Design",image: "category-seo/inspiration-sounddesigners.webp", link: "/sound-design", description: "Design is how it works." },
    { name: "About Us",image: "pages/zoom-about-head.webp", link: "/about-us", description: "We're ZOOM. And We're For Creators." },
];

export default async function GetInspired() {

    if (tiles.length === 0) return null;

    return (
        <section id="mostWanted" className="py-10">
            <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
                Get Inspired
            </h2>
            <div className="w-full flex flex-wrap">
                {tiles.map(tile => {
                    return (
                        <div
                            key={tile.name}
                            className="w-full md:w-1/3 h-72 relative bg-cover bg-center border border-white"
                            style={{ backgroundImage: `url(${IMG_BASE}${tile.image})` }}
                        >
                            <Link href={tile.link} className="absolute inset-0 flex gap-2 px-12 py-2 bg-black/40 text-white hover:bg-black/60 flex-col transition-colors justify-center">
                                <h3 className="font-semibold text-2xl">{tile.name}</h3>
                                <p>{tile.description}</p>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}


