"use client";

import { useContext, useEffect, useState } from "react";
import { PickupContext } from "../context/pickup-context";
import Image from "next/image";
import Button from "./button";
import ChangePickupTimeModal from "@/app/modals/change-pickup-time";
import Input from "./input";

type PriceState = {
  subtotal: number;
  estimatedTaxes: number;
  estimatedOrderTotal: number;
  shippingFee: number;
};

interface PaymentDetailsProps extends PriceState {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  setPrice: React.Dispatch<React.SetStateAction<PriceState>>;
}

const PaymentDetails = ({
  setStatus,
  subtotal,
  estimatedTaxes,
  estimatedOrderTotal,
  shippingFee,
  setPrice,
}: PaymentDetailsProps) => {
  const { location, time, ship, setPickupDetails } = useContext(PickupContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponValue, setCouponValue] = useState("");
  const [couponBoolean, setCouponBoolean] = useState(false);

  const couponCode = "NEWMERCH10";

  const pricingDetails = [
    { title: "Subtotal", amount: subtotal * (couponBoolean ? 0.9 : 1) },
    ...(ship ? [{ title: "Shipping Fee", amount: shippingFee }] : []),
    ...(couponBoolean ? [{ title: "Coupon Code", amount: "10% OFF" }] : []),
    { title: "SF Sales Tax", amount: estimatedTaxes },
    {
      title: "Order Total",
      amount: estimatedOrderTotal,
    },
  ];

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    couponCode === couponValue
      ? setCouponBoolean(true)
      : setCouponBoolean(false);
  }, [couponValue]);

  useEffect(() => {
    couponBoolean
      ? setPrice((prev) => ({
          ...prev,
          estimatedOrderTotal: subtotal * 0.9 + estimatedTaxes + shippingFee,
        }))
      : setPrice((prev) => ({
          ...prev,
          estimatedOrderTotal: subtotal + estimatedTaxes + shippingFee,
        }));
  }, [couponBoolean]);

  const HandleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponValue(e.target.value);
  };
  return (
    <section className="relative py-6 g-black lg:w-fit sm:min-w-[325px] w-full px-6 flex flex-col gap-[30px]">
      <h2>How to get it</h2>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/0 z-0"
          onClick={handleToggleModal}
          aria-hidden="true"
        />
      )}
      <div className="w-fit h-fit flex flex-col gap-3">
        <h5>Pickup</h5>
        <div className="flex flex-col gap-3">
          <div
            className={`flex flex-col relative gap-3 w-full max-w-[285px] ${
              ship ? "opacity-40 cursor-not-allowed" : ""
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
                onClick={handleToggleModal}
                disabled={ship}
                className={`flex items-center w-full gap-2 ${
                  ship ? "cursor-not-allowed opacity-80" : ""
                } focus:outline-none focus:ring`}
                aria-label={`Change pickup ${item}`}
              >
                <Image
                  src="/icons/pin.svg"
                  width={20}
                  height={20}
                  alt={`Pickup ${item} icon`}
                  className={ship ? "opacity-80" : ""}
                />
                <span className={ship ? "line-through opacity-80" : ""}>
                  {item === "location" ? location : time}
                </span>
              </button>
            ))}
          </div>
          <h5>Get it Delivered</h5>

          <div className="flex gap-[6px] items-center">
            <input
              type="checkbox"
              checked={ship}
              onChange={() => setPickupDetails(location, time, !ship)}
              className="appearance-none w-[17px] h-[17px] border bg-black/5 border-[#D1D5DB] rounded-none checked:bg-[#3875CB]"
              aria-label="Toggle shipping option"
            />
            <p>Ship it to me</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h5>Coupon Code</h5>
        <Input
          id="coupon"
          name="coupon"
          value={couponValue}
          action={(e) => HandleCouponChange(e)}
          placeholder="Coupon Code"
        />
      </div>
      <div className="flex w-full flex-col gap-3">
        {pricingDetails.map(
          (item, index) =>
            item?.title && (
              <div
                key={index}
                className="flex justify-between w-full text-base"
              >
                <p>{item.title}</p>
                {typeof item.amount === "number" ? (
                  <p>${item.amount.toFixed(2)}</p>
                ) : (
                  <p>{item.amount}</p>
                )}
              </div>
            )
        )}
      </div>

      <div>
        <Button primary={true} action={() => setStatus("CHECKOUT")}>
          Continue to Payment
        </Button>
      </div>
    </section>
  );
};

export default PaymentDetails;
