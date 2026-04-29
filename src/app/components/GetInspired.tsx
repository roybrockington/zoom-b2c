import Link from "next/link";
import { getTranslations } from "next-intl/server";

const IMG_BASE = "https://media.sound-service.eu/zoom/";

const tiles: { key: string; image: string; link: string }[] = [
    { key: "music",       image: "category-seo/inspiration-musicians.webp",      link: "/music"        },
    { key: "podcasting",  image: "category-seo/inspiration-podcasters.webp",     link: "/podcasting"   },
    { key: "filmmaking",  image: "category-seo/inspiration-filmmakers.webp",     link: "/filmmaking"   },
    { key: "soundDesign", image: "category-seo/inspiration-sounddesigners.webp", link: "/sound-design" },
    { key: "aboutUs",     image: "pages/zoom-about-head.webp",                   link: "/about-us"     },
];

export default async function GetInspired() {
    const t = await getTranslations("home.getInspired");

    return (
        <section className="py-10">
            <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">
                {t("title")}
            </h2>
            <div className="w-full flex flex-wrap">
                {tiles.map(tile => {
                    const name = t(`${tile.key}.name` as Parameters<typeof t>[0]);
                    const description = t(`${tile.key}.description` as Parameters<typeof t>[0]);
                    return (
                        <div
                            key={tile.key}
                            className="w-full md:w-1/3 h-72 relative bg-cover bg-center border border-white"
                            style={{ backgroundImage: `url(${IMG_BASE}${tile.image})` }}
                        >
                            <Link href={tile.link} className="absolute inset-0 flex gap-2 px-12 py-2 bg-black/40 text-white hover:bg-black/60 flex-col transition-colors justify-center">
                                <h3 className="font-semibold text-2xl">{name}</h3>
                                <p>{description}</p>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
