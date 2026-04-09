import HeroSlider from "./components/HeroSlider";
import MostWanted from "./components/MostWanted";
import CategoryGrid from "./components/CategoryGrid";
import Newsletter from "./components/Newsletter";
import Warranty from "./components/Warranty";
import WebshopProse from "./components/WebshopProse";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <MostWanted />
        <section className="mt-4 text-zinc-500 dark:text-zinc-400 w-full h-48 border border-zinc-200 rounded-lg flex items-center justify-center">
          Creator tiles
        </section>
        <CategoryGrid />
        <section className="flex gap-6 md:flex-row flex-col">
                <Warranty />
                <Newsletter />
        </section>
        <section className="mt-4 text-zinc-500 dark:text-zinc-400 w-full h-48 border border-zinc-200 rounded-lg flex items-center justify-center">
          Creator prose
        </section>
                <WebshopProse />
      </div>
    </div>
  );
}
