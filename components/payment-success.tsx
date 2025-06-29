"use client"; // required to use browser APIs like window

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentSuccess() {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("order_id");
    if (id) setOrderId(id);
  }, []);

  return (
    <main className="dynamic-x-padding pt-[12px] pb-42 w-full flex flex-col gap-6 my-24">
      <header>
        <h1 className="text-[#16767E] mb-[1.5rem]" tabIndex={0}>
          Thank you for your purchase
        </h1>
        <h2 className="text-[#16767E]" tabIndex={0} aria-live="polite">
          {orderId ? `Your order is #${orderId}` : "Loading order ID..."}
        </h2>
      </header>
      <section className="flex flex-col gap-[16px]">
        <p>We'll email you an order confirmation with details and shipping info</p>
        <Link href="/" className="flex items-center gap-1" aria-label="Continue shopping on the homepage">
          <span className="underline">Continue Shopping</span>
        </Link>
      </section>
    </main>
  );
}