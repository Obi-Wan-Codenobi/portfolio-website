import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Menu from "@/components/menu-bar"
import Terminal2 from "@/components/terminal2-overlay"

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kodenobi's Blog",
  description: "A blog/portfolio website",
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
        <Terminal2>
        <Menu/>
        <div className="w-full px-16  py-6">{children}</div>
        </Terminal2>
      </body>
    </html>
  );
}
