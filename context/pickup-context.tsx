"use client"
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import Cookies from "js-cookie";

interface PickupContextType {
  location: string;
  time: string;
  setPickupDetails: (location: string, time: string) => void;
}

const defaultContext = {
  location: '4123 24th Street',
  time: 'Today: 12:39 PM - 8:00 PM',
  setPickupDetails: () => {},
};

const PickupContext = createContext<PickupContextType>(defaultContext);

interface PickupProviderProps {
  children: ReactNode;
}

const PickupProvider: React.FC<PickupProviderProps> = ({ children }) => {
  // State to track if the component is mounted
  const [isMounted, setIsMounted] = useState(false);

  const [pickupContext, setPickupContext] = useState({
    location: '',
    time: '',
  });

  useEffect(() => {
    // This will run after the first render, only on the client
    setIsMounted(true);

    // Retrieve cookies only on the client
    const locationFromCookie = Cookies.get('location') || '4123 24th Street';
    const timeFromCookie = Cookies.get('time') || 'Today: 12:39 PM - 8:00 PM';

    setPickupContext({
      location: locationFromCookie,
      time: timeFromCookie,
    });
  }, []);

  useEffect(() => {
    // If the state is updated, save cookies
    if (pickupContext.location) {
      Cookies.set('location', pickupContext.location, { expires: 7 });
    }
    if (pickupContext.time) {
      Cookies.set('time', pickupContext.time, { expires: 7 });
    }
  }, [pickupContext]);

  const setPickupDetails = (location: string, time: string) => {
    setPickupContext({ location, time });
  };

  // If not mounted yet, return null to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <PickupContext.Provider value={{ ...pickupContext, setPickupDetails }}>
      {children}
    </PickupContext.Provider>
  );
};

export { PickupContext, PickupProvider };