import { useCart } from "@/context/cart-context";
import { PickupContext } from "../context/pickup-context";
import Image from "next/image";
import React, { useContext, useEffect } from "react";
import CartProductCard from "./cart-product-card";
import Button from "./button";

type CartItem = {
  image: { id: number; productId: number; image: string; alt: string }[];
  id: number | string;
  title: string;
  price: number | { price: number };
  quantity: number;
  size: string;
  color: string;
};
type PriceState = {
  subtotal: number;
  estimatedTaxes: number;
  estimatedOrderTotal: number;
  shippingFee: number;
};
interface CartDisplayProps {
  button: boolean;
  checkout: boolean;
  setPrice?: React.Dispatch<React.SetStateAction<PriceState>>;
}

const CartDisplay: React.FC<CartDisplayProps> = ({
  button,
  setPrice,
  checkout,
}) => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const { ship } = useContext(PickupContext);

  const getSafePrice = (price: number | { price: number }): number => {
    if (typeof price === "number") return price;
    if (typeof price === "object" && "price" in price) return price.price;
    return 0;
  };
  useEffect(() => {
    if (!setPrice) return;

    let subtotal = 0;
    cartItems.forEach((item: CartItem) => {
      subtotal += getSafePrice(item.price) * item.quantity;
    });

    const roundToCents = (amount: number): number =>
      Math.round(amount * 100) / 100;

    const taxRate = 0.08625;
    const shippingFee = ship ? 10 : 0;
    const estimatedTaxes = roundToCents((subtotal + shippingFee) * taxRate);
    const estimatedOrderTotal = roundToCents(
      subtotal + shippingFee + estimatedTaxes
    );
    setPrice({
      subtotal,
      estimatedTaxes,
      estimatedOrderTotal,
      shippingFee,
    });
  }, [cartItems, setPrice, ship]);
  return (
    <div className="h-fit w-full lg:w-fit flex flex-col gap-9">
      <header className="w-full bg-white py-3 flex justify-between sticky z-50 border-b border-black/25 top-0">
        <div className="flex flex-col gap-1">
          <a href="/" className="flex items-center gap-1">
            <span className="underline">Continue Shopping</span>
            <Image
              src="/icons/right-arrow.svg"
              width={20}
              height={20}
              alt="right arrow"
            />
          </a>
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <p>
            Your order ({cartItems.length} item
            {cartItems.length !== 1 ? "s" : ""})
          </p>
        </div>
      </header>

      <section
        className={`flex flex-col gap-9 ${
          checkout ? "lg:h-fit h-full max-h-[606px] overflow-y-auto" : ""
        }`}
        aria-label="Cart items"
      >
        {cartItems.map((item: CartItem, index: number) => {
          return (
            <CartProductCard
              key={index}
              product={{
                id: Number(item.id),
                title: item.title,
                image: item.image,
                price: getSafePrice(item.price),
                quantity: item.quantity,
                size: item.size,
                colorName: item.color,
                color: item.color,
              }}
              onUpdateQuantity={(quantity) =>
                updateQuantity(item.size, item.title, quantity)
              }
              onRemove={() => removeFromCart(item.size, item.title)}
            />
          );
        })}
      </section>

      {button && (
        <div className="sticky bottom-0 w-full h-fit p-3 bg-white border-t border-black/25 flex justify-between">
          <Button link="/cart" primary={true}>
            Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartDisplay;
