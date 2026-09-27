import { Geist } from "next/font/google";
import Navbar from "@/components/navbar";

const geist = Geist({ subsets: ["latin"], display: "swap" });

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geist.className} min-h-screen w-full bg-zinc-50`}>
      <Navbar />
      {children}
    </div>
  );
}
