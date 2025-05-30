"use client";

import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, Stripe } from "@stripe/stripe-js";

import CheckoutPageFunc from "@/components/stripe-checkout";
import convertToSubcurrency from "@/lib/convert-to-sub-currency";

const stripePromise = (() => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
  }
  return loadStripe(key);
})();
type PriceState = {
  subtotal: number;
  estimatedTaxes: number;
  estimatedOrderTotal: number;
  shippingFee: number;
};
interface CheckoutPageProps {
  amount: number;
  price: PriceState;
}
export default function CheckoutPage({ amount, price }: CheckoutPageProps) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stripePromise.then((loadedStripe) => {
      setStripe(loadedStripe);
      setLoading(false);
    });
  }, []);

  return (
    <main>
      {loading || !stripe ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <span className="animate-spin rounded-full border-4 border-t-transparent h-12 w-12 border-black"></span>
        </div>
      ) : (
        <Elements
          stripe={stripe}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd",
          }}
        >
          <CheckoutPageFunc amount={amount} price={price} />
        </Elements>
      )}
    </main>
  );
}
