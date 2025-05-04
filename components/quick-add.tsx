"use client";

import Cart from "@/app/modals/cart";
import { useCart } from "@/context/cart-context";
import { useGetProducts } from "@/hooks/use-get-products";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type SizeObject = {
  size: string;
  productId: number;
};

type QuickAddProps = {
  hover: boolean;
  size: SizeObject[]; // fixed type
};

const QuickAdd = ({ size, hover }: QuickAddProps) => {
  const [loading, products, error] = useGetProducts();
  const [modal, setModal] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!hover) {
      setModal(false);
    }
  }, [hover]);

  if (!hover) return null;

  const ToggleAddToCart = (id: number) => {
    const realSize = size[id];
    const realProduct = products?.find((prev) => prev.id === realSize?.productId);

    const optimalPrice =
      (realSize?.size?.toLowerCase().trim().startsWith("x") ||
        realSize?.size?.toLowerCase().startsWith("l") ||
        realSize?.size?.toLowerCase().trim().startsWith("5")) &&
      realProduct?.priceOptions?.length > 1
        ? 1
        : 0;

    const selectedPrice = realProduct?.priceOptions?.[optimalPrice] ?? 0;

    addToCart({
      id: realProduct?.id ?? 0,
      title: realProduct?.title ?? "Unknown Product",
      price: selectedPrice,
      color: realProduct?.colorName ?? "Default Color",
      size: realSize.size,
      quantity: 1,
      image: "",
      imageAlt: "",
    });

    setCartModal(true);
  };

  const abbreviations = size.map((prev) => {
    const lower = prev.size.toLowerCase();
    if (lower.includes("xtra small")) return "XS";
    if (lower === "small") return "S";
    if (lower === "medium") return "M";
    if (lower === "large") return "L";
    if (lower.includes("xtra large")) return "XL";
    if (lower.includes("3-6")) return "S";
    if (lower.includes("6-10")) return "M";
    if (lower.includes("10-14")) return "L";
    if (lower.includes("14-20")) return "XL";
    if (lower.includes("25-35")) return "XXL";
    if (lower.includes("45-60")) return "5XL";
    return prev.size;
  });

  return (
    <div
       className="absolute bottom-3 left-3 right-3 cursor-pointer z-10"
      onClick={() => setModal(true)}
    >
      {modal ? (
        <div className="px-2 bg-white flex gap-3 min-h-[45px] items-center">
          {abbreviations.map((sizeLabel, index) => (
            <div
              key={index}
              onClick={() => ToggleAddToCart(index)}
              className="flex w-fit min-w-8  max-h-8 min-h-8 hover:bg-[#221E1F]/10 hover:border hover:border-[#DFDEDF] items-center justify-center text-center px-1"
            >
              <p className="w-fit">{sizeLabel}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-2 bg-white min-h-[45px] items-center flex justify-between">
          <p>Quick Add</p>
          <Image
            src="/icons/plus.svg"
            width={24}
            height={24}
            alt="plus icon with the action of initiating the quick add"
          />
        </div>
      )}
      {cartModal && (
        <div
          className="fixed top-0 left-0 w-full h-screen z-40 bg-black/25"
          onClick={() => setCartModal(false)}
        />
      )}
      <Cart canScroll={false} modal={cartModal} setModal={setCartModal} value={1} />
    </div>
  );
};

export default QuickAdd;