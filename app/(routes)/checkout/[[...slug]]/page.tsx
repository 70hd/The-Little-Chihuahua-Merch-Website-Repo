"use client";
import NotFound from "@/app/not-found";
import CartDisplay from "@/components/cart-display";
import CheckoutPage from "@/components/checkout-page";
import PaymentDetails from "@/components/payment-details";
import { useCart } from "@/context/cart-context";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

type PriceState = {
  subtotal: number;
  estimatedTaxes: number;
  estimatedOrderTotal: number;
  shippingFee: number
};

const Checkout: React.FC = () => {
  const [status, setStatus] = useState("PREVIEW");
  const [price, setPrice] = useState<PriceState>({
    subtotal: 0,
    estimatedTaxes: 0,
    estimatedOrderTotal: 0,
    shippingFee: 0
  });
  const pathname = usePathname();
  const { cartItems } = useCart();
  useEffect(() => {
    if (pathname?.includes("/checkout/") && pathname.split("/checkout/")[1]?.includes("success")) {
      setStatus("SUCCESS");
    } else {
      setStatus("PREVIEW");
    }
  }, [pathname]);

  if (cartItems.length === 0 ) {
    return <NotFound checkout={true} />;
  }

  return (
    <div>
      {status === "PREVIEW" ? (
        <div className="flex gap-[30px] lg:flex-row flex-col dynamic-x-padding mt-24">
          <div className="w-fit h-fit pb-12">
            <CartDisplay button={false} checkout={true} setPrice={setPrice} />
          </div>
          <PaymentDetails
            estimatedOrderTotal={price.estimatedOrderTotal}
            estimatedTaxes={price.estimatedTaxes}
            subtotal={price.subtotal}
            shippingFee={price.shippingFee}
            setStatus={setStatus}
          />{" "}
        </div>
      ) : (
        <main className="flex flex-col gap-[30px] dynamic-x-padding dynamic-24-y-padding">
                <header>
        <button onClick={() => setStatus("PREVIEW")} className="flex items-center gap-1">
          <span className="underline">Review Cart</span>
          <Image src="/icons/right-arrow.svg" width={20} height={20} alt="right arrow" />
        </button>
        <h1>Checkout</h1>
          <p>
                  "<span className="text-[#CD3626]">*</span>" indicates required fields
                </p>
      </header>
        {/* <CheckoutPage amount={price.estimatedOrderTotal + price.shippingFee} price={price}/> */}
                <CheckoutPage amount={1} price={price}/>
        </main>
      )
      }
    </div>
  );
};

export default Checkout;
