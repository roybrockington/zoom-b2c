"use client";

import { Check } from "lucide-react";
import Image from "next/image"
import Link from "next/link"

export default function Footer() {

    type footerBadge = {
        altText: string;
        linkUrl: string;
        imageUrl: string;
    }

    type menuItem = {
        name: string;
        link: string;
    }

const paymentMethods: footerBadge[] = [
  {
    altText: "PayPal",
    linkUrl: "/payment-methods",
    imageUrl: "https://media.sound-service.eu/zoom/payment/paypal-std.png",
  },
        /*
  {
    altText: "Klarna",
    linkUrl: "/payment-methods",
    imageUrl: "https://media.sound-service.eu/zoom/payment/klarna.png",
  }, */
  {
    altText: "Payment in advance",
    linkUrl: "/payment-methods",
    imageUrl: "https://media.sound-service.eu/zoom/payment/vorkasse-en.png",
  }
]

const shippingMethods: footerBadge[] = [
  {
    altText: "DHL",
    linkUrl: "/",
    imageUrl: "https://media.sound-service.eu/zoom/shipping/dhl.png",
  },
  {
    altText: "UPS",
    linkUrl: "/",
    imageUrl: "https://media.sound-service.eu/zoom/shipping/ups.png",
  }
]

    const faqMenu: menuItem[] = [
        {name: "Returns & Retours", link: "/returns"},
        {name: "Support", link: "/support"},
        {name: "Product Registration", link: "/warranty-extension"},
        {name: "How can I pay?", link: "/payment-methods"},
        {name: "Shipping & Delivery", link: "/shipping-and-delivery"},
    ]

    const imprintMenu: menuItem[] = [
        {name: "Terms", link: "/terms"},
        {name: "Imprint", link: "/imprint"},
        {name: "Withdrawal", link: "/withdrawal"},
        {name: "Privacy Policy", link: "/privacy-policy"}
    ]

    const aboutUsMenu: menuItem[] = [
        {name: "Filmmaking", link: "/filmmaking"},
        {name: "Music", link: "/music"},
        {name: "Podcasting", link: "/podcasting"},
        {name: "Sound Design", link: "/sound-design"},
        {name: "About Us", link: "/about-us"},
    ]


    return (
        <footer className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-gray-700 dark:bg-zinc-950 py-8">
            {/* Top bar: logo, search, icons */}
            <div className="mx-auto flex max-w-7xl gap-4 px-4 sm:px-6 lg:px-8 flex-col">
                {/* Logo */}
                <Link href="/" className="shrink-0 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    <Image src="/logo_white.png" alt="Zoom Europe" width={180} height={80} className="py-6"/>
                </Link>

                <div className="w-full flex gap-6 flex-col md:flex-row text-white">
                    <div className="flex flex-col md:w-1/4 gap-4">
                        <h4 className="text-xl font-bold">FAQ</h4>
                        <ul className="list-none flex flex-col gap-1">
                            {faqMenu.map(faq =>
                                <li key={faq.name}><Link href={faq.link}>{faq.name}</Link></li>
                            )}
                        </ul>
                    </div>
                    <div className="flex flex-col md:w-1/4 gap-4">
                        <h4 className="font-bold list-none">Our Advantages</h4>
                        <ul className="list-none flex flex-col gap-1">
                            <li className="flex items-center gap-2"><Check width={10} height={10} /> Leading in Europe</li>
                            <li className="flex items-center gap-2"><Check width={10} height={10} /> Excellent Stocking</li>
                            <li className="flex items-center gap-2"><Check width={10} height={10} /> Secure Shopping</li>
                            <li className="flex items-center gap-2"><Check width={10} height={10} /> Modern Logistics</li>
                            <li className="flex items-center gap-2"><Check width={10} height={10} /> International Distribution</li>
                        </ul>
                    </div>
                    <div className="flex flex-col md:w-1/4 gap-4">
                        <h4 className="font-bold list-none">About Us</h4>
                        <ul className="list-none flex flex-col gap-1">
                            {aboutUsMenu.map(about =>
                                <li key={about.name}><Link href={about.link}>{about.name}</Link></li>
                            )}
                        </ul>
                    </div>
                    <div className="flex flex-col md:w-1/4 gap-4">
                        <h4 className="font-bold list-none">Social Media</h4>
                        <ul className="list-none flex gap-4">
                            <li>
                                <a href="https://www.facebook.com/zoomeuropeofficial" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white hover:text-zinc-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/@zoomeurope" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-white hover:text-zinc-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/zoomeuropeofficial" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white hover:text-zinc-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className="w-full flex gap-4 flex-col md:flex-row text-white my-5">
                    <div className="flex flex-col md:w-1/2 gap-4">
                        <h4 className="text-xl font-bold">Payment Methods</h4>
                        <ul className="list-none flex gap-3">
                            {paymentMethods.map(method =>
                                <li key={method.altText}>
                                    <Link href={method.linkUrl}>
                                        <Image src={method.imageUrl} width={120} height={90} alt={method.altText} />
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="flex flex-col md:w-1/2 gap-4">
                        <h4 className="text-xl font-bold">Shipping Methods</h4>
                        <ul className="list-none flex gap-3">
                            {shippingMethods.map(method =>
                                <li key={method.altText}>
                                    <Link href={method.linkUrl}>
                                        <Image src={method.imageUrl} width={120} height={90} alt={method.altText} />
                                    </Link>
                                </li> 
                            )}
                        </ul>
                    </div>
                </div>
                <div className="w-full flex gap-4 flex-col md:flex-row text-white">
                    <div className="flex flex-col w-1/2 gap-4 text-sm">
                        <ul className="list-none flex">
                            {imprintMenu.map(imprint =>
                                <li key={imprint.name} className="px-2 border-r border-r-white last:border-r-0">
                                    <Link href={imprint.link}>{imprint.name}</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="flex flex-col w-1/2 text-xs">
                        <p>All prices incl. VAT plus possible shipping costs.</p>
                        <p>Errors and omissions excepted © 2026 Sound Service GmbH - All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
