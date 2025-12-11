import type { Metadata } from "next";
import { Literata } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Navkar Siddhi Tap",
  description: "Count your Navkar mantras with mala tapping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${literata.variable} font-body antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
