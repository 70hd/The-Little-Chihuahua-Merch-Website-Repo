"use client";
import Button from "@/components/button";
import Image from "next/image";
import React, { useState } from "react";

const formatLabel = (text: string) =>
  text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([
    { name: "name", value: "", required: true },
    { name: "email", value: "", required: true },
    { name: "phoneNumber", value: "", required: false },
    {
      name: "selectLocation",
      value: "",
      required: false,
      options: ["Noe Valley", "Polk Street", "Lower Haight", "TLC Management"],
    },
    { name: "comments", value: "", required: true },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index: number
  ) => {
    const updated = [...fields];
    updated[index].value = e.target.value;
    setFields(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // const newErrors: Record<string, string> = {};

    // fields.forEach(({ name, value, required }) => {
    //   const val = value.trim();
    //   if (required && !val) newErrors[name] = "This field is required.";
    //   if (name === "email" && val && !/^\S+@\S+\.\S+$/.test(val))
    //     newErrors[name] = "Please enter a valid email address.";
    //   if (name === "phoneNumber" && val && !/^\+?[0-9]{7,15}$/.test(val))
    //     newErrors[name] = "Please enter a valid phone number.";
    // });

    // setErrors(newErrors);

    // if (Object.keys(newErrors).length) return;

    try {
      console.log(
        JSON.stringify(
          Object.fromEntries(fields.map(({ name, value }) => [name, value]))
        )
      );
      const formData = Object.fromEntries(
        fields.map(({ name, value }) => [name, value])
      );
      const res = await fetch("/api/contact-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to submit form");
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const ErrorText = ({ text }: { text: string }) =>
    text ? (
      <div className="border-[.5px] text-[1.1rem] text-[#CD3626]/75 bg-[#CD3626]/5 border-[#CD3626]/75 p-3 pr-10 w-full">
        {text}
      </div>
    ) : null;

  if (submitted) {
    return (
      <div className="px-[236px] pt-[12px] pb-42 w-full flex flex-col gap-6">
        <header>
          <h1 className="text-[#16767E] mb-[1.5rem]" tabIndex={0}>
            Thank You
          </h1>
          <h2 className="text-[#16767E]" tabIndex={0}>
            Your message has been sent!
          </h2>
        </header>
        <section className="flex flex-col gap-[16px]">
          <p>Thank you for reaching out to The Little Chihuahua.</p>
          <h5>
            If your matter is urgent, please call the restaurant, otherwise we
            will get back to you in 24 hours. Thanks!
          </h5>
        </section>
      </div>
    );
  }

  return (
    <div className="px-[236px] my-12">
      <div className="w-full flex flex-col gap-6">
        <h1 className="text-[#16767E]">Contact</h1>
        <h5>
          If your matter is urgent, please call the restaurant, otherwise we
          will get back to you in 24 hours. Thanks!
        </h5>
        <p>Please fill out this form to contact us online.</p>
        <p>
          "<span className="text-[#CD3626]">*</span>" indicates required fields
        </p>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => {
            const id = `field-${field.name}`;
            const isTextarea = field.name.toLowerCase().includes("comment");

            return (
              <div key={index} className="relative flex flex-col gap-3">
                <label htmlFor={id} className="sr-only">
                  {formatLabel(field.name)}
                </label>
                {field.options ? (
                  <>
                    <Image
                      src="/icons/right-arrow.svg"
                      width={16}
                      height={16}
                      alt="Dropdown arrow"
                      className="pointer-events-none absolute top-1/2 right-96 transform -translate-y-1/2"
                    />
                    <select
                      id={id}
                      name={field.name}
                      value={field.value}
                      onChange={(e) => handleChange(e, index)}
                      className={`border-[.5px] text-[1.1rem] border-black/75 p-3 pr-10 rounded w-[606px] appearance-none focus:outline-none focus:ring-0 ${
                        !field.value ? "text-black/40" : "text-black"
                      }`}
                    >
                      <option value="">{formatLabel(field.name)}</option>
                      {field.options.map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </>
                ) : isTextarea ? (
                  <textarea
                    id={id}
                    name={field.name}
                    value={field.value}
                    onChange={(e) => handleChange(e, index)}
                    placeholder={formatLabel(field.name)}
                    className="border-[.5px] text-[1.1rem] text-black/75 border-black/75 p-3 pr-10 rounded appearance-none focus:outline-none focus:ring-0 h-[192px] w-full"
                  />
                ) : (
                  <input
                    id={id}
                    type="text"
                    name={field.name}
                    value={field.value}
                    onChange={(e) => handleChange(e, index)}
                    placeholder={formatLabel(field.name)}
                    className="border-[.5px] text-[1.1rem] text-black/75 border-black/75 p-3 pr-10 rounded appearance-none focus:outline-none focus:ring-0 w-[606px]"
                  />
                )}
                <ErrorText text={errors[field.name]} />
              </div>
            );
          })}
        </div>
        <div>
          <Button primary={false} action={handleSubmit}>
            {loading ? "...Submiting" : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
