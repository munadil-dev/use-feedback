import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UseFeedback",
  description: "Getting feedbacks made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
          <Toaster position="top-right" richColors={true} />
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
