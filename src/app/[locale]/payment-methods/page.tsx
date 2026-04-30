import Image from "next/image";
import { getTranslations } from "next-intl/server";

const IMG_BASE = "https://media.sound-service.eu/zoom/payment";

export default async function PaymentMethodsPage() {
  const t = await getTranslations("paymentMethods");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 flex gap-4 flex-col">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">{t("title")}</h1>
      <hr className="w-full text-gray-200" />
      <div className="w-full flex gap-4 items-start py-4">
        <Image src={`${IMG_BASE}/${t("prepaymentImg")}`} alt={t("prepaymentTitle")} width={200} height={100} />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{t("prepaymentTitle")}</h2>
          <p>{t("prepaymentIntro")}</p>
          <ul className="text-sm font-bold">
            <li>Receiver: Sound Service GmbH</li>
            <li>Bank: Deutsche Bank AG</li>
            <li>IBAN: DE80 1007 0000 0650 2900 00</li>
            <li>BIC: DEUTDEBBXXX</li>
            <li>Bank code: 100 700 00</li>
          </ul>
          <p>{t("prepaymentOutro")}</p>
        </div>
      </div>
      <hr className="w-full text-gray-200" />
      <div className="w-full flex gap-4 items-start py-4">
        <Image src={`${IMG_BASE}/paypal-std.webp`} alt={t("paypalTitle")} width={200} height={100} />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{t("paypalTitle")}</h2>
          <p>{t("paypalText")}</p>
        </div>
      </div>
    </div>
  );
}
