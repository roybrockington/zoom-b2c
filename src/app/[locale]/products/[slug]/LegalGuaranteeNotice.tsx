import { getTranslations } from "next-intl/server";

// Official EU harmonised notice on the legal guarantee of conformity
// (Directive (EU) 2024/825, mandatory from 27 September 2026).
// Artwork: https://commission.europa.eu/publications/practical-guidelines-and-high-resolution-vector-files-eu-notice-and-label-product-guarantees_en
// The graphic must not be altered, cropped, linked, collapsed or shown in a pop-up,
// must be in colour online, and a clickable link to the QR code destination must be available.
const GUARANTEE_URLS: Record<string, string> = {
  en: "https://europa.eu/youreurope/guarantees",
  de: "https://europa.eu/youreurope/garantien",
  fr: "https://europa.eu/youreurope/garanties",
  nl: "https://europa.eu/youreurope/garantie",
  pl: "https://europa.eu/youreurope/gwarancje",
  cz: "https://europa.eu/youreurope/z%C3%A1ruky_cs",
};

export default async function LegalGuaranteeNotice({ locale }: { locale: string }) {
  const t = await getTranslations("product");
  const lang = locale in GUARANTEE_URLS ? locale : "en";

  return (
    <div className="mt-16 border-t border-zinc-100 pt-10 dark:border-zinc-800">
      <h2 className="mb-6 text-xl font-bold text-zinc-900 dark:text-white">{t("legalGuarantee")}</h2>
      {/* Plain <img>: the official SVG must be shown unmodified at full size (no next/image optimisation) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/legal-guarantee/notice-${lang}.svg`}
        alt={t("legalGuaranteeAlt")}
        width={595}
        height={842}
        loading="lazy"
        className="mx-auto block h-auto w-full max-w-3xl bg-white"
      />
      <p className="mx-auto mt-4 max-w-3xl text-sm text-zinc-500 dark:text-zinc-400">
        {t("legalGuaranteeMoreInfo")}{" "}
        <a
          href={GUARANTEE_URLS[lang]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-zinc-900 underline dark:text-white"
        >
          {decodeURI(GUARANTEE_URLS[lang]).replace("https://", "")}
        </a>
      </p>
    </div>
  );
}
