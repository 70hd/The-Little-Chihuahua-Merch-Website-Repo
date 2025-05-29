import Button from "@/components/button";
import Image from "next/image";
import React from "react";

const Footer = () => {
  const locations = [
    {
      name: "Polk Street",
      location: "1431 Polk St.",
      zipCode: "San Francisco, CA 94117",
      phoneNumber: "415.796.3600",
      hours: [
        "11am - 9pm (Mon-Weds)",
        "11am - 10pm (Thur-Fri)",
        "10am - 10pm (Sat)",
        "10am - 9pm (Sun)",
      ],
    },
    {
      name: "Noe Valley",
      location: "4123 24th St.",
      zipCode: "San Francisco, CA 94117",
      phoneNumber: "415.648.4157",
      hours: ["11am - 8:30pm (Mon-Fri)", "10am - 8:30pm (Sat-Sun)"],
    },
    {
      name: "Lower Haight",
      location: "292 Divisidero St.",
      zipCode: "San Francisco, CA 94117",
      phoneNumber: "415.255.8225",
      hours: ["11am - 9pm (Mon-Weds)", "10am - 10pm (Sat-Sun)"],
    },
  ];

  return (
    <footer className="w-full flex flex-col">
      <div className="w-full h-fit flex flex-col gap-[24px] dynamic-x-padding py-9 bg-[#16767E] items-center justify-center text-white">
        <div className="w-fit h-fit flex flex-col text-center">
          <h5>The Little Chihuahua</h5>
          <p>Three San Francisco locations to serve you</p>
        </div>
        <Button
          primary={true}
          link="https://www.thelittlechihuahua.com/"
          isFooter={true}
        >
          ORDER FOOD ONLINE
        </Button>
        <div className="w-full flex md:flex-row flex-col gap-[30px] items-start justify-center">
          {locations.map((info, i) => (
            <address
              className="w-full not-italic text-center h-fit flex flex-col px-[15px] pb-6"
              key={i}
            >
              <h2 className="pt-4 pb-1">{info.name}</h2>
              {[info.location, info.zipCode, info.phoneNumber].map(
                (info, i) => (
                  <p key={i}>{info}</p>
                )
              )}
              {info.hours.map((info, i) => (
                <p key={i}>{info}</p>
              ))}
            </address>
          ))}
        </div>
      </div>
      <section className="w-full items-center flex flex-col mt-3 bg-white">
        <p>© 2025 All Rights Reserved.</p>
        <p>www.thelittlechihuahua.com</p>

        <div className="flex gap-[6px] pt-2 pb-3">
          {[
            {
              img: "/icons/facebook.svg",
              link: "https://www.facebook.com/TheLittleChihuahua",
            },
            {
              img: "/icons/instagram.svg",
              link: "https://www.instagram.com/thelittlechihuahua",
            },
            { img: "/icons/twitter.svg", link: "https://x.com/TLChihuahua" },
          ].map((icon, i) => (
            <a href={icon.link} key={i} target="_blank">
              <Image
                src={icon.img}
                width={53}
                height={53}
                alt={`${icon.img
                  .split("/")
                  .pop()
                  ?.replace(".svg", "")} social media icon`}
              />
            </a>
          ))}
        </div>
      </section>
    </footer>
  );
};

export default Footer;
