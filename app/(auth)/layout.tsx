import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], display: "swap" });

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${geist.className} min-h-svh w-full bg-white`}>
      {children}
    </div>
  );
}
