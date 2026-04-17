import Image from "next/image";

export const metadata = {
    title: "About Us — Zoom",
    description: "Learn more about Zoom.",
};

type Tile = {
    image: string
    text: string
}

const IMG_BASE = "https://media.sound-service.eu/zoom/"

const tiles: Tile[]  = [
    {
        "image": "category-seo/handy-recorders/zoom-h4-handy-recorder.webp",
        "text": "But it was in 2006 that Zoom redefined the state of the art in mobile sound recording – especially in video and film – with the release of the revolutionary H4 Handy Recorder, creating a whole new category of device. Small enough to be held in the palm of the hand, the battery-powered H4 Handy Recorder had built-in X-Y stereo microphones, the ability to record up to four audio tracks at up to 24-bit/96 kHz directly to SD card in either WAV or MP3 format, built-in effects including a guitar tuner and metronome, and a USB port that allowed the H4 to be connected to a computer. A smaller version, the H2 Handy Recorder, followed in 2007 and became an industry standard, as did the H4n Handy Recorder, introduced in 2009."
    },
    {
        "image": "category-seo/handy-recorders/zoom-h6-handy-recorder.webp",
        "text": "In 2013, the third generation of Handy Recorders was announced. With the H6, Zoom presented a unique mobile 6-track recorder that offers a whole range of advanced features and, for the first time, includes a system of interchangeable microphone capsules that can be changed as easily as the lens of a camera. Under the steady hand of CEO Masahiro Iijima, Zoom is committed to the continuous development of new products that allow artists to express their ideas even more easily and freely. The main focus is on making these products accessible to everyone, whether amateur or professional. The company’s employees represent a balanced mix of engineering know-how and artistic flair; they know that it is not only exceptional technological skills that count, but above all the ability to implement them creatively and imaginatively with a sense and intuition for artists."
    },
    {
        "image": "pages/zoom-in-europe.webp",
        "text": "In Europe, ZOOM products are distributed by the wholesaler Sound Service GmbH. After the company was founded in 1983, we at Sound Service focused on sales work in Germany, Austria and Benelux. Our distribution area has since expanded to cover the whole of Europe, and Sound Service has become one of the leading European distributors of musical instruments, sound and lighting equipment and recording supplies. We always work on the principle of supporting all our partners 100% in all matters: 360° all-round support is standard for us, there’s no doubt about that. We work together with our partners to build their brands in Europe."
    },
    {
        "image": "pages/zoom-about-berlin.webp",
        "text": "Our central location in the heart of Europe also means we can offer our business partners ideal distribution channels for our brands and products. To do this, we have developed excellent stocking systems, rely on state-of-the-art logistics processes, and offer outstanding reliability. Our passion and commitment to the ZOOM brand drive our work, even outside of the office. We are ZOOM users, and we familiarize ourselves with ZOOM products down to the finest detail, so we know exactly what we are talking about."
    },
]

export default function AboutUsPage() {
    return (
        <div>
            <div className="relative h-56 w-full overflow-hidden bg-zinc-900 sm:h-72 lg:h-80">
                <Image
                    src="https://media.sound-service.eu/zoom/pages/zoom-about-head.webp"
                    alt="About Us"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
                        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                            About Us
                        </h1>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col gap-4">
                <p className="text-zinc-600 dark:text-zinc-300">Zoom produces a wide range of recording equipment, including a range of portable "Handy" recorders as well as multi-effects processors, effects units, drum machines and samplers. Over the past thirty years, the company has built a reputation for manufacturing innovative yet affordable products based on its own microchip design.</p>
                <p className="text-zinc-600 dark:text-zinc-300">The Zoom Corporation, based in Tokyo, Japan, was founded in 1983 and in its early years developed LSI sound generators, rhythm machines and MIDI synchronizer systems for other manufacturers. Zoom introduced its first own product in 1989: the 9002, an ultra-compact multi-effects processor designed to attach to a guitar strap. Needless to say, the 9002 was a huge success. The next product was the rack-mountable 9010 – the world’s first digital effects unit with four inputs and outputs that could handle four individual signals at the same time. In 1992, the high-end 9200 variant was launched and soon became a fixture in recording studios around the world.</p>
                <p className="text-zinc-600 dark:text-zinc-300">The popular Zoom Player guitar effects series was launched in 1994, along with the Zoom Studio series, which can still be found in the racks of many musicians today. The following year saw the introduction of the Zoom 500 pedal effects series, including the 506 bass multi-effect pedal and, of course, the extraordinarily popular 505 guitar multi-effect pedal, the best-selling multi-effect pedal of all time.

                </p>      
                <div className="w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                    {tiles.map((tile, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <div
                                key={tile.image}
                                className={`flex flex-col gap-14 py-12 md:flex-row md:items-center ${isEven ? "" : "md:flex-row-reverse"}`}
                            >
                                <div className="md:w-2/5 shrink-0">
                                    <Image
                                        src={`${IMG_BASE}${tile.image}`}
                                        alt=""
                                        width={600}
                                        height={400}
                                        className="w-full rounded-xl object-cover"
                                    />
                                </div>
                                <div className="md:w-3/5">
                                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-300" dangerouslySetInnerHTML={{ __html: tile.text }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
