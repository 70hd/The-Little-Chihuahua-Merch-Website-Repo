"use client";

import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convert-to-sub-currency";
import Button from "./button";

const CheckoutPageFunc = ({ amount }: { amount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [userEmail, setUserEmail] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    let secret = clientSecret;

    // Step 1: Create PaymentIntent if not already created
    if (!secret) {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: convertToSubcurrency(amount),
          email: userEmail,
        }),
      });
      const data = await res.json();
      secret = data.clientSecret;
      setClientSecret(secret);
      setPaymentIntentId(data.paymentIntentId);
    }

    // Step 2: Submit payment info and confirm payment
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: secret,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      window.location.href = `${window.location.origin}/payment-success?payment_intent=${paymentIntent.id}`;
    } else {
      setErrorMessage("Payment was not completed.");
    }

    setLoading(false);
  };

  return (
    <form
    onSubmit={handleSubmit}
    className="bg-white flex flex-col gap-[30px] min-w-[392px]"
  >
    <div className="p-12 flex flex-col gap-6 bg-black/5">
<div className="flex items-center gap-3">
<div className="flex w-[32px] h-[32px] text-center items-center justify-center text-white bg-black rounded-full">
  <p className="w-fit">
    1
  </p>
</div>
<p>
  Enter you email
</p>
</div>

<input
type="email"
placeholder="Email address"
value={userEmail}
onChange={(e) => setUserEmail(e.target.value)}
required
className="border border-gray-300 rounded-md px-4 py-2"
/>  
    </div>

<div className="p-12 flex flex-col gap-6 bg-black/5">
<div className="flex items-center gap-3">
<div className="flex w-[32px] h-[32px] text-center items-center justify-center text-white bg-black rounded-full">
  <p className="w-fit">
    2
  </p>
</div>
<p>
  Express Checkout
</p>
</div>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div role="alert" className="text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
    <div>
      <Button primary={true} type="submit">
        {!loading ? `Pay $${amount}` : "Processing..."}
      </Button>
    </div>
  </form>
  );
};

export default CheckoutPageFunc;