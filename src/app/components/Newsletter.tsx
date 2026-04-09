import Link from "next/link";

const Newsletter = () => {

    return (
        <section className="py-10 bg-gray-700 text-white md:w-1/2 p-8 flex flex-col justify-between gap-2 rounded">
            <h2 className="mb-6 text-2xl font-normal dark:text-white">
                Check Our <span className="font-black">Newsletter</span>
            </h2>
            <p className="my-3">
                Stay informed about partner artists, groundbreaking news and the latest technological developments.
            </p>
            <Link href="/" className="py-3 px-6 mx-12 bg-white text-zinc-900 font-bold flex my-6 justify-center rounded-full hover:bg-black hover:text-white transition duration-300">Sign Up</Link>
        </section>
    );
}


export default Newsletter
