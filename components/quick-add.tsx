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
  size: SizeObject[];
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  cartModal: boolean;
  setCartModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const QuickAdd = ({
  size,
  hover,
  setHover,
  cartModal,
  setCartModal,
}: QuickAddProps) => {
  const [loading, products] = useGetProducts();
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!hover) {
      setShowSizeOptions(false);
    }
  }, [hover]);

  const findProductByIndex = (index: number) => {
    const sizeObj = size[index];
    if (!sizeObj || !sizeObj.productId) return null;
    const product = products?.find((p) => p.id === sizeObj.productId);
    return product ? { product, size: sizeObj.size } : null;
  };

  const handleAddToCart = (index: number) => {
    const result = findProductByIndex(index);
    if (!result) return;

    const { product, size: selectedSize } = result;

    const isExtraSize =
      selectedSize.toLowerCase().trim().startsWith("x") ||
      selectedSize.toLowerCase().trim().startsWith("5");

    const priceIndex = isExtraSize && product.priceOptions?.length > 1 ? 1 : 0;

    const selectedPrice = product.priceOptions?.[priceIndex]?.price ?? 0;

    addToCart({
      id: product.id,
      title: product.title || "Unknown Product",
      price: selectedPrice,
      color: product.colorName || "Default Color",
      size: selectedSize,
      quantity: 1,
      image: "", // Optional: fill with product image
      imageAlt: "", // Optional: fill with alt text
    });

    setShowSizeOptions(false);
    setHover(false);
    setCartModal(true);
  };

  const getAbbreviation = (size: string) => {
    const lower = size.toLowerCase();
    if (lower.includes("xtra small")) return "XS";
    if (lower === "small") return "S";
    if (lower === "medium") return "M";
    if (lower === "large") return "L";
    if (lower.includes("xtra large")) return "XL";
    if (lower.includes("3-6")) return "S";
    if (lower.includes("6-10")) return "M";
    if (lower.includes("10-14")) return "L";
    if (lower.includes("14-20")) return "XL";
    if (lower.includes("25-35")) return "2XL";
    if (lower.includes("45-60")) return "5XL";
    return size;
  };

  const allOutOfStock = size.every((item) => {
    const product = products?.find((p) => p.id === item.productId);
    return product?.status === "OUT_OF_STOCK";
  });

  if (hover && allOutOfStock) {
    return (
      <div className="absolute bg-white text-black/40 px-3  min-h-[53px] items-center flex justify-between bottom-2  left-2 right-2  z-10 cursor-not-allowed">
        <p>Out Of Stock</p>
      </div>
    );
  }

  return (
    <div
      className="absolute  bottom-2  left-2 right-2  z-10 cursor-pointer"
      onClick={() => !cartModal && setShowSizeOptions(true)}
    >
      {showSizeOptions ? (
        <div
          className={`${
            !hover && "opacity-0"
          } bg-white flex flex-wrap  max-gap-6px min-h-[53px] px-3 items-center`}
        >
          {size.map((item, index) => {
            const product = products?.find((p) => p.id === item.productId);
            const isOutOfStock = product?.status === "OUT_OF_STOCK";
            const isSizeOutOfStock = item?.status=== "OUT_OF_STOCK";
            return (
              <div
                key={index}
                onClick={() => {
                  if (isOutOfStock || isSizeOutOfStock) {
                    return;
                  } else {
                    handleAddToCart(index);
                  }
                }}
                className={`flex w-fit min-w-[40px] max-h-[40px] min-h-[40px] items-center justify-center text-center px-1 ${
                  isSizeOutOfStock
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-[#221E1F]/10 hover:border hover:border-[#DFDEDF]"
                }`}
              >
                <p className="w-fit">{getAbbreviation(item.size)}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`${
            !hover && "opacity-0"
          } bg-white px-3 min-h-[53px] items-center flex justify-between`}
        >
          <p className="text-black">Quick Add</p>
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

      <Cart
        canScroll={false}
        modal={cartModal}
        setModal={setCartModal}
        value={1}
      />
    </div>
  );
};

export default QuickAdd;
