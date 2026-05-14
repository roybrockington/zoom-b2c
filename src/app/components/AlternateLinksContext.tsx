"use client";

import { createContext, useContext, useState } from "react";

type AlternateLinks = Partial<Record<string, string>>;

type AlternateLinksContextValue = {
  alternates: AlternateLinks;
  setAlternates: (links: AlternateLinks) => void;
};

const AlternateLinksContext = createContext<AlternateLinksContextValue>({
  alternates: {},
  setAlternates: () => {},
});

export function AlternateLinksProvider({ children }: { children: React.ReactNode }) {
  const [alternates, setAlternates] = useState<AlternateLinks>({});
  return (
    <AlternateLinksContext.Provider value={{ alternates, setAlternates }}>
      {children}
    </AlternateLinksContext.Provider>
  );
}

export function useAlternateLinks() {
  return useContext(AlternateLinksContext);
}
