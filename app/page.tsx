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
        className="w-full h-[392px] bg-[url('/images/test-image.png')] bg-no-repeat bg-cover z-0 dynamic-x-padding py-24 flex flex-col relative"
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
          <Dropdown setProducts={setFinalProducts} products={products} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && finalProducts?.length ? (
            finalProducts.map((product: ProductType) => {
              return (
                <Product
                  key={product.id}
                  status={product.status}
                  price={formatPrice(product)}
                  title={product.title}
                  image="/images/test-image.png"
                  alt="custom alt"
                  size={product.sizeOptions}
                />
              );
            })
          ) : (
            <p>{loading ? "Loading..." : "No products available"}</p>
          )}
        </div>
      </section>
     
    </main>
  );
}
