"use client";

import React, { useEffect, useState } from "react";
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
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      });
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
  
    if (!stripe || !elements) return;
  
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }
  
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        // You still need to provide this, but we won't rely on it
        return_url: window.location.origin, // fallback
      },
      redirect: "if_required", // 👈 Important: only redirect for things like 3D Secure
    });
  
    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }
  
    // ✅ Only redirect if payment succeeded
    if (paymentIntent?.status === "succeeded") {
      window.location.href = `${window.location.origin}/payment-success?payment_intent=${paymentIntent.id}`;
    } else {
      setErrorMessage("Payment was not completed.");
    }
  
    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute  !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white flex flex-col gap-[30px] min-w-[392px]"
    >
      {clientSecret && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}
      <div>
        <Button primary={true} type="submit">
          {!loading ? `Pay $${amount}` : "Processing..."}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutPageFunc;
