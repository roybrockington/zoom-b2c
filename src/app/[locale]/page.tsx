import HeroSlider from "../components/HeroSlider";
import MostWanted from "../components/MostWanted";
import CategoryGrid from "../components/CategoryGrid";
import Newsletter from "../components/Newsletter";
import Warranty from "../components/Warranty";
import WebshopProse from "../components/WebshopProse";
import Creators from "../components/Creators";
import CreatorProse from "../components/CreatorProse";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div>
      <HeroSlider />
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <MostWanted />
        <Creators />
        <CategoryGrid locale={locale} />
        <section className="flex gap-6 md:flex-row flex-col">
          <Warranty />
          <Newsletter />
        </section>
        <CreatorProse />
        <WebshopProse />
      </div>
    </div>
  );
}
