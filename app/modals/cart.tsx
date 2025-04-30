"use client"
import React, { useEffect } from 'react';

type CartProps = {
  canScroll: boolean;
  modal: boolean;
  value: number;
};

const Cart = ({ canScroll, modal, value }: CartProps) => {
  useEffect(() => {
    if (!canScroll && modal) {
      document.body.classList.add('overflow-hidden');
      return () => document.body.classList.remove('overflow-hidden');
    }
  }, [modal, canScroll]);

  const position = value > 0 ? 'right-0' : 'left-0';
  const translate = modal
    ? 'translate-x-0'
    : value > 0
    ? 'translate-x-full'
    : '-translate-x-full';

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      tabIndex={-1}
      className={`fixed top-0 h-screen z-50 border border-black/25 bg-white custom-2 p-12 pt-14 gap-9 transition-transform duration-500 overflow-hidden flex flex-col ${position} transform ${translate}`}
    >

    </section>
  );
};

export default Cart;