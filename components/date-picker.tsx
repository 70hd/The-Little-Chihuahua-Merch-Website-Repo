import Image from "next/image";
import React, { useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type CustomDatePickerProps = {
  setDate: (date: Date | null) => void;
  date: Date | null;
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  setDate,
  date,
}) => {
  const today = new Date();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number | null>(
    null
  );

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const CustomInput = React.forwardRef<
    HTMLInputElement,
    React.HTMLProps<HTMLInputElement>
  >(({ value, onClick }, ref) => (
    <input
      ref={ref}
      readOnly
      value={value}
      onClick={onClick}
      style={{
        width: "100%",
        maxWidth: containerWidth ? `${containerWidth}px` : undefined,
        minWidth: containerWidth ? `${containerWidth}px` : undefined,
      }}
      placeholder="Click to select a date"
      className="block w-full  pr-10 text-black/75 border-[0.5px] border-[#221E1F]/75 text-[1.1rem] cursor-pointer rounded-sm p-3 focus:outline-none"
    />
  ));
  CustomInput.displayName = "CustomInput";

  return (
    <div ref={containerRef} className="relative w-full">
      <Image
        src="/icons/calendar.svg"
        width={16}
        height={16}
        alt="Calendar icon"
        className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2"
      />

      <DatePicker
        selected={date}
        onChange={(selectedDate: Date | null) => setDate(selectedDate)}
        dateFormat="MMMM d, yyyy"
        customInput={<CustomInput />}
        placeholderText="Click to select a date"
        minDate={today}
        popperClassName="!w-full"
        calendarClassName="bg-black text-white rounded-lg"
        popperPlacement="bottom-start"
        className="bg-black p-12 max-w-full w-fit"
        dayClassName={(day) =>
          day < today
            ? "text-gray-400 calender-text"
            : "bg-white text-black hover:bg-black hover:text-white transition calender-text"
        }
      />
    </div>
  );
};

export default CustomDatePicker;
