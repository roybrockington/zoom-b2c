import Image from "next/image";

export const metadata = {
  title: "Filmmaking — Zoom",
  description: "Zoom gear for filmmakers.",
};

export default function FilmmakingPage() {
  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden bg-zinc-900 sm:h-72 lg:h-80">
        <Image
          src="https://media.sound-service.eu/zoom/pages/zoom-musician-head.webp"
          alt="Filmmaking"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
            <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Filmmaking
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-zinc-500 dark:text-zinc-400">Coming soon.</p>
      </div>
    </div>
  );
}
