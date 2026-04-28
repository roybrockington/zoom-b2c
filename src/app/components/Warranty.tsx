import Link from "next/link";

const Warranty = () => {

    return (
        <section className="py-10 bg-gray-700 text-white md:w-1/2 p-8 flex flex-col justify-between gap-2 rounded">
            <h2 className="mb-6 text-2xl font-normal dark:text-white">
                Warranty <span className="font-black">Extension</span>
            </h2>
            <p className="my-3">
                By registering your product within three months from the date of purchase (as indicated on the proof of purchase), you will receive a 1-year warranty extension on your ZOOM product. A free customer account in our web shop is required for product registration.
            </p>
            <Link href="/warranty-extension" className="py-3 px-6 mx-12 bg-white text-zinc-900 font-bold flex my-6 justify-center rounded-full hover:bg-black hover:text-white transition duration-300">Register Products</Link>
        </section>
    );
}


export default Warranty

