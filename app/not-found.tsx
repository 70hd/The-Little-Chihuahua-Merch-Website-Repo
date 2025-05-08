import React from 'react';

const NotFound = ({product=false, checkout=false}: {product?: boolean, checkout?:boolean}) => {
  return (
    <main role="main" className="flex flex-col gap-[30px] dynamic-x-padding my-24">
      <header>
        <h1 className="text-[#16767E]" tabIndex={0}>
          Oops! {checkout ? "You have no products in your cart" : `That ${product? "Product": "Page"} Can’t Be Found.`}
        </h1>
      </header>
      <section className="flex flex-col gap-[16px]">
        <p>
        {checkout ? "Please browse the top navigation menu, or click below to visit our home page." : `This ${product? "product": "page"} may have moved or been replaced. Please browse the top navigation menu, or click below to visit our home page.`}
          
        </p>
        <a href="/" className="cursor-pointer hover:underline" aria-label="Go to the homepage">
          Visit Home Page
        </a>
      </section>
    </main>
  );
}

export default NotFound;