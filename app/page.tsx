"use client";
import React, { useEffect, useState } from "react";
import type { ProductType } from "@/types/product";
import PickupLocation from "@/components/pickup-location";
import Dropdown from "@/components/dropdown";
import Product from "@/components/product";
import { useGetProducts } from "@/hooks/use-get-products";
import { formatPrice } from "@/utils/format-price";


export default function Home() {
  const [finalProducts, setFinalProducts] = useState<ProductType[]>([]);
  const [loading, products, error] = useGetProducts();

useEffect(() => {
  // Ensure products is an array and not null
  setFinalProducts(products || []);
}, [loading, products, error]);

  return (
    <main className="flex flex-col gap-[30px]">
      <section
        className="w-full h-[392px] bg-[url('https://res.cloudinary.com/da8kkevrh/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1746583790/2023_TLC_Product_46-min_n2uyam.jpg')] bg-no-repeat bg-cover z-0 dynamic-x-padding py-24 flex flex-col relative"
        aria-label="Hero banner"
      >
        <h1>
          Your pick. <br /> It's free.
        </h1>
        <p className="w-[392px]">
          Join Taco Bell Rewards to get a free Cantina Chicken Crispy Taco,
          Beefy 5-Layer Burrito, or Soft Taco.
        </p>
      </section>

      <section
        className="flex flex-col gap-[30px] py-12 dynamic-x-padding w-full"
        aria-label="Product and location section"
      >
        <div className="flex flex-wrap gap-3 w-full h-fit justify-between items-center">
          <PickupLocation />
          <Dropdown setProducts={setFinalProducts} products={products || []} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          image={product.images}
          alt="custom alt"
          size={product.sizeOptions}
          loading={loading}
        />
      ))
}
            
        </div>
      </section>
     
    </main>
  );
}
