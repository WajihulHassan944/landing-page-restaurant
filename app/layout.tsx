"use client";

import type { Metadata } from "next";
import "./globals.css";
import { onest } from "@/lib/fonts";
import Navbar from "@/components/navbar/navbar";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // routes where layout should be hidden
  const hideLayout = ["/register"].includes(pathname);

  return (
    <html lang="en">
      <body className={`${onest.className}`}>
        {!hideLayout && <Navbar />}
          <div>{children}</div>
          {!hideLayout &&  <Footer />}
      </body>
    </html>
  );
}
