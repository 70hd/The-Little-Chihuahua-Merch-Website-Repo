"use client"
import CartDisplay from '@/components/cart-display'
import PaymentDetails from '@/components/payment-details'
import React from 'react'

const Checkout = () => {
  return (
    <div className='flex gap-[30px] lg:flex-row flex-col justify-between dynamic-x-padding mt-24'>
        <div className='w-fit lg:h-fit '>
        <CartDisplay button={false} checkout={true}/>
        </div>
        
        <PaymentDetails/>

    </div>
  )
}

export default Checkout