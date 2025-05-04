import React from 'react';

const NotFound = () => {
  return (
    <main role="main" className="flex flex-col gap-[30px] dynamic-x-padding my-24">
      <header>
        <h1 className="text-[#16767E]" tabIndex={0}>
          Oops! That Page Can’t Be Found.
        </h1>
      </header>
      <section className="flex flex-col gap-[16px]">
        <p>
          This page may have moved or been replaced. Please browse the top navigation menu, or click below to visit our home page.
        </p>
        <a href="/" className="cursor-pointer hover:underline" aria-label="Go to the homepage">
          Visit Home Page
        </a>
      </section>
    </main>
  );
}

export default NotFound;