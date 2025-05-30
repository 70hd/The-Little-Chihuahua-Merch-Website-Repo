import Button from "@/components/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav
      className="sticky w-full z-40 h-[83px] dynamic-x-padding"
      aria-label="Main Navigation"
    >
      <div className="w-full  flex justify-between px-1 pt-[0.7rem] pb-[0.55rem]">
        <Link href={"/"}>
          <Image
            src="/images/logo.svg"
            width={140}
            height={140}
            alt="The Little Chihuahua logo"
          />
        </Link>
        <div className="flex gap-6">
          <Link href={"/contact"}>
            <h3 className="text-[#CD3626]">Contact</h3>
          </Link>

          <Button primary={true} link="/cart">
            CART
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
