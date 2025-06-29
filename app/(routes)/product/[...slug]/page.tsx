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
import NotFound from "@/app/not-found";
import Product from "@/components/product";

interface PriceOption {
  price: number;
}

interface SizeOption {
  id?: number;
  size: string;
  status?: string;
  inventory?: number | undefined;
}
interface Errors {
  email: string;
  size: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  colorName: string;
  colorHex: string;
  priceOptions: PriceOption[];
  sizeOptions: SizeOption[];
  status: string;
  images: { image: string; alt: string; id: number }[];
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
  const [restockNotification, setRestockNotification] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({ email: "", size: "" });
  const [restockLoading, setRestockLoading] = useState(false);
  const [maxQuantity, setMaxQuantity] = useState(100);
  
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    if (size.size !== "Select Size") {
      const option = product?.sizeOptions.find((opt) => opt.size === size.size);
      if (option && typeof option.inventory === "number") {
        setMaxQuantity(option.inventory);
      }
    } else {
      setMaxQuantity(100);
    }
  }, [size.size, product]);

  useEffect(() => {
    if (size.size === "Select Size") {
      setMaxQuantity(100);
    }
  }, [size]);
  const ToggleRestockNotification = async () => {
    setRestockLoading(true);

    const isValidEmail = /^\S+@\S+\.\S+$/.test(restockNotification);
    if (!isValidEmail) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      setRestockLoading(false);
      return;
    }

    setErrors((prev) => ({ ...prev, email: "" }));
    try {
      const res = await fetch("/api/restock-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: restockNotification, id: product?.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, email: err.message }));
    } finally {
      setRestockNotification("");
      setRestockLoading(false);
    }
  };

  const HandleRestockNotificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRestockNotification(e.target.value);
  };

  useEffect(() => {
    const filteredProduct = products?.find((p) => p.title === url);
    if (filteredProduct) {
      setProduct({
        ...filteredProduct,
        id: Number(filteredProduct.id),
        sizeOptions: filteredProduct.sizeOptions.map((sizeOption, index) => ({
          ...sizeOption,
          id: index,
        })),
        images: filteredProduct.images ?? [],
      });

      setColor({
        colorName: filteredProduct.colorName,
        colorHex: filteredProduct.colorHex,
      });
      setPrice(filteredProduct.priceOptions[0]);

      const filteredRecommendations = products
        ?.filter((p) => p.title !== filteredProduct.title)
        ?.sort(() => Math.random() - 0.5)
        .slice(0, 3) ?? [];
      setRecommended(filteredRecommendations);
    }
  }, [products, url]);

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

  const toggleSubmit = () => {
    if (size.size === "Select Size") {
      setSizeError(true);
      return;
    }

    if (product && color.colorHex && color.colorName && product.id.toString()) {
      addToCart({
        id: product.id.toString(),
        title: product.title,
        price: typeof price === "number" ? price : price.price,
        color: color.colorName,
        size: size.size,
        quantity,
        image:
          product.images?.map((img) => ({
            id: img.id,
            productId: product.id,
            image: img.image,
            alt: img.alt,
          })) ?? [],
      });
      setModal(true);
    }
  };

  if (
    (url?.toLowerCase() !== product?.title.toLowerCase() && !loading) ||
    error
  ) {
    return <NotFound product={true} />;
  }

  return (
    <div className="flex flex-col gap-9 dynamic-x-padding dynamic-24-y-padding">
    <div className="flex flex-col lg:flex-row gap-8 items-center">
      <ProductImages
        imageOptions={
          product?.images?.map((img, index) => ({
            id: img.id,
            image: img.image,
            alt: img.alt,
          })) || []
        }
      />

      <div className="w-full h-fit flex flex-col gap-6 ">
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

          <h1 className="text-2xl font-semibold">
            {loading ? url : product?.title}
          </h1>
        </div>

        <p>{product?.description}</p>

        <div className="flex flex-col gap-2">
          <p>Color: {loading ? "loading" : `${color.colorName}`}</p>
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

        {product?.status !== "OUT_OF_STOCK"
          ? !loading && (
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
                      const value = e.target.value;

                      if (value === "Select Size") {
                        setSize({ id: 0, size: "Select Size" });
                        return;
                      }

                      const selectedSize = product?.sizeOptions.find(
                        (opt) => opt.size === value
                      );
                      if (selectedSize) {
                        setSize(selectedSize);
                      }
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
                            {opt.status === "OUT_OF_STOCK"
                              ? "(Out of Stock)"
                              : ""}
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

                <div className="flex flex-wrap gap-6 items-center">
                  <Quantity
                    setNumber={setQuantity}
                    number={quantity}
                    maxQuantity={maxQuantity}
                  />
                  <Button primary={true} action={toggleSubmit}>
                    Add to cart
                  </Button>
                </div>
              </div>
            )
          : !loading && (
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="email"
                  className={`${errors.email ? "text-[#CD3626]" : ""}`}
                >
                  {errors.email ? errors.email : "Notify me when it’s back"}
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-full max-w-[248px]">
                    <Input
                      id="email"
                      name="email"
                      value={restockNotification}
                      action={(e) => HandleRestockNotificationChange(e)}
                      placeholder="Email"
                      required={true}
                    />
                  </div>
                  <Button primary={false} action={ToggleRestockNotification}>
                    {restockLoading ? "...Loading" : "Notify Me"}
                  </Button>
                </div>
              </div>
            )}
      </div>
       
      {modal && (
        <div
          className="fixed top-0 left-0 w-full h-screen z-40 bg-black/25"
          onClick={() => setModal(false)}
        />
      )}
      <Cart canScroll={false} modal={modal} setModal={setModal} value={1} />
    </div>
    <div className="py-6 flex flex-col gap-6">
      <h2>
        Featured Products
      </h2>
     <div className="flex gap-6 md:flex-row flex-col">
          {!loading && recommended.length > 0
            ? recommended.map((product: Product) => (
                <Product
                  key={product.id}
                  status={product.status}
                  price={formatPrice(product)}
                  title={product.title}
                  image={
                    product.images?.map((img) => ({
                      id: img.id,
                      productId: product.id,
                      image: img.image,
                      alt: img.alt,
                    })) ?? []
                  }
                  alt="custom alt"
                  size={product.sizeOptions.map((opt) => opt.size)}
                  fullSize={product.sizeOptions.map((opt, i) => ({
                    size: opt.size,
                    productId: product.id,
                    id: opt.id ?? i,
                    inventory: opt.inventory ?? 0,
                    status: opt.status ?? "UNKNOWN"
                  }))}
                  loading={loading}
                />
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-full h-[392px] loader" />
              ))}
        </div>
        </div>
        </div>
  );
};

export default ProductPage;
