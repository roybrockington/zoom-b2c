"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "../../components/AuthContext";
import { useCart } from "../../components/CartContext";
import { useCurrency } from "../../components/CurrencyContext";
import { useRouter } from "@i18n/navigation";
import Image from "next/image";
import { Link } from "@i18n/navigation";
import dynamic from "next/dynamic";
import AddressAutocomplete from "../../components/AddressAutocomplete";

const IMG_BASE = "https://media.sound-service.eu/Artikelbilder/Shopsystem/278x148/";

// Lazy-load PayPal button to avoid SSR issues
const PayPalButton = dynamic(() => import("./PayPalButton"), { ssr: false });

type AddressFields = {
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  postcode: string;
  country: string;
};

const ADDRESS_FIELD_MAX_LENGTH = 50;

const emptyAddress = (): AddressFields => ({
  first_name: "",
  last_name: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  postcode: "",
  country: "",
});

type CountryRate = {
  code: string;
  name: string;
  carriage_eur: string;
  carriage_gbp: string;
  free_over: string | null;
  vat_rate: string;
};

function AddressForm({
  title,
  values,
  onChange,
  countries = [],
}: {
  title: string;
  values: AddressFields;
  onChange: (f: AddressFields) => void;
  countries?: CountryRate[];
}) {
  const t = useTranslations("checkout");
  const locale = useLocale();
  // Show country names in the visitor's language; the submitted value stays the ISO code.
  const localisedCountries = useMemo(() => {
    let names: Intl.DisplayNames | null = null;
    try {
      // The site uses "cz" in its URLs; the BCP 47 code for Czech is "cs".
      names = new Intl.DisplayNames([locale === "cz" ? "cs" : locale], { type: "region" });
    } catch {}
    return countries
      .map((c) => {
        let label = c.name;
        try { label = names?.of(c.code) ?? c.name; } catch {}
        return { code: c.code, label };
      })
      .sort((a, b) => a.label.localeCompare(b.label, locale === "cz" ? "cs" : locale));
  }, [countries, locale]);

  function set(key: keyof AddressFields, val: string) {
    onChange({ ...values, [key]: key === "country" ? val : val.slice(0, ADDRESS_FIELD_MAX_LENGTH) });
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-700";
  const labelClass = "mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>{t("firstName")}</label>
          <input required maxLength={ADDRESS_FIELD_MAX_LENGTH} className={inputClass} value={values.first_name} onChange={(e) => set("first_name", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>{t("lastName")}</label>
          <input required maxLength={ADDRESS_FIELD_MAX_LENGTH} className={inputClass} value={values.last_name} onChange={(e) => set("last_name", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>{t("address")}</label>
          <AddressAutocomplete
            value={values.address_line_1}
            onChange={(raw) => set("address_line_1", raw)}
            onSelect={(fields) =>
              onChange({
                ...values,
                ...fields,
                address_line_1: fields.address_line_1.slice(0, ADDRESS_FIELD_MAX_LENGTH),
                city: fields.city.slice(0, ADDRESS_FIELD_MAX_LENGTH),
                postcode: fields.postcode.slice(0, ADDRESS_FIELD_MAX_LENGTH),
              })
            }
            maxLength={ADDRESS_FIELD_MAX_LENGTH}
            inputClass={inputClass}
            placeholder={t("addressPlaceholder")}
          />
        </div>
        <div className="col-span-2">
          <input maxLength={ADDRESS_FIELD_MAX_LENGTH} className={inputClass} placeholder={t("address2Placeholder")} value={values.address_line_2} onChange={(e) => set("address_line_2", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>{t("city")}</label>
          <input required maxLength={ADDRESS_FIELD_MAX_LENGTH} className={inputClass} value={values.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>{t("postcode")}</label>
          <input required maxLength={ADDRESS_FIELD_MAX_LENGTH} className={inputClass} value={values.postcode} onChange={(e) => set("postcode", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>{t("country")}</label>
          <select required className={inputClass} value={values.country} onChange={(e) => set("country", e.target.value)}>
            <option value="">{t("selectCountry")}</option>
            {localisedCountries.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { user, token, loading: authLoading } = useAuth();
  const { items, totalItems, clearCart } = useCart();
  const { currency } = useCurrency();
  const router = useRouter();
  const t = useTranslations("checkout");

  const [shipping, setShipping] = useState<AddressFields>(emptyAddress());
  const [billing, setBilling] = useState<AddressFields>(emptyAddress());
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: "percentage" | "sum"; value: string } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "prepayment">("paypal");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);

  const [countries, setCountries] = useState<CountryRate[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);

  const subtotal = items.reduce((sum, item) => {
    const price = currency.code === "GBP" && item.price_uk
      ? parseFloat(item.price_uk)
      : parseFloat(item.price);
    return sum + price * item.quantity;
  }, 0);

  const discount = appliedCoupon
    ? appliedCoupon.type === "percentage"
      ? subtotal * (parseFloat(appliedCoupon.value) / 100)
      : Math.min(parseFloat(appliedCoupon.value), subtotal)
    : 0;

  const selectedCountry = countries.find((c) => c.code === shipping.country) ?? null;
  const vatRate = selectedCountry ? parseFloat(selectedCountry.vat_rate) : 0;
  // Prices are VAT-inclusive; back-calculate the embedded VAT on the taxable amount (subtotal minus any discount)
  const taxableAmount = subtotal - discount;
  const vatAmount = vatRate > 0 ? taxableAmount - taxableAmount / (1 + vatRate) : 0;

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/countries`)
      .then((r) => r.json())
      .then(setCountries)
      .catch(() => {});
  }, []);

  // Recalculate shipping whenever the shipping country or subtotal changes
  useEffect(() => {
    const country = countries.find((c) => c.code === shipping.country);
    if (!country) { setShippingCost(0); return; }

    // TODO: re-enable free-over-threshold logic when promotions resume
    const carriage = currency.code === "GBP"
      ? parseFloat(country.carriage_gbp)
      : parseFloat(country.carriage_eur);

    setShippingCost(carriage);
  }, [shipping.country, countries, currency.code]);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!authLoading && totalItems === 0 && !createdOrderId) router.replace("/cart");
  }, [authLoading, totalItems, createdOrderId, router]);

  async function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponError(null);
    setApplyingCoupon(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? t("invalidCoupon"));
      setAppliedCoupon(data);
      setCouponInput("");
    } catch (err) {
      setCouponError(err instanceof Error ? err.message : t("invalidCoupon"));
      setAppliedCoupon(null);
    } finally {
      setApplyingCoupon(false);
    }
  }

  function fmt(n: number) {
    return n.toLocaleString(currency.code === "GBP" ? "en-GB" : "de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError(t("sessionExpired"));
      return;
    }

    setSubmitting(true);

    const billingAddress = billingSameAsShipping ? shipping : billing;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_name: `${shipping.first_name} ${shipping.last_name}`,
          customer_email: user!.email,
          customer_phone: phone || null,
          currency: currency.code,
          shipping: shippingCost,
          coupon_code: appliedCoupon?.code ?? null,
          payment_method: paymentMethod,
          notes: notes || null,
          shipping_address: shipping,
          billing_address: billingAddress,
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg =
          (Object.values(data?.errors ?? {}) as string[][])?.[0]?.[0] ??
          data?.message ??
          t("orderFailed");
        throw new Error(msg as string);
      }

      const data = await res.json();
      setCreatedOrderId(data.data.id);
      setCreatedOrderNumber(data.data.order_number);
      setConfirmedTotal(Math.max(0, subtotal - discount + shippingCost));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("orderFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || !user) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/cart" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          {t("backToCart")}
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{t("title")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

        {/* Left: form */}
        <div className="lg:col-span-3">
          {!createdOrderId ? (
            <form onSubmit={handlePlaceOrder} className="flex flex-col gap-8">

              {/* Contact */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {t("contact")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("email")}</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">{t("phoneOptional")}</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
                      placeholder={t("phonePlaceholder")}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping address */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <AddressForm title={t("shippingAddress")} values={shipping} onChange={setShipping} countries={countries} />
              </div>

              {/* Billing address */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {t("billingAddress")}
                  </h3>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                      className="rounded"
                    />
                    {t("sameAsShipping")}
                  </label>
                </div>
                {!billingSameAsShipping && (
                  <AddressForm title="" values={billing} onChange={setBilling} countries={countries} />
                )}
                {billingSameAsShipping && (
                  <p className="text-sm text-zinc-400 dark:text-zinc-500">{t("usingShippingAddress")}</p>
                )}
              </div>

              {/* Notes */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {t("orderNotes")}
                </h3>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("notesPlaceholder")}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
                />
              </div>

              {/* Coupon */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {t("couponCode")}
                </h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3 dark:bg-green-900/20">
                    <div className="text-sm">
                      <span className="font-mono font-semibold text-green-700 dark:text-green-400">{appliedCoupon.code}</span>
                      <span className="ml-2 text-green-600 dark:text-green-500">
                        {appliedCoupon.type === "percentage"
                          ? `−${parseFloat(appliedCoupon.value)}%`
                          : `−${currency.symbol}${fmt(Math.min(parseFloat(appliedCoupon.value), subtotal))}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-xs text-zinc-400 underline hover:text-red-500"
                    >
                      {t("remove")}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null); }}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                      placeholder={t("couponPlaceholder")}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={applyingCoupon || !couponInput.trim()}
                      className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      {applyingCoupon ? "…" : t("apply")}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-2 text-xs text-red-500">{couponError}</p>
                )}
              </div>

              {/* Payment method */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {t("paymentMethod")}
                </h3>
                <div className="flex flex-col gap-3">
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${paymentMethod === "paypal" ? "border-zinc-900 dark:border-white" : "border-zinc-200 dark:border-zinc-700"}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={() => setPaymentMethod("paypal")}
                      className="accent-zinc-900 dark:accent-white"
                    />
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{t("paypal")}</span>
                  </label>
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${paymentMethod === "prepayment" ? "border-zinc-900 dark:border-white" : "border-zinc-200 dark:border-zinc-700"}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="prepayment"
                      checked={paymentMethod === "prepayment"}
                      onChange={() => setPaymentMethod("prepayment")}
                      className="accent-zinc-900 dark:accent-white"
                    />
                    <span className="text-sm font-medium text-zinc-900 dark:text-white">{t("prepayment")}</span>
                  </label>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || authLoading || !token}
                className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {submitting ? t("placingOrder") : t("continueToPayment")}
              </button>
            </form>
          ) : paymentMethod === "prepayment" ? (
            /* Prepayment confirmation */
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-lg">✓</span>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{t("orderConfirmed")}</h2>
              </div>
              <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                {t("prepaymentInstructions")}
              </p>
              <div className="mb-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{t("paymentReference")}</p>
                <p className="font-mono text-lg font-bold text-zinc-900 dark:text-white">{createdOrderNumber}</p>
              </div>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("receiver")}</dt>
                  <dd className="font-medium text-zinc-900 dark:text-white">Sound Service GmbH</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("bank")}</dt>
                  <dd className="font-medium text-zinc-900 dark:text-white">Deutsche Bank AG</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("iban")}</dt>
                  <dd className="font-mono font-medium text-zinc-900 dark:text-white">DE80 1007 0000 0650 2900 00</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">{t("bic")}</dt>
                  <dd className="font-mono font-medium text-zinc-900 dark:text-white">DEUTDEBBXXX</dd>
                </div>
              </dl>
              <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
                {t("prepaymentNote", { email: user.email })}
              </p>
              <button
                onClick={() => { clearCart(); router.push("/"); }}
                className="mt-6 w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {t("continueShopping")}
              </button>
            </div>
          ) : (
            /* PayPal payment step */
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-2 text-lg font-bold text-zinc-900 dark:text-white">{t("payWithPaypal")}</h2>
              <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                {t("paypalIntro")}
              </p>
              {error && (
                <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </p>
              )}
              <PayPalButton orderId={createdOrderId} onError={setError} />
            </div>
          )}
        </div>

        {/* Right: order summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {t("orderSummary")}
            </h2>
            <ul className="mb-4 divide-y divide-zinc-100 dark:divide-zinc-800">
              {items.map((item) => {
                const unitPrice = currency.code === "GBP" && item.price_uk
                  ? parseFloat(item.price_uk)
                  : parseFloat(item.price);
                const imgSrc = item.img ? `${IMG_BASE}${item.img}` : null;
                return (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                      {imgSrc ? (
                        <Image src={imgSrc} alt={item.name} fill className="object-contain p-1" sizes="64px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-zinc-400">—</div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1">Zoom {item.name}</span>
                      <span className="text-xs text-zinc-400">{t("qty", { quantity: item.quantity })}</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {currency.symbol}{fmt(unitPrice * item.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <dl className="space-y-2 border-t border-zinc-100 pt-4 text-sm dark:border-zinc-800">
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">{t("subtotal")}</dt>
                <dd className="font-medium text-zinc-900 dark:text-white">{currency.symbol}{fmt(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-green-600 dark:text-green-400">
                    {t("discount")}
                    {appliedCoupon && <span className="ml-1 font-mono text-xs">({appliedCoupon.code})</span>}
                  </dt>
                  <dd className="font-medium text-green-600 dark:text-green-400">−{currency.symbol}{fmt(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-zinc-500 dark:text-zinc-400">{t("shipping")}</dt>
                <dd className="text-zinc-500 dark:text-zinc-400">
                  {shipping.country
                    ? shippingCost === 0
                      ? t("free")
                      : `${currency.symbol}${fmt(shippingCost)}`
                    : t("selectACountry")}
                </dd>
              </div>
              {vatAmount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-zinc-500 dark:text-zinc-400">
                    {t("vatIncluded", { rate: Math.round(vatRate * 100) })}
                  </dt>
                  <dd className="text-zinc-500 dark:text-zinc-400">{currency.symbol}{fmt(vatAmount)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-zinc-100 pt-3 text-base font-bold dark:border-zinc-800">
                <dt className="text-zinc-900 dark:text-white">{t("total")}</dt>
                <dd className="text-zinc-900 dark:text-white">{currency.symbol}{fmt(confirmedTotal ?? Math.max(0, subtotal - discount + shippingCost))}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
