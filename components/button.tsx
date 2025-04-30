import Link from "next/link";
import React from "react";

type ButtonProps = {
  action?: () => void;
  children: React.ReactNode;
  link?: string;
  disabled?: boolean;
  isFooter?: boolean;
  primary?: boolean
};

const Button = ({
  action,
  children,
  link,
  disabled = false,
  isFooter,
  primary
}: ButtonProps) => {
  const button = (
    <button
      type="button"
      onClick={action}
      disabled={disabled}
      aria-label={typeof children === `string` ? children : "Primary button"}
      className={`px-[1.2rem] py-[6px] ${primary ? "bg-[#CD3626] text-white" : " text-[#CD3626]"}  ${ !disabled && primary ? "hover:bg-black" : "hover:border-black"}  transition transform duration-500 h-fit ${!isFooter ? primary ? "border border-white " : "border border-[#CD3626]" : "border-0"}${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : primary ? "text-white cursor-pointer" : "text-[#CD3626] cursor-pointer" 
      }`}
    >
      {isFooter? <h1>{children}</h1> : <h3>{children}</h3>}
    </button>
  );
  if (link) {
    const isExternal = link.startsWith(`http`);
    return isExternal ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        {button}
      </a>
    ) : (
      <Link href={link}>{button}</Link>
    );
  }
  return button;
};

export default Button;
