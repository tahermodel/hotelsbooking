import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google"; // Disabled due to build timeout
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { LiquidFilters } from "@/components/ui/liquid-filters";

// Mock fonts to prevent network timeouts during build
const geistSans = { variable: "font-sans", subsets: ["latin"] };
const geistMono = { variable: "font-mono", subsets: ["latin"] };

/*
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
*/

export const metadata: Metadata = {
  title: "StayEase | Boutique Hotel Booking",
  description: "Secure pay-later hotel reservations",
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
        <LiquidFilters />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
