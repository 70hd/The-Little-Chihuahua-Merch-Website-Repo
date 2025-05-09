import { useState, useEffect } from "react";

type PriceOption = {
  price: number;
  currency: string;
};

type SizeOption = {
  size: string;
  availability: boolean;
};

type Product = {
  images: never[];
  id: number;
  title: string;
  description: string;
  colorHex: string;
  colorName: string;
  status: string;
  inventory: number;
  priceOptions: PriceOption[]; 
  sizeOptions: SizeOption[]; 
};

export const useGetProducts = (): [
  boolean,
  Product[] | null,
  string | null
] => {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/get-products");
        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          setError(data.error || "An error occurred");
        }
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return [loading, products, error];
};
