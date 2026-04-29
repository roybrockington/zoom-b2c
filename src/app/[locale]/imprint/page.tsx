import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function ImprintPage() {
    const t = await getTranslations("imprint");

    return (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 flex gap-4 flex-col">
            <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">{t("title")}</h1>
            <hr className="w-full text-gray-200" />
            <div className="w-full flex gap-4 items-start py-4">
                <div className="flex flex-col md:flex-row gap-2">
                    <div>
                        <h2 className="text-lg font-semibold">{t("companyName")}</h2>
                        <p>Moriz-Seeler-Straße 3</p>
                        <p>12489 Berlin</p>
                        <p>Germany</p>
                        <Link className="text-blue-600 underline" href='mailto:info@zoom-europe.com'>Email: info@zoom-europe.com</Link>
                    </div>
                    <div className="w-full">
                        <ul>
                            <li>{t("ceo")}</li>
                            <li>{t("registerCourt")}</li>
                            <li>{t("registerNumber")}</li>
                            <li>{t("vatId")}</li>
                            <li>{t("wIdNr")}</li>
                            <li>{t("weee")}</li>
                            <li>{t("odrLabel")} <Link className="text-blue-600 underline" href='https://ec.europa.eu/consumers/odr'>https://ec.europa.eu/consumers/odr</Link></li>
                            <li>{t("noArbitration")}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <hr className="w-full text-gray-200" />
            <div className="w-full flex flex-col gap-4 items-start py-4">
                <h2 className="text-lg font-semibold">{t("disclaimer")}</h2>
                <p>{t("disclaimerText")}</p>
            </div>
            <hr className="w-full text-gray-200" />
            <div className="w-full flex gap-4 items-start py-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">{t("copyright")}</h2>
                    <p>{t("copyrightText1")}</p>
                    <p className="font-bold">{t("copyrightText2")}</p>
                </div>
            </div>
        </div>
    );
}
