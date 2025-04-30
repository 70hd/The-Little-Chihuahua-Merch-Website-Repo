"use client"
import ChangePickupTime from "@/app/modals/change-pickup-time";
import Button from "@/components/button";
import { PickupContext } from "@/context/pickup-context";
import { useContext, useState } from "react";

const PickupLocation = () => {
  const { location, time, setPickupDetails } = useContext(PickupContext);
  const [modal, setModal] = useState(false);

  // Toggle the modal visibility
  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  return (
    <div className="relative w-fit h-fit flex gap-6">
      <div className="flex flex-col pl-[236px]">
        <p>Pickup from {location}</p>
        <p>{time}</p>
      </div>
      <Button primary={false} action={toggleModal}>
        Change Time
      </Button>
     {/* {modal && <div className="absolute w-screen h-screen  cursor-pointer z-10" onClick={toggleModal}/>} */}
     {modal && <div
          className="fixed inset-0 bg-black/0 z-0"
          onClick={toggleModal}
        />}
      <ChangePickupTime modal={modal} setModal={setModal} setPickupDetails={setPickupDetails} />
    </div>
  );
};

export default PickupLocation;