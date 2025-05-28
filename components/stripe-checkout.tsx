"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/convert-to-sub-currency";
import Button from "./button";
import Input from "./input";
import { PickupContext } from "@/context/pickup-context";
import { useCart } from "@/context/cart-context";

type ShippingField = {
  name: string;
  placeholder: string;
  value: string;
  key: keyof typeof initialShipping;
  required: boolean;
};

const initialShipping = {
  firstName: "",
  lastName: "",
  country: "",
  address: "",
  unitDetails: "",
  city: "",
  state: "",
  postalCode: "",
};
type PriceState = {
  subtotal: number;
  estimatedTaxes: number;
  estimatedOrderTotal: number;
  shippingFee: number;
};
interface CheckoutPageProps {
  amount: number;
  price: PriceState;
}

const CheckoutPageFunc: React.FC<CheckoutPageProps> = ({ amount, price }) => {
  const { cartItems, clearCart } = useCart();
  const { ship, time, location } = useContext(PickupContext);
  const stripe = useStripe();
  const elements = useElements();

  const [userEmail, setUserEmail] = useState("");
  const [shippingInfo, setShippingInfo] = useState(initialShipping);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log(
      JSON.stringify({
        orderId: Date.now(),
        email: userEmail.trim(),
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        amount: convertToSubcurrency(amount),
        sessionId: "1341daf1d14f",
        ship: ship,
        country: shippingInfo.country,

        state: shippingInfo.state,
        city: shippingInfo.city,
        address: shippingInfo.address,
        postalCode: shippingInfo.postalCode,
        unitDetails: shippingInfo.unitDetails,
        location: location,
        pickupTime: time,
        OrderItem: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          id: 2,
          selectedSize: item.size,
          color: item.color,
        })),

      })
    );
  }, [shippingInfo]);


  const handleChange = (key: keyof typeof initialShipping, value: string) =>
    setShippingInfo((prev) => ({ ...prev, [key]: value.trimStart() }));

  const shippingFields: ShippingField[] = [
    {
      name: "First Name",
      placeholder: "First Name",
      value: shippingInfo.firstName,
      key: "firstName",
      required: true,
    },
    {
      name: "Last Name",
      placeholder: "Last Name",
      value: shippingInfo.lastName,
      key: "lastName",
      required: true,
    },
    {
      name: "Country",
      placeholder: "Country",
      value: shippingInfo.country,
      key: "country",
      required: true,
    },
    {
      name: "Address",
      placeholder: "Address",
      value: shippingInfo.address,
      key: "address",
      required: true,
    },
    {
      name: "Unit Details",
      placeholder: "Unit Details",
      value: shippingInfo.unitDetails,
      key: "unitDetails",
      required: false,
    },
    {
      name: "City",
      placeholder: "City",
      value: shippingInfo.city,
      key: "city",
      required: true,
    },
    {
      name: "State",
      placeholder: "State",
      value: shippingInfo.state,
      key: "state",
      required: true,
    },
    {
      name: "Postal Code",
      placeholder: "Postal Code",
      value: shippingInfo.postalCode,
      key: "postalCode",
      required: true,
    },
  ];

  const groupedFields = [
    shippingFields.slice(0, 2),
    shippingFields.slice(2, 3),
    shippingFields.slice(3, 6),
    shippingFields.slice(6, 8),
  ];

  // Email format validation
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validate form fields
  const validateForm = () => {
    if (!isValidEmail(userEmail.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (ship) {
      for (const field of shippingFields) {
        if (field.required && !shippingInfo[field.key].trim()) {
          setErrorMessage(`Please fill out the "${field.name}" field.`);
          return false;
        }
      }
    }

    setErrorMessage(undefined);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet. Please try again shortly.");
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    console.log(
      JSON.stringify({
        amount: convertToSubcurrency(amount),
        email: userEmail.trim(),
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        country: shippingInfo.country,
        address: shippingInfo.address,
        unitDetails: shippingInfo.unitDetails,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.postalCode,
        location: location,
        time: time,
        ship: ship,
        products: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          selectedSize: item.size,
          color: item.color,
        })),
      })
    );

    let secret = clientSecret;
    if (!secret) {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: convertToSubcurrency(amount),
          email: userEmail.trim(),
          // ...shippingInfo,
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          country: shippingInfo.country,
          address: shippingInfo.address,
          unitDetails: shippingInfo.unitDetails,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postalCode: shippingInfo.postalCode,
          location: location,
          time: time,
          ship: ship,
          items: JSON.stringify(cartItems),
          estimatedOrderTotal: price.estimatedOrderTotal,
          estimatedTaxes: price.estimatedTaxes,
          subtotal: price.subtotal,
          shippingFee: price.shippingFee,
        }),
      });
      const data = await res.json();
      secret = data.clientSecret;
      setClientSecret(secret);
      setPaymentIntentId(data.paymentIntentId);
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: secret,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });
    console.log("Confirmed payment intent:", paymentIntent);

    if (error) {
      setErrorMessage(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      const changeInventory = await fetch("/api/change-inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems }),
      });

      clearCart()
window.location.href = `${window.location.origin}/payment-success?payment_intent=${paymentIntent.id}&order_id=${Date.now()}`;
    } else {
      setErrorMessage("Payment was not completed.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white flex flex-col gap-[30px] min-w-[392px]"
    >
      {/* Contact Info */}
      <section
        className="p-12 flex flex-col gap-6 bg-black/5"
        aria-labelledby="contact-info"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-white bg-[#221E1F] rounded-full flex items-center justify-center">
            <span>1</span>
          </div>
          <h2 id="contact-info">Contact</h2>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <label htmlFor="email">
            Email Address <span className="text-[#CD3626]"> *</span>
          </label>
          <Input
            id="email"
            name="email"
            placeholder="Email address"
            value={userEmail}
            action={(e) => setUserEmail(e.target.value)}
            type="email"
            required
          />
        </div>
      </section>

      {/* Shipping Info */}
      {ship && (
        <section
          className="p-12 flex flex-col gap-6 bg-black/5"
          aria-labelledby="shipping-info"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-white bg-[#221E1F]  rounded-full flex items-center justify-center">
              <span>2</span>
            </div>
            <h2 id="shipping-info">Shipping</h2>
          </div>
          <div className="flex flex-col gap-6">
            {groupedFields.map((group, rowIdx) => (
              <div
                key={rowIdx}
                className="flex gap-[30px] w-full flex-col md:flex-row"
              >
                {group.map((field) => (
                  <div key={field.key} className="w-full flex flex-col gap-3">
                    <label htmlFor={field.key}>
                      {field.name}{" "}
                      {field.required && (
                        <span className="text-[#CD3626]"> *</span>
                      )}
                    </label>
                    <Input
                      id={field.key}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={field.value}
                      action={(e) => handleChange(field.key, e.target.value)}
                      required={field.required}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Payment Info */}
      <section
        className="p-12 flex flex-col gap-6 bg-black/5"
        aria-labelledby="express-checkout"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-white bg-[#221E1F]  rounded-full flex items-center justify-center">
            <span>{ship ? 3 : 2}</span>
          </div>
          <h2 id="express-checkout">Express Checkout</h2>
        </div>
        <PaymentElement />
      </section>

      {errorMessage && (
        <div role="alert" className="text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      <div>
        <Button primary type="submit" disabled={loading}>
          {loading ? "Processing..." : `Pay $${amount}`}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutPageFunc;
