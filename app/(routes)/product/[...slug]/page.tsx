"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useCurrentUrl from "@/hooks/use-current-url";
import { useGetProducts } from "@/hooks/use-get-products";
import { formatPrice } from "../../../../utils/format-price";
import Quantity from "@/components/quantity";
import Button from "@/components/button";
import ProductImages from "@/components/product-images";
import { useCart } from "@/context/cart-context";
import Cart from "@/app/modals/cart";
import Input from "@/components/input";

// Define the types for PriceOption, SizeOption, and Product
interface PriceOption {
  price: number;
}

interface SizeOption {
  id: number;
  size: string;
}
interface Errors {
  email: string;
  size: string;
}


interface Product {
  id: number | number;
  title: string;
  description: string;
  colorName: string;
  colorHex: string;
  priceOptions: PriceOption[];
  sizeOptions: SizeOption[];
  status: string;
}

const ProductPage = () => {
  const url = useCurrentUrl()?.replace("/product/", "");
  const [product, setProduct] = useState<Product | null>(null);
  const [color, setColor] = useState<{ colorName: string; colorHex: string }>({
    colorName: "",
    colorHex: "",
  });
  const [loading, products, error] = useGetProducts();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<SizeOption>({ id: 0, size: "Select Size" });
  const { addToCart } = useCart();
  const [sizeError, setSizeError] = useState(false);
  const [price, setPrice] = useState<PriceOption | number>(0);
  const [modal, setModal] = useState(false);
  const [notifyMe, setNotifyMe] = useState<string>(""); // instead of useState()
  const [errors,setErrors] = useState<Errors>({email: "", size:""})

  const NotifyMe = () => {
    if (!/^\S+@\S+\.\S+$/.test(notifyMe)) {
      setErrors((prev) => ({ ...prev, email: "Invalid Email" }));
   
    } else {
     
      setErrors((prev) => ({ ...prev, email: "" }));
      console.log(errors)

    }
  };
  const HandleNotifyMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotifyMe(e.target.value);
  };

  // Set product on URL change
  useEffect(() => {
    const filteredProduct = products?.find((p) => p.title === url);
    if (filteredProduct) {
      setProduct({
        ...filteredProduct,
        id: Number(filteredProduct.id), // Ensure id is a number
        sizeOptions: filteredProduct.sizeOptions.map((sizeOption) => ({
          ...sizeOption,
          id: sizeOption.id ?? 0, // Ensure id is included
        })),
      });
      setColor({
        colorName: filteredProduct.colorName,
        colorHex: filteredProduct.colorHex,
      });
      setPrice(filteredProduct.priceOptions[0]);
    }
  }, [products, url]);

  // Update price when size changes
  useEffect(() => {
    if (product?.sizeOptions?.length === 1) {
      setSize(product.sizeOptions[0]);
    }
  }, [product]);

  useEffect(() => {
    if (size.size !== "Select Size") {
      setSizeError(false);
    }
    if (!product || !product.priceOptions) return;
    const sizeValue = size.size.toLowerCase();
    if (sizeValue.startsWith("x") || sizeValue.startsWith("5")) {
      setPrice(product.priceOptions[1] || product.priceOptions[0]);
    } else {
      setPrice(product.priceOptions[0]);
    }
  }, [product, size]);

  // Handle add to cart
  const toggleSubmit = () => {
    if (size.size === "Select Size") {
      setSizeError(true);
      return;
    }

    if (product && color.colorHex && color.colorName) {
      addToCart({
        id: product.id.toString(),
        title: product.title,
        price: typeof price === "number" ? price : price.price,
        color: color.colorName,
        size: size.size,
        quantity,
        image: "", // Placeholder for image
        imageAlt: "",
      });
      setModal(true);
    }
  };

  if (loading) return <p className="px-4 py-8">Loading...</p>;
  if (error)
    return <p className="px-4 py-8 text-red-600">Error loading product.</p>;

  return (
    <div className="flex flex-col lg:flex-row px-4 md:px-16 lg:px-36 xl:px-60 gap-8 py-24 pb-12">
      {/* Product images */}
      <ProductImages
        imageOptions={[
          { image: "/images/test-image.png", alt: "Product image 1" },
          { image: "/images/logo.svg", alt: "Brand logo" },
        ]}
      />

      <div className="w-full h-fit flex flex-col gap-6 py-12">
        <div className="w-full flex flex-col">
          <div className="flex gap-6">
            <p>
              {product
                ? size.size !== "Select Size"
                  ? `$${(price as PriceOption).price}`
                  : formatPrice(product)
                : "...Loading Price"}
            </p>
            {product?.status !== "AVAILABLE" && (
              <p className="text-[#CD3626]">
                {product?.status
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </p>
            )}
          </div>

          <h1 className="text-2xl font-semibold">{product?.title}</h1>
        </div>

        <p>{product?.description}</p>

        <div className="flex flex-col gap-2">
          <p>Color: {color.colorName}</p>
          <div className="flex gap-3">
            <div
              className="w-5 h-5 p-[2px] border border-black"
              role="img"
              aria-label={`Selected color: ${color.colorName}`}
            >
              <div
                className="w-full h-full"
                style={{ backgroundColor: color.colorHex }}
              />
            </div>
            <div className="w-fit h-fit border border-white px-4 py-[6px] rounded-full text-sm text-white">
              {color.colorName}
            </div>
          </div>
        </div>

        {/* Size selector */}
        {product?.status !== "OUT_OF_STOCK" ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 relative">
              <label
                htmlFor="size-select"
                className={`font-medium ${sizeError && "text-[#CD3626]"}`}
              >
                {sizeError ? "Please Select A Size" : "Size"}
              </label>
              <select
                id="size-select"
                className="border text-[1.1rem] text-black/75 border-black/75 p-3 pr-10 rounded w-full appearance-none focus:outline-none focus:ring-0"
                onChange={(e) => {
                  const selectedSize = product?.sizeOptions.find(
                    (opt) => opt.size === e.target.value
                  );
                  if (selectedSize) setSize(selectedSize);
                }}
                aria-label="Select product size"
              >
                {product?.sizeOptions?.length === 1 ? (
                  <option value={product.sizeOptions[0].size}>
                    {product.sizeOptions[0].size}
                  </option>
                ) : (
                  <>
                    <option value="Select Size">Select Size</option>
                    {product?.sizeOptions.map((opt) => (
                      <option
                        key={opt.id}
                        value={opt.size}
                        disabled={opt.status === "OUT_OF_STOCK"}
                        className={
                          opt.status === "OUT_OF_STOCK"
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }
                      >
                        {opt.size}{" "}
                        {opt.status === "OUT_OF_STOCK" ? "(Out of Stock)" : ""}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <Image
                src="/icons/right-arrow.svg"
                width={16}
                height={16}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute top-2/3 right-4 transform -translate-y-1/2"
              />
            </div>

            <div className="flex gap-6 items-center">
              <Quantity setNumber={setQuantity} number={quantity} />
              <Button primary={true} action={toggleSubmit}>
                Add to cart
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
          <label htmlFor="email" className={`${errors.email ? "text-[#CD3626]" : ""}`}>{errors.email ? errors.email: "Notify me when it’s back"}</label>
          <div className="flex gap-3 items-center">
            <div className="w-full max-w-[248px]">
              <Input
                id="email"
                name="email"
                value={notifyMe}
                action={(e) => HandleNotifyMeChange(e)} // use onChange here
                placeholder="Email"
              />
            </div>
            <Button primary={false} action={NotifyMe}> {/* use onClick here */}
              Notify Me
            </Button>
          </div>
        </div>
        )}

      </div>

      {/* Modal */}
      {modal && (
        <div
          className="fixed top-0 left-0 w-full h-screen z-40 bg-black/25"
          onClick={() => setModal(false)}
        />
      )}
      <Cart canScroll={true} modal={modal} setModal={setModal} value={1} />
    </div>
  );
};

export default ProductPage;
