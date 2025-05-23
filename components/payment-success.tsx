import Link from "next/link";



export default function PaymentSuccess() {
    return (
      <main className="dynamic-x-padding pt-[12px] pb-42 w-full flex flex-col gap-6 my-24">
      <header>
        <h1 className="text-[#16767E] mb-[1.5rem]" tabIndex={0}>
          Thank you for your purchase
        </h1>
        <h2 className="text-[#16767E]" tabIndex={0}>
          Your order is #00000
        </h2>
      </header>
      <section className="flex flex-col gap-[16px]">
        <p>We'll email you an order confirmation wtih details and shipping info</p>
        <Link href="/" className="flex items-center gap-1">
        <p className="underline">Continue Shopping</p>
        </Link>
      </section>
    </main>
    );
  }