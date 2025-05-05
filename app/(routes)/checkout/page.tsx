"use client";
import CartDisplay from "@/components/cart-display";
import PaymentDetails from "@/components/payment-details";
import React, { useState } from "react";

const Checkout = () => {
  type PriceState = {
    subtotal: number;
    estimatedTaxes: number;
    estimatedOrderTotal: number;
  };
  const [price, setPrice] = useState<PriceState>({
    subtotal: 0,
    estimatedTaxes: 0,
    estimatedOrderTotal: 0,
  });
  return (
    <div className="flex gap-[30px] lg:flex-row flex-col justify-between dynamic-x-padding mt-24">
      <div className="w-fit lg:h-fit ">
        <CartDisplay button={false} checkout={true} setPrice={setPrice} />
      </div>

      <PaymentDetails
        estimatedOrderTotal={price.estimatedOrderTotal}
        estimatedTaxes={price.estimatedTaxes}
        subtotal={price.subtotal}
      />
    </div>
  );
};

export default Checkout;
