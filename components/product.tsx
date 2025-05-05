// import Image from "next/image";
// import Link from "next/link";
// import React, { useState } from "react";
// import QuickAdd from "./quick-add"

// type ProductProps = {
//   image: string;
//   title: string;
//   alt: string;
//   price: number | number[];  // Allowing price to be an array
//   status: string;
//   size: string | string[]; 
// };

// const Product = ({ image,size, title, price, status, alt }: ProductProps) => {
//   const [hover,setHover] = useState(false)

  
//   const capitalizedStatus =
//     status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  
//   const noSpaceUnderlineStatus = capitalizedStatus.replace("_", " ");
  
//   return (
//     <article
//     onMouseEnter={() => setHover(true)}
//     onMouseLeave={() => setHover(false)}
//       aria-label={`Product: ${title}`}
//       className="relative"
//     >
//       <Link href={`/product/${title}`} passHref  className="w-full fit flex flex-col gap-3">
       
//           <Image
//             src={image}
//             width={285}
//             height={220}
//             alt={alt || `Image of ${title}`} // Ensure a useful alt description
//             className="w-full"
//             priority
//           />
//           <section className="w-full flex flex-col gap-[6px] pl-2">
//             <header className="w-full flex flex-col">
//               {(noSpaceUnderlineStatus === "Low stock" ||
//                 noSpaceUnderlineStatus === "Out of stock") && (
//                 <p className="text-[#CD3626]" aria-label={`Status: ${status}`}>
//                   {noSpaceUnderlineStatus}
//                 </p>
//               )}
//               <h5
//                 aria-label={`Title: ${title}`}
//                 id={`product-title-${title}`} // Associate with ARIA
//               >
//                 {title}
//               </h5>
//             </header>
//             <h4
//               aria-labelledby={`product-title-${title}`}
//               aria-label={`Price: ${price}`}
//             >
//               {price}
//             </h4>
//           </section>
   
//       </Link>
//       <QuickAdd hover={hover} size={size}/>
//     </article>
//   );
// };

// export default Product;
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import QuickAdd from "./quick-add";

type ProductProps = {
  image: string;
  title: string;
  alt: string;
  price: number | number[];
  status: string;
  size: string | string[];
};

const Product = ({ image, size, title, price, status, alt }: ProductProps) => {
  const [hover, setHover] = useState(false);
  const [cartModal, setCartModal] = useState(false);

  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace("_", " ");

  return (
    <article
    
      aria-label={`Product: ${title}`}
      className="relative"
    >
      <div className="w-full flex flex-col gap-3">

        <div className="relative w-full"  onMouseEnter={() => !cartModal && setHover(true)}
      onMouseLeave={() => setHover(false)}>
          <Link href={`/product/${title}`}   
         >
            <Image
              src={image}
              width={285}
              height={220}
              alt={alt || `Image of ${title}`}
              className="w-full"
              priority
            />
          </Link>
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            <div className="pointer-events-auto">
              <QuickAdd setCartModal={setCartModal} cartModal={cartModal} hover={hover} size={size} setHover={setHover}/>
            </div>
          </div>
        </div>

        <Link href={`/product/${title}`} passHref>
          <section className="w-full flex flex-col gap-[6px] pl-2">
            <header className="w-full flex flex-col">
              {(formattedStatus === "Low stock" || formattedStatus === "Out of stock") && (
                <p className="text-[#CD3626]" aria-label={`Status: ${status}`}>
                  {formattedStatus}
                </p>
              )}
              <h5
                aria-label={`Title: ${title}`}
                id={`product-title-${title}`}
              >
                {title}
              </h5>
            </header>
            <h4
              aria-labelledby={`product-title-${title}`}
              aria-label={`Price: ${price}`}
            >
              {price}
            </h4>
          </section>
        </Link>

      </div>
    </article>
  );
};

export default Product;