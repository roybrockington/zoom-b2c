import { getTranslations } from "next-intl/server";

const WebshopProse = async () => {
    const t = await getTranslations("home.webshopProse");

    return (
        <section className="py-10 ">
            <h2 className="mb-6 text-2xl font-normal text-zinc-900 dark:text-white">
                {t("title")} <span className="font-black">{t("titleBold")}</span>
            </h2>
            <p className="my-3">{t("p1")}</p>
            <p className="my-3">{t("p2")}</p>
            <p className="my-3">{t("p3")}</p>
        </section>
    );
}

export default WebshopProse;
