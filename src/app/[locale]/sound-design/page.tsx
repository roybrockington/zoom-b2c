import Image from "next/image";
import { getTranslations } from "next-intl/server";
import GetInspired from "../../components/GetInspired";
import PageBlocks from "../../components/PageBlocks";

export const metadata = {
  title: "Sound Design — Zoom",
  description: "Zoom gear for sound designers.",
};

export default async function SoundDesignPage() {
  const t = await getTranslations("pages.soundDesign");

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden bg-zinc-900 sm:h-72 lg:h-80">
        <Image
          src="https://media.sound-service.eu/zoom/pages/zoom-sounddesign-head.webp"
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
            <p className="mt-3 max-w-xl text-sm text-zinc-300 sm:text-base">
              {t("description")}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <PageBlocks page="sound-design" />
        <GetInspired />
      </div>
    </div>
  );
}
