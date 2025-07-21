import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400"],
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "One Million Cookbook",
  description: "The official One Million Cookbook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${poppins.className}`}
      >
        {children}
      </body>
    </html>
  );
}
