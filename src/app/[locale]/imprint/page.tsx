import Link from "next/link";

export default function ImprintPage() {
    return (

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 flex gap-4 flex-col">
            <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Imprint</h1>
            <hr className="w-full text-gray-200" />
            <div className="w-full flex gap-4 items-start py-4">
                <div className="flex flex-col md:flex-row gap-2">
                    <div>
                        <h2 className="text-lg font-semibold">Sound Service Musikanlagen-Vertriebsgesellschaft mbH</h2>
                        <p>Moriz-Seeler-Straße 3</p>
                        <p>12489 Berlin</p>
                        <p>Germany</p>
                        <Link className="text-blue-600 underline" href='mailto:info@zoom-europe.com'>Email: info@zoom-europe.com</Link>
                    </div>
                    <div className="w-full">
                        <ul>
                            <li>CEO: Dipl.-Kfm. Joachim Stock</li>
                            <li>Register court: Charlottenburg local court</li>
                            <li>Register number: HRB 20782</li>
                            <li>VAT identification number in accordance with section 27 a of the German Value Added Tax Act (Umsatzsteuergesetz): DE 136600697</li>
                            <li>W-IdNr.: DE136600697-00001</li>
                            <li>WEEE Reg. No.: DE 18189133</li>
                            <li>EU Commission platform for online dispute resolution: <Link className="text-blue-600 underline" href='https://ec.europa.eu/consumers/odr'>https://ec.europa.eu/consumers/odr</Link></li>
                            <li>We are neither obligated nor willing to participate in dispute settlement proceedings before a consumer arbitration board.</li>
                        </ul>
                    </div>


                </div>
            </div>
            <hr className="w-full text-gray-200" />
            <div className="w-full flex flex-col gap-4 items-start py-4">
                <h2 className="text-lg font-semibold">Disclaimer</h2>
                <p>In the event of direct or indirect links to other websites (“hyperlinks”), which lie outside the responsibility of the author, liability would only come into effect if the author is aware of the content and it would have been technically possible and reasonable for the author to prevent the use of illegal content. The author hereby expressly declares that, at the time of linking, no illegal contents were recognisable on the linked websites. The author has no control whatsoever over the current and future design, contents or authorship of the linked websites. Therefore, he hereby explicitly distances himself from all contents of linked/connected websites which were changed after the links were placed. This statement applies to all links and references within the author’s own website as well as for third-party entries in guest books, discussion forums, lists of links and mailing lists set up by the author and in all other forms of databases whereby content can be written externally. The owner of the linked website is solely liable for illegal, inaccurate or incomplete contents and particularly for damages resulting from the use or non-use of such provided information, not the person who merely made the link to the publication in question.</p>
            </div>
            <hr className="w-full text-gray-200" />
            <div className="w-full flex gap-4 items-start py-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Copyright & Trademark Rights</h2>
                    <p>The author strives to observe the copyright of all images, graphics, sound files, video sequences and texts used in all publications, to use images, graphics, sound files, video sequences and texts he created himself or to utilise royalty-free graphics, sound files, video sequences and texts. All protected brand names and trademarks of third parties mentioned within the website are unrestrictedly subject to the terms of the respective and valid trademark law and the ownership rights of the respective registered owners. Simply mentioning the name is not sufficient reason to assume that the brand names are not protected by the legal rights of third parties! The copyright for published objects produced by the author himself remains the property of the author of the pages. Duplication or use of such graphics, sound files, video sequences and texts in other electronic or printed publications is not permitted without the explicit consent of the author.</p>
                    <p className="font-bold">Responsible party within the meaning of § 18 para. 2 MStV: Joachim Stock, Sound Service Musikanlagen-Vertriebsgesellschaft mbH, Moriz-Seeler-Straße 3, 12489 Berlin, German</p>
                </div>
            </div>
        </div>
    )
}
