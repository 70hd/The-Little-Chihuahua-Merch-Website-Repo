import Image from "next/image";
import React, { useEffect, useState } from "react";
import Quantity from "./quantity";

type Product = {
  id: number;
  title: string;
  image: string;
  imageAlt: string;
  price: object;
  quantity: number;
  size: string;
  color: string;
};

type CartProductCardProps = {
  product: Product;
  onRemove: (id: number) => void;
  onUpdateQuantity: (quantity: number) => void;
};

const CartProductCard = ({ product, onRemove,onUpdateQuantity }: CartProductCardProps) => {

  const [quantity, setQuantity] = useState(product.quantity);
  useEffect(() => {
    onUpdateQuantity(quantity)
  },[quantity])
  useEffect(() => {
    setQuantity(product.quantity);
  }, [product.quantity]);
  return (
    <article className="lg:w-fit w-full h-fit flex gap-3 md:gap-9 max-h-[285px]">
      <Image
        src={product.image}
        alt={product.alt}
        width={285}
        height={285}
        layout="intrinsic"
        className=" md:min-w-[285px]  h-auto"
        priority
      />
      <div className="w-full h-[285px] flex flex-col justify-between p-3">
        <div className="w-full h-fit flex gap-3 justify-between items-start ">
          <div className="flex  w-full flex-col gap-[6px]">
            <h2 className="w-full">{product.title}</h2>
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
              className="min-w-[20px] max-w-[20px]"
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
