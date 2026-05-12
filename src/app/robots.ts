import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zoom-europe.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/*/account",
          "/*/konto",
          "/*/ucet",
          "/*/compte",
          "/*/admin",
          "/*/cart",
          "/*/warenkorb",
          "/*/panier",
          "/*/winkelwagen",
          "/*/koszyk",
          "/*/kosik",
          "/*/checkout",
          "/*/kasse",
          "/*/caisse",
          "/*/kassa",
          "/*/kasa",
          "/*/pokladna",
          "/*/login",
          "/*/anmelden",
          "/*/connexion",
          "/*/inloggen",
          "/*/logowanie",
          "/*/prihlaseni",
          "/*/register",
          "/*/registrieren",
          "/*/inscription",
          "/*/registreren",
          "/*/rejestracja",
          "/*/registrace",
          "/*/reset-password",
        ],
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/de/sitemap.xml`,
      `${BASE_URL}/fr/sitemap.xml`,
      `${BASE_URL}/nl/sitemap.xml`,
      `${BASE_URL}/pl/sitemap.xml`,
      `${BASE_URL}/cz/sitemap.xml`,
    ],
  };
}
