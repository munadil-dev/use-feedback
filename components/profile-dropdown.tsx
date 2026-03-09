"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfileDropdownProps {
  user: {
    image?: string | null;
  };
}

export default function ProfileDropdown({ user }: ProfileDropdownProps) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image
          className="cursor-pointer rounded-full select-none"
          src={user.image ?? "/user-icon.png"}
          width={33}
          height={33}
          alt="profile image"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-1">
        <DropdownMenuItem
          className="sm:hidden"
          onClick={() => router.push("/dashboard")}
        >
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => router.push("/docs")}>
          Docs
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
