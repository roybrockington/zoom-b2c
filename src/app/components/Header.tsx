"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";

export type Category = {
  id: number;
  name: string;
  slug: string;
  children?: Category[];
};

const navLinks = [
  { label: "Podcasting", href: "/podcasting" },
  { label: "Music", href: "/music" },
  { label: "Filmmaking", href: "/filmmaking" },
  { label: "Sound Design", href: "/sound-design" },
  { label: "Sale", href: "/sale" },
];

export default function Header({ categories }: { categories: Category[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openDropdown() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCategoriesOpen(true);
  }

  function closeDropdown() {
    closeTimer.current = setTimeout(() => setCategoriesOpen(false), 120);
  }

  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      {/* Top bar: logo, search, icons */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          <Image src="/logo.svg" alt="Zoom Europe" width={180} height={80} className="py-6" />
        </Link>

        {/* Search bar */}
        <div className="flex flex-1 items-center mx-3">
          <div className="relative w-full max-w-xl">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search products…"
              className="w-full rounded-full border border-zinc-300 bg-zinc-50 py-2 pl-9 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
            />
          </div>
        </div>

        {/* Icon buttons */}
        <div className="flex items-center gap-1">
          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-semibold text-white dark:bg-white dark:text-zinc-900">
              0
            </span>
          </Link>

          {/* Account */}
          <Link
            href="/account"
            aria-label="Account"
            className="rounded-full p-2 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            className="ml-1 rounded-full p-2 text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:hidden"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Nav menu — desktop */}
      <nav className="hidden border-t border-zinc-100 dark:border-zinc-800 sm:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-0 px-4 sm:px-6 lg:px-8">

          {/* Categories with dropdown */}
          <li
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 px-4 py-3 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              Categories
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {categoriesOpen && categories.length > 0 && (
              <div
                className="absolute left-0 top-full z-50 min-w-48 rounded-b-lg border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </li>

          {/* Remaining nav links */}
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-block px-4 py-3 text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-white ${
                  link.label === "Sale"
                    ? "text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Nav menu — mobile drawer */}
      {menuOpen && (
        <nav className="border-t border-zinc-100 dark:border-zinc-800 sm:hidden">
          <ul className="flex flex-col">
            {/* Categories expandable on mobile */}
            <li>
              <button
                onClick={() => setCategoriesOpen((o) => !o)}
                className="flex w-full items-center justify-between px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Categories
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${categoriesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {categoriesOpen && categories.length > 0 && (
                <ul className="bg-zinc-50 dark:bg-zinc-900">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/categories/${cat.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="block py-2 pl-10 pr-6 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-6 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                    link.label === "Sale"
                      ? "text-red-600 dark:text-red-500"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
