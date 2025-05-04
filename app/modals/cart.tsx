"use client";
import CartDisplay from '@/components/cart-display';
import { useCart } from '@/context/cart-context';
import React, { useEffect } from 'react';

type CartProps = {
  canScroll: boolean;
  modal: boolean;
  value: number;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Cart = ({ canScroll, modal, setModal, value }: CartProps) => {
  const { cartItems} = useCart();

  useEffect(() => {
    if (!canScroll && modal) {
      document.body.classList.add('overflow-hidden');
      return () => document.body.classList.remove('overflow-hidden');
    }
  }, [modal, canScroll]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setModal(false);
    }
  }, [cartItems, setModal]);

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
      className={`fixed top-0 h-screen w-full md:w-[654px] z-50 border border-black/25 bg-white custom-2 p-12 pt-14 transition-transform duration-500 overflow-y-auto flex flex-col ${position} transform ${translate}`}
    >
      <CartDisplay button={true} checkout={false}/>
    </section>
  );
};

export default Cart;