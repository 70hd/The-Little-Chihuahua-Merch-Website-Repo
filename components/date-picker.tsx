"use client";
import React from "react";
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
  return (
    <DatePicker
      selected={date}
      onChange={(selectedDate: Date | null) => setDate(selectedDate)}
      dateFormat="MMMM d, yyyy"
      placeholderText="Click to select a date"
      minDate={today}
      className="w-full text-black/75 border-[0.5px] border-[#221E1F]/75 text-[1.1rem] cursor-pointer rounded-sm p-3 focus:outline-none"
      calendarClassName="bg-black text-white rounded-lg shadow-lg p-4"
      dayClassName={(day) =>
        day < today
          ? "text-gray-400 calender-text"
          : "bg-white text-black hover:bg-black hover:text-white transition calender-text"
      }
      popperClassName=""
    />
  );
};

export default CustomDatePicker;
