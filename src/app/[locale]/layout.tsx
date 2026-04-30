import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CookieBar from "../components/CookieBar";
import type { Category } from "../components/Header";
import { CurrencyProvider } from "../components/CurrencyContext";
import { AuthProvider } from "../components/AuthContext";
import { CartProvider } from "../components/CartContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "../../i18n/routing";
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Welcome to ZOOM - ZOOM EUROPE",
  description: "ZOOM, ZOOM Corp, podcasting, sound design, music production, film production, mobile recorders, field recorders, podcast recorders, video recorders, iOS and Android recorders, audio interfaces, digital mixers, multi-effects devices, vocal processors, voice processors, vocal microphones, podcast microphones",
    icons: {
    icon: '//media.sound-service.eu/zoom/touch-icon-32.png',
    shortcut: '//media.sound-service.eu/zoom/touch-icon-32.png',
    apple: [
      { url: '//media.sound-service.eu/zoom/touch-icon-57.png', sizes: '57x57' },
      { url: '//media.sound-service.eu/zoom/touch-icon-72.png', sizes: '72x72' },
      { url: '//media.sound-service.eu/zoom/touch-icon-114.png', sizes: '114x114' },
      { url: '//media.sound-service.eu/zoom/touch-icon-144.png', sizes: '144x144' },
    ],
  },
  alternates: {
    canonical: 'https://www.zoom-europe.com/',
    languages: {
      'en': 'https://www.zoom-europe.com/',
      'de': 'www.zoom-europe.com/de',
      'fr': 'www.zoom-europe.com/fr',
      'nl': 'www.zoom-europe.com/nl',
      'pl': 'www.zoom-europe.com/pl',
      'cs': 'www.zoom-europe.com/cz',
    },
  },
};

async function getCategories(locale: string): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "de" | "fr" | "nl" | "pl" | "cz")) {
    notFound();
  }

  const [categories, messages] = await Promise.all([
    getCategories(locale),
    getMessages(),
  ]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <CartProvider>
              <CurrencyProvider>
                <Header categories={categories} />
                <main className="flex-1">{children}</main>
                <Footer />
                <CookieBar />
              </CurrencyProvider>
            </CartProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
