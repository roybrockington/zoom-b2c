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
  title: "Zoom",
  description: "Professional audio & video gear",
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
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
    getCategories(),
    getMessages(),
  ]);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950">
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
