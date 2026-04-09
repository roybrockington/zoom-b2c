import HeroSlider from "./components/HeroSlider";
import MostWanted from "./components/MostWanted";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <MostWanted />
        <section className="mt-4 text-zinc-500 dark:text-zinc-400 w-full h-48 border border-zinc-200 rounded-lg flex items-center justify-center">
          Creator tiles
        </section>
        <section className="mt-4 text-zinc-500 dark:text-zinc-400 w-full h-48 border border-zinc-200 rounded-lg flex items-center justify-center">
          Product category tiles
        </section>
        <section className="mt-4 text-zinc-500 dark:text-zinc-400 w-full h-36 border border-zinc-200 rounded-lg flex items-center justify-center">
          Warranty Extension
        </section>
        <section className="mt-4 text-zinc-500 dark:text-zinc-400 w-full h-36 border border-zinc-200 rounded-lg flex items-center justify-center">
          Check Newsletter
        </section>
        <section className="mt-4 text-zinc-500 dark:text-zinc-400 w-full h-48 border border-zinc-200 rounded-lg flex items-center justify-center">
          Creator prose
        </section>
        <section className="mt-4 text-zinc-500 dark:text-zinc-400 w-full h-48 border border-zinc-200 rounded-lg flex items-center justify-center">
          Web shop prose
        </section>
      </div>
    </div>
  );
}
