import { CldImage } from "next-cloudinary";
import Link from "next/link";
import React, { useState } from "react";
import QuickAdd from "./quick-add";

type ProductProps = {
  image: { id: number; productId: number; image: string, alt: string }[];
  title: string;
  alt: string;
  price: string;
  status: string;
  size: string | string[];
  loading: boolean
};

const Product = ({ image,loading, size, title, price, status, alt }: ProductProps) => {
  const [hover, setHover] = useState(false);
  const [cartModal, setCartModal] = useState(false);
  // console.log(image[0])

  const formattedStatus = status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^./, (c) => c.toUpperCase());
  const dynamicImage = hover ? 1 : 0;


  return (
    
    <article aria-label={`Product: ${title}`} className="relative">
      <div className="w-full flex flex-col gap-3">
        <div
          className="relative w-full"
          onMouseEnter={() => !cartModal && setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <Link href={`/product/${title}`}>
            <CldImage
              src={image[dynamicImage].image} // Use this sample image or upload your own via the Media Explorer
              width="500" // Transform the image: auto-crop to square aspect_ratio
              height="500"
              alt={image[dynamicImage]?.alt}
              crop={{
                type: "auto",
                source: true,
              }}
            />
          </Link>
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            <div className="pointer-events-auto">
              <QuickAdd
                setCartModal={setCartModal}
                cartModal={cartModal}
                hover={hover}
                size={size}
                setHover={setHover}
              />
            </div>
          </div>
        </div>

        <Link href={`/product/${title}`} passHref>
          <section className="w-full flex flex-col gap-[6px] pl-2">
            <header className="w-full flex flex-col">
              {(formattedStatus === "Low stock" ||
                formattedStatus === "Out of stock") && (
                <p className="text-[#CD3626]" aria-label={`Status: ${status}`}>
                  {formattedStatus}
                </p>
              )}
              <h5 aria-label={`Title: ${title}`} id={`product-title-${title}`}>
                {title}
              </h5>
            </header>
            <h4
              aria-labelledby={`product-title-${title}`}
              aria-label={`Price: ${price}`}
            >
              {price}
            </h4>
          </section>
        </Link>
      </div>
    </article>
  );
};

export default Product;
