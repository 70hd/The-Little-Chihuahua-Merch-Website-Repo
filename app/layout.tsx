import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./layout/navbar";
import Footer from "./layout/footer";
import { PickupProvider } from "@/context/pickup-context";
import { CartProvider } from "@/context/cart-context";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Little Chihuahua Merch",
  description:
    "Official merch from The Little Chihuahua — wear your love for sustainable & wholesome Mexican food. 🌯 Rep SF vibes from Lower Haight, Noe Valley & Polk Street.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <PickupProvider>
            <Navbar />
            {children}
            <Footer />
          </PickupProvider>
        </CartProvider>
      </body>
    </html>
  );
}
