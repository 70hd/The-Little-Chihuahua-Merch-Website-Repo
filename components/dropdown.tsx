import React, { useState } from "react";
import AnimatedArrow from "./animated-arrow";

const Dropdown = ({
  products,
  setProducts,
}: {
  products: Array<{
    price: number;
    [key: string]: any;
  }>;
  setProducts: (products: any[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("Featured");
  const filterOptions = ["Featured", "Price: High-Low", "Price: Low-High"];

  const handleSort = (filter: string) => {
    setIsOpen(false);
    setCurrentFilter(filter);
    let sortedProducts;
    const getPrice = (product: any) => {
      const options = product.priceOptions;
      if (Array.isArray(options)) {
        return options[1]?.price ?? options[0]?.price ?? 0;
      }
      return options?.price ?? 0;
    };

    switch (filter) {
      case "Price: High-Low":
        sortedProducts = [...products].sort(
          (a, b) => getPrice(b) - getPrice(a)
        );
        break;
      case "Price: Low-High":
        sortedProducts = [...products].sort(
          (a, b) => getPrice(a) - getPrice(b)
        );
        break;
      default:
        sortedProducts = [...products];
    }
    setProducts(sortedProducts);
  };
  if (!Array.isArray(products)) return null;
  return (
    <div className="w-fit h-fit  z-10 relative items-start min-w-[225px] flex  lg:justify-end">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex gap-3 items-center w-fit"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Sort products dropdown"
      >
        <p className="text-center ">Sort: {currentFilter}</p>
        <AnimatedArrow isOpen={isOpen} />
      </button>

      <div
        className={`transition-all duration-200 ease-in-out  top-6 absolute  w-fit bg-white ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <ul role="menu" className="flex flex-col gap-2 p-1 md:p-3">
          {filterOptions
            .filter((option) => option !== currentFilter)
            .map((item, index) => (
              <li key={index} role="menuitem">
                <button
                  onClick={() => handleSort(item)}
                  className="cursor-pointer w-fit text-left p-2"
                >
                  {item}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
