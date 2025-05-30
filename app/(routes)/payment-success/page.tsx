"use client";

import PaymentSuccess from "@/components/payment-success";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    if (!paymentIntentId) return;

    fetch(`/api/verify-payment-status?payment_intent=${paymentIntentId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status === "succeeded" ? "success" : "failed");
      })
      .catch(() => setStatus("error"));
  }, [paymentIntentId]);

  if (status === "checking")
    return (
      <div
        role="status"
        aria-live="polite"
        className="dynamic-24-y-padding dynamic-x-padding"
      >
        Checking payment status...
      </div>
    );

  if (status === "failed" || status === "error")
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="dynamic-24-y-padding dynamic-x-padding text-red-600"
      >
        Payment was not successful. Please try again.
      </div>
    );

  return <PaymentSuccess />;
}
