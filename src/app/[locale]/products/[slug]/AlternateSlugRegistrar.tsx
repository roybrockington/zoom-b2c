"use client";

import { useEffect } from "react";
import { useAlternateLinks } from "@/app/components/AlternateLinksContext";

type Props = {
  slugs: Partial<Record<string, string>>;
};

/** Registers per-locale product slugs so the language switcher can navigate correctly. */
export default function AlternateSlugRegistrar({ slugs }: Props) {
  const { setAlternates } = useAlternateLinks();

  useEffect(() => {
    setAlternates(slugs);
    return () => setAlternates({});
  }, [slugs, setAlternates]);

  return null;
}
