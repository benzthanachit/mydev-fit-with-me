import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fit With Me - Tracker",
  description: "3-Month Body Recomposition Tracker",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-gray-950 text-gray-50`}
    >
      <body className="min-h-full flex flex-col justify-between max-w-md mx-auto w-full relative pb-20 shadow-xl overflow-x-hidden bg-gray-950 border-x border-gray-900">
        <main className="flex-grow flex flex-col p-4 w-full">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
