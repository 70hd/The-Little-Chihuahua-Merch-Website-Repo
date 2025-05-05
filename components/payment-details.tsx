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
};

type PickupDetailsState = {
  location: number;
  time: number;
  ship: boolean;
};

const PaymentDetails = ({
  subtotal,
  estimatedTaxes,
  estimatedOrderTotal,
}: PriceState) => {
  const { location, time, ship, setPickupDetails } = useContext(PickupContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    console.log(ship)
  },[
    ship
  ])

  const pricingDetails = [
    { title: "Subtotal", amount: subtotal },
    { title: "Estimated Taxes", amount: estimatedTaxes },
    { title: "Estimated Order Total", amount: estimatedOrderTotal },
  ];

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <section className="relative lg:w-fit w-full p-6 flex flex-col gap-[30px]">
      <h2>How to get it</h2>
{/* {ship === false && (
  <>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/0 z-0"
          onClick={handleToggleModal}
          aria-hidden="true"
        />
      )}

      <ChangePickupTimeModal
        modal={isModalOpen}
        setModal={setIsModalOpen}
        setPickupDetails={setPickupDetails}
      />

      <div className="flex flex-col gap-3">
        {["location", "time"].map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={handleToggleModal}
            className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring"
            aria-label={`Change pickup ${item}`}
          >
            <Image
              src="/icons/pin.svg"
              width={20}
              height={20}
              aria-label={`Pickup ${item} Icon`}
              alt="Pickup location icon"
            />
            <span>{item === "location" ? location : time}</span>
          </button>
        ))}
       
      </div></>)
} */}


      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/0 z-0"
          onClick={handleToggleModal}
          aria-hidden="true"
        />
      )}

      <ChangePickupTimeModal
        modal={isModalOpen}
        setModal={setIsModalOpen}
        setPickupDetails={setPickupDetails}
      />

      <div className={`flex flex-col gap-3 ${ship ? "opacity-40 cursor-not-allowed " : ""}`} >
        {["location", "time"].map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => !ship && handleToggleModal}
            disabled={ship}
            className={` ${ship ? "cursor-not-allowed" : ""} flex items-center gap-2 cursor-pointer focus:outline-none focus:ring `}
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
            <span className={`${ship ? "opacity-80 cursor-not-allowed line-through" : ""}`}>{item === "location" ? location : time}</span>
          </button>
        ))}
       
      </div>

      <div className="flex gap-[6px] items-center "> 
          <input
            type="checkbox"
            checked={ship}
            onChange={() =>
              setPickupDetails(location, time, !ship)
            }
            className={`appearance-none w-[17px] h-[17px] border bg-black/5 border-[#D1D5DB] rounded-none
            checked:bg-[#3875CB]
`}
          />
          <p>Ship it to me</p>
        </div>

      <div className="flex flex-col gap-3">
        {pricingDetails.map((item, index) => (
          <div key={index} className="flex justify-between text-base">
            <p>{item.title}</p>
            <p>${item.amount}.00</p>
          </div>
        ))}
        <p>Additional taxes and fees will be calculated at checkout.</p>
      </div>

      <div>
        <Button primary={true}>Continue to Payment</Button>
      </div>
    </section>
  );
};

export default PaymentDetails;
