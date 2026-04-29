import Image from "next/image";
import { getTranslations } from "next-intl/server";

const IMG_BASE = "https://media.sound-service.eu/zoom/home-seo/";

const tiles: { key: string; image: string }[] = [
    { key: "handyRecorders",        image: "zoom-home-handy-recorders.webp"   },
    { key: "fieldRecorders",        image: "zoom-home-field-recorders.webp"   },
    { key: "podcastRecorders",      image: "zoom-home-podcast-recorders.webp" },
    { key: "handyVideoRecorders",   image: "zoom-home-video-recorders.webp"   },
    { key: "iosAndroidMicrophones", image: "zoom-home-mobile-recorders.webp"  },
    { key: "audioInterfaces",       image: "zoom-home-interfaces.webp"        },
    { key: "digitalMixers",         image: "zoom-home-mixers.webp"            },
    { key: "multiEffects",          image: "zoom-home-multieffects.webp"      },
    { key: "vocalProcessors",       image: "zoom-home-vocal.webp"             },
    { key: "microphones",           image: "zoom-home-microphones.webp"       },
];

export default async function CreatorProse() {
  const t = await getTranslations("home.creatorProse");

  return (
    <section id="mostWanted" className="py-10">
      <h2 className="mb-6 text-xl text-zinc-900 dark:text-white">
        <span className="font-bold">{t("headingBold")}</span> {t("heading")}
      </h2>
      <p className="my-7">{t("intro1")}</p>
      <p className="my-7">{t("intro2")}</p>
      <div className="w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        {tiles.map((tile, i) => {
          const isEven = i % 2 === 0;
          const name = t(`${tile.key}.name` as Parameters<typeof t>[0]);
          const text = t(`${tile.key}.text` as Parameters<typeof t>[0]);
          return (
            <div
              key={tile.key}
              className={`flex flex-col gap-14 py-12 md:flex-row md:items-center ${isEven ? "" : "md:flex-row-reverse"}`}
            >
              <div className="md:w-2/5 shrink-0">
                <Image
                  src={`${IMG_BASE}${tile.image}`}
                  alt={name}
                  width={600}
                  height={400}
                  className="w-full rounded-xl object-cover shadow-md"
                />
              </div>
              <div className="md:w-3/5">
                <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
                  {name}
                </h3>
                <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
