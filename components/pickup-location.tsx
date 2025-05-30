"use client";
import ChangePickupTime from "@/app/modals/change-pickup-time";
import Button from "@/components/button";
import { PickupContext } from "@/context/pickup-context";
import { useContext, useState } from "react";

const PickupLocation = () => {
  const { location, time, setPickupDetails } = useContext(PickupContext);
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  return (
    <div
      className="relative w-fit flex-wrap h-fit flex gap-6"
      aria-label="Pickup location section"
    >
      <div className="flex flex-col">
        <h2 className="sr-only" id="pickup-location-heading">
          Pickup Location Details
        </h2>
        <p>
          <strong>Pickup from:</strong> {location}
        </p>
        <p>
          <strong>Time:</strong> {time}
        </p>
      </div>
      <Button
        primary={false}
        action={toggleModal}
        aria-label="Change pickup date"
      >
        Change Pickup Date
      </Button>

      {modal && (
        <div
          className="fixed inset-0 bg-black/0 z-0"
          onClick={toggleModal}
          aria-hidden="true"
        />
      )}
      <ChangePickupTime
        modal={modal}
        checkout={false}
        setModal={setModal}
        setPickupDetails={setPickupDetails}
      />
    </div>
  );
};

export default PickupLocation;
