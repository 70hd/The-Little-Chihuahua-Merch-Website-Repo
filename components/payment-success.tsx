"use client"; // required to use browser APIs like window

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentSuccess() {
  const [paymentIntentId, setPaymentIntentId] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("payment_intent");
    if (id) setPaymentIntentId(id);
  }, []);

  return (
    <main className="dynamic-x-padding pt-[12px] pb-42 w-full flex flex-col gap-6 my-24">
      <header>
        <h1 className="text-[#16767E] mb-[1.5rem]" tabIndex={0}>
          Thank you for your purchase
        </h1>
        <h2 className="text-[#16767E]" tabIndex={0}>
          {paymentIntentId ? `Your order is #${paymentIntentId}` : "Loading order ID..."}
        </h2>
      </header>
      <section className="flex flex-col gap-[16px]">
        <p>We'll email you an order confirmation with details and shipping info</p>
        <Link href="/" className="flex items-center gap-1">
          <p className="underline">Continue Shopping</p>
        </Link>
      </section>
    </main>
  );
}