"use client";

import { useContext, useState } from "react";
import { PickupContext } from "../context/pickup-context";
import Image from "next/image";
import Button from "./button";
import ChangePickupTimeModal from "@/app/modals/change-pickup-time";

const PaymentDetails = () => {
  const { location, time, setPickupDetails } = useContext(PickupContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pricingDetails = [
    { title: "Subtotal", amount: 35 },
    { title: "Estimated Taxes", amount: 35 },
    { title: "Estimated Order Total", amount: 35 },
  ];

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <section className="relative lg:w-fit w-full p-6 flex flex-col gap-[30px]">
      <h2>How to get it</h2>

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
        <button
          type="button"
          onClick={handleToggleModal}
          className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring"
          aria-label="Change pickup location"
        >
          <Image
            src="/icons/pin.svg"
            width={20}
            height={20}
            alt="Pickup location icon"
          />
          <span>{location}</span>
        </button>

        <button
          type="button"
          onClick={handleToggleModal}
          className="flex items-center gap-2 cursor-pointer focus:outline-none focus:ring"
          aria-label="Change pickup time"
        >
          <Image
            src="/icons/clock.svg"
            width={20}
            height={20}
            alt="Pickup time icon"
          />
          <span>{time}</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {pricingDetails.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-base"
          >
            <p>{item.title}</p>
            <p>${item.amount}.00</p>
          </div>
        ))}
        <p>
          Additional taxes and fees will be calculated at checkout.
        </p>
      </div>

      <div>
        <Button primary={true}>Continue to Payment</Button>
      </div>
    </section>
  );
};

export default PaymentDetails;
