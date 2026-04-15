import Image from "next/image";
import GetInspired from "../components/GetInspired";

export const metadata = {
    title: "Filmmaking — Zoom",
    description: "Zoom gear for filmmakers.",
};

export default function FilmmakingPage() {
    return (
        <div>
            <div className="relative h-56 w-full overflow-hidden bg-zinc-900 sm:h-72 lg:h-80">
                <Image
                    src="https://media.sound-service.eu/zoom/pages/zoom-filmmaker-head.webp"
                    alt="Filmmaking"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
                        <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                            Filmmaking
                        </h1>
                        <p className="mt-3 max-w-xl text-sm text-zinc-300 sm:text-base">
                            The sound for your video or film plays an important role. With our Handy Recorders and Field Recorders, you have the right tools to create and record Hollywood-quality sound for your film project.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <p className="text-zinc-500 dark:text-zinc-400">Field Recording Essentials</p>
                <p className="text-zinc-500 dark:text-zinc-400">Handy Recording Essentials</p>
                <p className="text-zinc-500 dark:text-zinc-400">Recording Essentials</p>
                <p className="text-zinc-500 dark:text-zinc-400">Filmmaking Accessories</p>
                <GetInspired />
            </div>
        </div>
    );
}
