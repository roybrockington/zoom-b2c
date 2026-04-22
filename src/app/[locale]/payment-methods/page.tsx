import Image from "next/image"

const IMG_BASE = "https://media.sound-service.eu/zoom/payment"

const PaymentMethodsPage = () => {

    return (
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 flex gap-8 flex-col">
            <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">Payment Methods</h1>
            <hr className="w-full bg-neutral-quaternary" />
            <div className="w-full flex gap-4 items-start py-4">
                <Image src={`${IMG_BASE}/vorkasse-en.webp`} alt="Prepayment" width={200} height={100} />
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Payment in advance</h2>
                    <p>If you have selected the payment method payment in advance for your order, please transfer the invoice amount to our bank account after receiving the order confirmation:</p>

                    <ul className="text-sm font-bold">
                        <li>Receiver: Sound Service GmbH</li>
                        <li>Bank: Deutsche Bank AG</li>
                        <li>IBAN: DE80 1007 0000 0650 2900 00</li>
                        <li>BIC: DEUTDEBBXXX</li>
                        <li>Bank code: 100 700 00</li>
                    </ul>
                    <p>Please state your order number as the reason for payment so that we can allocate your payment. After receipt of payment, your ordered goods will be shipped and you will receive a shipping confirmation.</p>

                </div>
            </div>
            <hr className="w-full bg-neutral-quaternary" />
            <div className="w-full flex gap-4 items-start py-4">
                <Image src={`${IMG_BASE}/paypal-std.webp`} alt="PayPal" width={200} height={100} />
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">PayPal</h2>
                    <p>Via PayPal you can easily pay via your PayPal account without having to provide us with your bank details.</p>
                </div>
            </div>
            <hr className="w-full text-gray-600" />
            <div className="w-full flex gap-4 items-start py-4">
                <Image src={`${IMG_BASE}/klarna.webp`} alt="PayPal" width={200} height={100} />
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold">Klarna</h2>
                    <p>With KLARNA, paying online is easier than ever! You have the choice between the options <span className="font-bold">"Pay now"</span> (payment by immediate bank transfer, direct debit or credit card), <span className="font-bold">"Pay later"</span> (purchase on account) and <span className="font-bold">"Instalment purchase"</span> (financing). Conveniently use your familiar online banking data and be on the safe side.</p>
                </div>
            </div>
        </div>
    )
}

export default PaymentMethodsPage
