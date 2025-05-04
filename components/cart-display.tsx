import { useCart } from "@/context/cart-context";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CartProductCard from "./cart-product-card";
import Button from "./button";

const CartDisplay = ({
  button,
  checkout,
}: {
  button: boolean;
  checkout: boolean;
}) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  return (
    <div className={` h-fit lg:w-fit w-full flex flex-col    gap-9`}>
      <div className="w-full h-fit flex justify-between">
        <div className="w-fit h-fit flex flex-col">
          <div className="flex flex-col gap-1">
            <Link href="/" className="flex flex-row">
              <p>Continue Shopping</p>
              <Image
                src="/icons/right-arrow.svg"
                width={20}
                height={20}
                alt="right arrow"
              />
            </Link>
            <h1>Your Cart</h1>
          </div>
          <p>
            Your order ({cartItems.length} item
            {cartItems.length !== 1 ? "s" : ""})
          </p>
        </div>
      </div>
      <div
        className={`flex flex-col gap-9 ${
          checkout && "lg:h-fit h-[606px] overflow-y-auto "
        }`}
      >
        {cartItems.map((prev, index) => (
          <CartProductCard
            key={index}
            product={{
              id: prev.id,
              title: prev.title,
              image: "/images/test-image.png",
              alt: "custom alt",
              price:
                typeof prev.price === "object" && "price" in prev.price
                  ? prev.price.price
                  : prev.price ?? 0,
              quantity: prev.quantity,
              size: prev.size,
              colorName: prev.color,
            }}
            onUpdateQuantity={(quantity) => {
              updateQuantity(prev.size, prev.title, quantity);
            }}
            onRemove={() => {
              removeFromCart(prev.size, prev.title);
            }}
          />
        ))}
      </div>

      {button && (
        <Button link="/checkout" primary={true}>
          Checkout
        </Button>
      )}
    </div>
  );
};

export default CartDisplay;
