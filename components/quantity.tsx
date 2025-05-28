"use client";
import Image from "next/image";
import React, { useEffect } from "react";

type ToggleSumChangeProps = {
  number: number;
  setNumber: React.Dispatch<React.SetStateAction<number>>;
  maxQuantity?: number;
};

const Quantity = ({ number, setNumber, maxQuantity = 100 }: ToggleSumChangeProps) => {
  useEffect(() => {
    if (number > maxQuantity) {
      setNumber(maxQuantity);
    }
  }, [maxQuantity]);

  const handleChange = (action: "increment" | "decrement") => {
    setNumber((prev) => {
      const newVal = action === "increment" ? prev + 1 : Math.max(prev - 1, 1);
      return Math.min(newVal, maxQuantity);
    });
  };

  const UpdateSum = ({
    src,
    onClick,
    label,
  }: {
    src: string;
    onClick: () => void;
    label: string;
  }) => {
    const isDisabled =
      (number === 1 && label.includes("Decrease")) ||
      (number >= maxQuantity && label.includes("Increase"));

    return (
      <button
        type="button"
        onClick={!isDisabled ? onClick : undefined}
        aria-label={label}
        className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <Image
          src={src}
          width={20}
          height={20}
          alt={label}
          className="min-w-[20px] max-w-[20px]"
        />
      </button>
    );
  };

  return (
    <div className="w-fit h-fit flex gap-6 items-center p-[1.2rem] border border-[221E1F]/50">
      <UpdateSum
        src="/icons/plus.svg"
        onClick={() => handleChange("increment")}
        label="Increase quantity"
      />
      <p>{number}</p>
      <UpdateSum
        src="/icons/minus.svg"
        onClick={() => handleChange("decrement")}
        label="Decrease quantity"
      />
    </div>
  );
};

export default Quantity;