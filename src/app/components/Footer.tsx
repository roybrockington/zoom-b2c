"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {

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
                            <li>Returns &amp; Retours</li>
                            <li>Sales Support</li>
                            <li>Technical Support</li>
                            <li>Product Registration</li>
                            <li>How can I pay?</li>
                            <li>Shipping &amp; Delivery</li>
                        </ul>
                    </div>
                    <div className="flex flex-col md:w-1/4 gap-4">
                        <h4 className="font-bold list-none">Our Advantages</h4>
                        <ul className="list-none flex flex-col gap-1">
                            <li>Leading in Europe</li>
                            <li>Excellent stocking</li>
                            <li>Secure shopping</li>
                            <li>Modern Logistics</li>
                            <li>International distribution</li>
                        </ul>
                    </div>
                    <div className="flex flex-col md:w-1/4 gap-4">
                        <h4 className="font-bold list-none">Our Advantages</h4>
                        <ul className="list-none flex flex-col gap-1">
                            <li>Filmmaking</li>
                            <li>Music</li>
                            <li>Podcasting</li>
                            <li>Sound Design</li>
                            <li>About us</li>
                        </ul>
                    </div>
                    <div className="flex flex-col md:w-1/4 gap-4">
                        <h4 className="font-bold list-none">Social Media</h4>
                        <ul className="list-none flex flex-col gap-1">
                            <li>Facebook</li>
                            <li>YouTube</li>
                            <li>Instagram</li>
                        </ul>
                    </div>

                </div>
                <div className="w-full flex gap-4 flex-col md:flex-row text-white my-5">
                    <div className="flex flex-col md:w-1/2 gap-4">
                        <h4 className="text-xl font-bold">Payment Methods</h4>
                        <ul className="list-none flex gap-3">
                            <li>PayPal</li>
                            <li>Klarna</li>
                            <li>Payment in advance</li>
                        </ul>
                    </div>
                    <div className="flex flex-col md:w-1/2 gap-4">
                        <h4 className="text-xl font-bold">Shipping Methods</h4>
                        <ul className="list-none flex gap-3">
                            <li>DHL</li>
                            <li>UPS</li>
                        </ul>
                    </div>
                </div>
                <div className="w-full flex gap-4 flex-col md:flex-row text-white">
                    <div className="flex flex-col w-1/2 gap-4 text-sm">
                        GTC | 
Imprint | 
Withdrawal | 
Data protection | 
Cookie settings
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
