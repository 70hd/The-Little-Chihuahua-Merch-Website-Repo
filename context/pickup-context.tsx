"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

interface PickupContextType {
  location: string;
  time: string;
  ship: boolean;
  setPickupDetails: (location: string, time: string, ship: boolean) => void;
}

const defaultContext = {
  location: "4123 24th Street",
  time: "Today: 12:39 PM - 8:00 PM",
  ship: false,
  setPickupDetails: () => {},
};

const PickupContext = createContext<PickupContextType>(defaultContext);

interface PickupProviderProps {
  children: ReactNode;
}

const PickupProvider: React.FC<PickupProviderProps> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  const [pickupContext, setPickupContext] = useState({
    location: "",
    time: "",
    ship: false,
  });

  useEffect(() => {
    setIsMounted(true);
    const locationFromCookie = Cookies.get("location") || "4123 24th Street";
    const timeFromCookie = Cookies.get("time") || "Today: 12:39 PM - 8:00 PM";
    const shipFromCookie = Cookies.get("ship") === "true";

    setPickupContext({
      location: locationFromCookie,
      time: timeFromCookie,
      ship: shipFromCookie,
    });
  }, []);

  useEffect(() => {
   
    if (pickupContext.location) {
      Cookies.set("location", pickupContext.location, { expires: 7 });
    }
    if (pickupContext.time) {
      Cookies.set("time", pickupContext.time, { expires: 7 });
    }
    if (pickupContext.ship !== undefined) {
      Cookies.set("ship", String(pickupContext.ship), { expires: 7 });
    }
  }, [pickupContext]);

  const setPickupDetails = (location: string, time: string, ship: boolean) => {
    setPickupContext({ location, time, ship });
  };


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
