"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const Warranty = () => {
    const t = useTranslations("home.warranty");

    return (
        <section className="py-10 bg-gray-700 text-white md:w-1/2 p-8 flex flex-col justify-between gap-2 rounded">
            <h2 className="mb-6 text-2xl font-normal dark:text-white">
                {t("title")} <span className="font-black">{t("titleBold")}</span>
            </h2>
            <p className="my-3">
                {t("body")}
            </p>
            <Link href="/warranty-extension" className="py-3 px-6 mx-12 bg-white text-zinc-900 font-bold flex my-6 justify-center rounded-full hover:bg-black hover:text-white transition duration-300">{t("cta")}</Link>
        </section>
    );
}

export default Warranty;
