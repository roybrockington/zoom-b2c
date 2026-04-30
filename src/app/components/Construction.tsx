import { getTranslations } from "next-intl/server";

export default async function Construction() {
  const t = await getTranslations("construction");

  return (
    <section className="py-10">
      <div className="w-full flex flex-wrap">
        {t("line1")}
      </div>
      <div className="w-full flex flex-wrap">
        {t("line2")}
      </div>
    </section>
  );
}

