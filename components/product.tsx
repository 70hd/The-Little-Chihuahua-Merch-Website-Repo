import Image from "next/image";
import React from "react";

type ProductProps = {
  image: string;
  title: string;
  alt: string;
  price: number;
  status: string;
};

const Product = ({ image, title, price, status, alt }: ProductProps) => {
  const formattedPrice = `$${price.toFixed(2)}`;
  return (
    <article
      className="w-full h-fit flex flex-col gap-3"
      aria-label={`Product: ${title}`}
    >
      <Image
        src={image}
        width={285}
        height={220}
        alt={alt}
        className="w-full"
        priority
      />
      <section className="w-full flex flex-col gap-[6px] pl-2">
        <header className="w-full flex flex-col">
          <p className="text-[#CD3626]" aria-label={`Status: ${status}`}>
            {status}
          </p>
          <h5 aria-label={`Title: ${title}`}>{title}</h5>
        </header>
        <h4 aria-label={`Price: ${formattedPrice}`}>{formattedPrice}</h4>
      </section>
    </article>
  );
};

export default Product;
