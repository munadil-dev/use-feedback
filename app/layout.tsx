import "./globals.css";
import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${instrumentSerif.variable}`}>
        <Providers>
          <div className="relative min-h-screen w-full">
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)",
              }}
            />
            <Navbar />
            {children}
            <Toaster position="top-right" richColors={true} />
            <Footer />
            <Analytics />
          </div>
        </Providers>
      </body>
    </html>
  );
}
