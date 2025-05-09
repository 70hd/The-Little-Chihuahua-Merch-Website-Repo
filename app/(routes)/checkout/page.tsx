"use client";
import NotFound from "@/app/not-found";
import CartDisplay from "@/components/cart-display";
import PaymentDetails from "@/components/payment-details";
import { useCart } from "@/context/cart-context";
import React, { useState } from "react";

type PriceState = {
  subtotal: number;
  estimatedTaxes: number;
  estimatedOrderTotal: number;
};

const Checkout: React.FC = () => {
  const [price, setPrice] = useState<PriceState>({
    subtotal: 0,
    estimatedTaxes: 0,
    estimatedOrderTotal: 0,
  });

  const { cartItems } = useCart();

  if (cartItems.length === 0) {
    return <NotFound checkout={true} />;
  }

  return (
    <div className="flex gap-[30px] lg:flex-row flex-col dynamic-x-padding mt-24">
      <div className="w-fit h-fit pb-12">
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
