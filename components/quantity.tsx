import Image from "next/image";
import React from "react";

type ToggleSumChangeProps = {
  number: number;
  setNumber: React.Dispatch<React.SetStateAction<number>>;
};

const Quantity = ({ number, setNumber }: ToggleSumChangeProps) => {
  const handleChange = (action: "increment" | "decrement") => {
    setNumber((prev) =>
      action === "increment" ? prev + 1 : Math.max(prev - 1, 1)
    );
  };
  type UpdateSumProps = {
    src: string;
    onClick: () => void;
    label: string;
  };
  const UpdateSum = ({ src, onClick, label }: UpdateSumProps) => (
    <button type="button" onClick={onClick} aria-label={label} className={`${number === 1 && src.toLowerCase().includes("minus") ? "cursor-not-allowed": "cursor-pointer"}`}>
      <Image
        src={src}
        width={20}
        height={20}
        alt={`A ${
          src.toLowerCase().includes("plus") ? "plus" : "minus"
        } icon used to adjust the quantity number`}
        className="min-w-[20px] max-w-[20px]"
      />
    </button>
  );

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
