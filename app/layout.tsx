import "./globals.css";
import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";

import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-instrument-serif",
});

const description =
  "Collect testimonials with one link and show the best ones on your site.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000/"
  ),
  title: { default: "Vouch: testimonials in one link", template: "%s | Vouch" },
  description,
  openGraph: {
    type: "website",
    siteName: "Vouch",
    title: "Vouch: testimonials in one link",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${instrumentSerif.variable}`}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors={true} />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
