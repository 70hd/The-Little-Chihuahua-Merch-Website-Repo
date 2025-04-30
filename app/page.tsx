import PaymentDetails from "@/components/payment-details";
import PickupLocation from "../components/pickup-location";
import CustomDatePicker from "@/components/date-picker";

export default function Home() {
  return (
    <div className="flex flex-col gap-[30px]">
   <div className="w-full h-[392px] bg-[url('/images/test-image.png')] z-0 px-[236px] py-24 flex flex-col relative">
  <h1>Your pick. <br /> It's free.</h1>
  <p className="w-[392px]">
    Join Taco Bell Rewards to get a free Cantina Chicken Crispy Taco, Beefy 5-Layer Burrito, or Soft Taco.
  </p>
</div>
      <div className="h-fit w-full">
        <PickupLocation/>
        <PaymentDetails/>
      </div>
    </div>
  );
}
