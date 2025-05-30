"use client";
import React, { useEffect, useState } from "react";
import PickupLocation from "@/components/pickup-location";
import Dropdown from "@/components/dropdown";
import Product from "@/components/product";
import { useGetProducts } from "@/hooks/use-get-products";
import { formatPrice } from "@/utils/format-price";

interface PriceOption {
  price: number;
}

export interface SizeOption {
  id: number;
  productId: number;
  size: string;
  inventory: number;
  status: string;
}

export interface ProductType {
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
export default function Home() {
  const [finalProducts, setFinalProducts] = useState<ProductType[]>([]);
  const [loading, products, error] = useGetProducts();

  useEffect(() => {
    if (Array.isArray(products)) {
      const normalized = products.map((p) => ({
        ...p,
        sizeOptions: p.sizeOptions.map((so) => ({
          id: so.id ?? 0, 
          productId: p.id, 
          size: so.size,
          inventory: so.inventory ?? 0, 
          status: so.status ?? "unknown", 
        })),
      }));
      setFinalProducts(normalized);
    } else {
      setFinalProducts([]);
    }
  }, [loading, products, error]);

  return (
    <main className="flex flex-col gap-[30px] overflow-hidden">
      <section
        className="w-full  h-[392px] bg-[url('/images/hero.png')]  text-white bg-no-repeat bg-cover z-0 dynamic-x-padding dynamic-24-y-padding bg-top flex flex-1 flex-col relative"
        aria-label="Hero banner"
      >
        <h1 className="text-4xl font-bold leading-tight">
          The Little Chihuahua <br /> Official Merch
        </h1>
        <p className="w-full max-w-[392px] text-lg mt-2">
          Gear from the taqueria you love — for you,
          <br /> your friends, and your furry friends.
        </p>
      </section>

      <section
        className="flex flex-col gap-[30px]  md:py-12 dynamic-x-padding w-full"
        aria-label="Product and location section"
      >
        <div className="flex flex-wrap gap-6 w-full h-fit justify-between items-center">
          <PickupLocation />
          <Dropdown
            setProducts={setFinalProducts}
            products={
              Array.isArray(products)
                ? products.map((p) => ({
                    ...p,
                    price: p.priceOptions?.[0]?.price ?? 0,
                  }))
                : []
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full h-[392px] loader" />
              ))
            : Array.isArray(finalProducts) && finalProducts.length > 0
            ? finalProducts.map((product: ProductType) => (
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
                  fullSize={product.sizeOptions}
                  loading={loading}
                />
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full h-[392px] loader" />
              ))}
        </div>
      </section>
    </main>
  );
}
