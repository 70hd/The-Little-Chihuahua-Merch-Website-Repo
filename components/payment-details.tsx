"use client";

import { useContext, useEffect, useState } from "react";
import { PickupContext } from "../context/pickup-context";
import Image from "next/image";
import Button from "./button";
import ChangePickupTimeModal from "@/app/modals/change-pickup-time";

type PriceState = {
  subtotal: number;
  estimatedTaxes: number;
  estimatedOrderTotal: number;
  shippingFee: number
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};

const PaymentDetails = ({
  setStatus,
  subtotal,
  estimatedTaxes,
  estimatedOrderTotal,
  shippingFee
}: PriceState) => {
  const { location, time, ship, setPickupDetails } = useContext(PickupContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isShippingFee = ship && { title: "Shipping Fee", amount: shippingFee };

  const pricingDetails = [
    { title: "Subtotal", amount: subtotal },
    { title: "Estimated Taxes", amount: estimatedTaxes },
    { ...isShippingFee },
    {
      title: "Estimated Order Total",
      amount: estimatedOrderTotal,
    },
  ];

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <section className="relative py-6 g-black lg:w-fit sm:min-w-[285px] w-full px-6 flex flex-col gap-[30px]">
      <h2>How to get it</h2>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/0 z-0"
          onClick={handleToggleModal}
          aria-hidden="true"
        />
      )}

      <div className={`flex flex-col gap-3`}>
        <div
          className={`flex flex-col relative gap-3 w-full max-w-[285px]  ${
            ship ? "opacity-40 cursor-not-allowed " : ""
          }`}
        >
          <ChangePickupTimeModal
            checkout={true}
            modal={isModalOpen}
            setModal={setIsModalOpen}
            setPickupDetails={setPickupDetails}
          />
          {["location", "time"].map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleToggleModal()}
              disabled={ship}
              className={` ${
                ship ? "cursor-not-allowed" : ""
              } flex items-center w-full  gap-2 cursor-pointer focus:outline-none focus:ring `}
              aria-label={`Change pickup ${item}`}
            >
              <Image
                src="/icons/pin.svg"
                width={20}
                height={20}
                aria-label={`Pickup ${item} Icon`}
                alt="Pickup location icon"
                className={`${ship ? "opacity-80 cursor-not-allowed" : ""}`}
              />
              <span
                className={`${
                  ship ? "opacity-80 cursor-not-allowed line-through" : ""
                }`}
              >
                {item === "location" ? location : time}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-[6px] items-center ">
          <input
            type="checkbox"
            checked={ship}
            onChange={() => setPickupDetails(location, time, !ship)}
            className={`appearance-none w-[17px] h-[17px] border bg-black/5 border-[#D1D5DB] rounded-none
            checked:bg-[#3875CB]
`}
          />
          <p>Ship it to me</p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3">
        {pricingDetails.map(
          (item, index) =>
            item?.title && (
              <div
                key={index}
                className="flex justify-between w-full text-base"
              >
                <p>{item?.title}</p>
                <p>${item?.amount}.00</p>
              </div>
            )
        )}
        <p>Additional taxes and fees will be calculated at checkout.</p>
      </div>

      <div>
        <Button primary={true} action={() => setStatus("CHECKOUT")}>Continue to Payment</Button>
      </div>
    </section>
  );
};

export default PaymentDetails;
