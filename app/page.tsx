"use client";
import React, { useEffect, useState } from "react";
// import type { ProductType } from "@/types/product";
import PickupLocation from "@/components/pickup-location";
import Dropdown from "@/components/dropdown";
import Product from "@/components/product";
import { useGetProducts } from "@/hooks/use-get-products";
import { formatPrice } from "@/utils/format-price";

interface PriceOption {
  price: number;
}

interface SizeOption {
  id?: number; // make optional
  size: string;
  status?: string;
}
interface Errors {
  email: string;
  size: string;
}

interface ProductType {
  id: number;
  title: string;
  description: string;
  colorName: string;
  colorHex: string;
  priceOptions: PriceOption[];
  sizeOptions: SizeOption[];  // sizeOptions now works with the optional 'id'
  status: string;
  images: { image: string; alt: string; id: number }[];
}
export default function Home() {
  const [finalProducts, setFinalProducts] = useState<ProductType[]>([]);
  const [loading, products, error] = useGetProducts();

useEffect(() => {
  // Ensure products is an array and not null
  setFinalProducts(products || []);
}, [loading, products, error]);

  return (
    <main className="flex flex-col gap-[30px] overflow-hidden">
      <section
        className="w-full  h-[392px] bg-[url('/images/hero.png')]  text-white bg-no-repeat bg-cover z-0 dynamic-x-padding dynamic-24-y-padding bg-top flex flex-1 flex-col relative"
        aria-label="Hero banner"
      >
        <h1>
          Your pick. <br /> It's free.
        </h1>
        <p className="w-full max-w-[392px]">
          Join Taco Bell Rewards to get a free Cantina Chicken Crispy Taco,
          Beefy 5-Layer Burrito, or Soft Taco.
        </p>
      </section>

      <section
        className="flex flex-col gap-[30px]  md:py-12 dynamic-x-padding w-full"
        aria-label="Product and location section"
      >
        <div className="flex flex-wrap gap-3 w-full h-fit justify-between items-center">
          <PickupLocation />
          <Dropdown
            setProducts={setFinalProducts}
            products={(products || []).map((p) => ({
              ...p,
              price: p.priceOptions?.[0]?.price ?? 0,
            }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
        {
  loading
    ? Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-full h-[392px] loader" />
      ))
    : finalProducts.map((product: ProductType) => (
        <Product
          key={product.id}
          status={product.status}
          price={formatPrice(product)}
          title={product.title}
          image={ product.images?.map((img) => ({
            id: img.id,
            productId: product.id,
            image: img.image,
            alt: img.alt,
          })) ?? []}
          alt="custom alt"
          size={product.sizeOptions.map((opt) => opt.size)}
          loading={loading}
        />
      ))
}
            
        </div>
      </section>
     
    </main>
  );
}
