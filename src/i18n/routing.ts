import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "fr", "nl", "pl", "cz"],
  defaultLocale: "en",
  localePrefix: "as-needed", // en → /*, de → /de/*, fr → /fr/*, etc.
});
