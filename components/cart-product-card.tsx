import Image from "next/image";
import React, { useState } from "react";
import Quantity from "./quantity";

type Product = {
  id: number;
  title: string;
  image: string;
  alt: string;
  price: number;
  quantity: number;
  size: string;
  colorName: string;
};

type CartProductCardProps = {
  product: Product;
  onRemove: (id: number) => void;
};

const CartProductCard = ({ product, onRemove }: CartProductCardProps) => {
  const [quantity, setQuantity] = useState(product.quantity);
  return (
    <article className="w-fit h-fit flex gap-9 max-h-[285px]">
      <Image
        src={product.image}
        alt={product.alt}
        width={285}
        height={285}
        layout="intrinsic"
        className=" min-w-[285px]  h-full]"
        priority
      />
      <div className="w-full h-[285px] flex flex-col justify-between p-3">
        <div className="w-full h-fit flex gap-3 items-start justify-start">
          <div className="flex flex-col gap-[6px]">
            <h2>{product.title}</h2>
            <p className="text-black/50">
              {product.size.toUpperCase()} |{" "}
              {product.colorName.toLocaleUpperCase()}
            </p>
          </div>
          <button
            aria-label="Remove product from cart"
            onClick={() => onRemove(product.id)}
            className="min-2-[20px] pt-[5px] cursor-pointer"
          >
            <Image
              src={"/icons/trash.svg"}
              alt={"Trash icon to remove product from cart"}
              width={20}
              height={20}
              onClick={() => onRemove(product.id)}
            />
          </button>
        </div>
        <div className="w-full h-fit flex flex-col gap-[6px]">
          <h5>${product.price}.00</h5>
          <Quantity number={quantity} setNumber={setQuantity} />
        </div>
      </div>
    </article>
  );
};

export default CartProductCard;
