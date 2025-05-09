import Link from "next/link";
import React from "react";

type SecondaryButtonProps = {
  action?: () => void;
  children: React.ReactNode;
  link?: string;
  disabled?: boolean;
  isFooter?: boolean;
};

const SecondaryButton = ({
  action,
  children,
  link,
  disabled = false,
  isFooter,
}: SecondaryButtonProps) => {
  const button = (
    <button
      type="button"
      onClick={action}
      disabled={disabled}
      aria-label={typeof children === `string` ? children : "Secondary button"}
      className={`px-[1.2rem] py-[6px]  ${
        !disabled && "hover:bg-black"
      } text-white transition transform duration-500 h-fit ${
        !isFooter ? "border border-white " : "border-0"
      }${
        disabled ? "opacity-50 cursor-not-allowed" : "text-white cursor-pointer"
      }`}
    >
      {isFooter ? <h1>{children}</h1> : <h3>{children}</h3>}
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

export default SecondaryButton;
