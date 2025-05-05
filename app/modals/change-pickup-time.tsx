import CustomDatePicker from "@/components/date-picker";
import Button from "@/components/button";
import Image from "next/image";
import React, { useState } from "react";

type ChangePickupTimeProps = {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPickupDetails: (location: string, time: string, ship: boolean) => void;
};

const ChangePickupTime = ({ modal, setModal, setPickupDetails }: ChangePickupTimeProps) => {
  if (!modal) return null;

  const [loading, setLoading] = useState(false);

  const options = [
    {
      prompt: "Select Location",
      options: [
        { location: "Polk Street", hours: ": 12:00 PM - 8:00 PM" },
        { location: "Noe Valley", hours: ": 1:00 PM - 9:00 PM" },
        { location: "Lower Haight", hours: ": 11:00 AM - 7:00 PM" },
      ],
      name: "location",
      icon: "/icons/right-arrow.svg",
      onClick: false,
    },
    {
      prompt: "Select Date",
      name: "date",
      icon: "/icons/calender.svg",
      onClick: true,
    },
  ];

  const [formData, setFormData] = useState({
    location: "",
    date: "",
  });
  const [error, setError] = useState({
    location: "",
    date: "",
  });

  const handleSubmit = () => {
    setLoading(true);

    let hasError = false;

    if (!formData.date) {
      setError((prev) => ({ ...prev, date: "Must select a pickup date" }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, date: "" }));
    }

    if (!formData.location) {
      setError((prev) => ({ ...prev, location: "Must select a pickup location" }));
      hasError = true;
    } else {
      setError((prev) => ({ ...prev, location: "" }));
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    const date = new Date(formData.date);
    const matchingHours = options[0]?.options?.find((opt) => opt.location === formData.location)?.hours || "";
    const formattedDate = formatDate(date);

    setPickupDetails(`${formData.location} ${matchingHours}`, formattedDate,false);
    setLoading(false);
    setModal(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Difference in days

    const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" };

    if (diffDays === 0) {
      return `Today, ${date.toLocaleDateString("en-US", options)}`;
    } else if (diffDays === 1) {
      return `Tomorrow, ${date.toLocaleDateString("en-US", options)}`;
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-US", options);
    } else if (diffDays >= 7 && diffDays < 14) {
      return `Next week, ${date.toLocaleDateString("en-US", options)}`;
    } else {
      return date.toLocaleDateString("en-US", options);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="absolute top-16  z-50 left-[236px] w-[392px] h-fit flex flex-col gap-6 p-6 bg-white">
      <div className="w-full flex justify-between">
        <h3 id="modal-heading">Customize Pickup Time</h3>
        <button
          aria-label="Close"
          onClick={() => setModal(false)}
          className="cursor-pointer"
        >
          <Image
            src="/icons/close.svg"
            width={20}
            height={20}
            alt="Close icon"
          />
        </button>
      </div>
      <form className="w-full flex flex-col gap-3" aria-labelledby="modal-heading">
        {options.map((selectOption) => (
          <div key={selectOption.prompt} className="relative w-full flex flex-col gap-3">
            {selectOption.name === "location" && error.location && (
              <p className="text-[#CD3626]" id="location-error">{error.location}</p>
            )}
            {!selectOption.onClick ? (
              <select
                name={selectOption.name}
                value={formData[selectOption.name as "location" | "date"]}
                onChange={handleChange}
                className="border-[.5px] text-[1.1rem] text-black/75 border-black/75 p-3 pr-10 rounded w-full appearance-none focus:outline-none focus:ring-0"
                aria-describedby={selectOption.name === "location" ? "location-error" : undefined}
              >
                <option value="">{selectOption.prompt}</option>
                {selectOption.options &&
                  selectOption.options.map((opt, i) => (
                    <option key={i} value={opt.location}>
                      {opt.location}
                    </option>
                  ))}
              </select>
            ) : (
              <div className="flex flex-col gap-3">
                {selectOption.name === "date" && error.date && (
                  <p className="text-[#CD3626]" id="date-error">{error.date}</p>
                )}
                <CustomDatePicker
                  date={formData.date ? new Date(formData.date) : null}
                  setDate={(selectedDate) => {
                    setFormData((prev) => ({
                      ...prev,
                      date: selectedDate ? selectedDate.toISOString() : "",
                    }));
                  }}
                />
              </div>
            )}
            <Image
              src={`/icons/${
                selectOption.onClick ? "calendar.svg" : "right-arrow.svg"
              }`}
              width={16}
              height={16}
              alt="Dropdown arrow"
              className={`pointer-events-none absolute ${selectOption.name === "date" && error.date || selectOption.name === "location" && error.location ? "top-[60px]" : "top-1/2"} right-4 transform -translate-y-1/2`}
            />
          </div>
        ))}
      </form>
      <Button primary={true} action={handleSubmit}>
        {loading ? "...Submitting" : "Submit"}
      </Button>
    </div>
  );
};

export default ChangePickupTime;