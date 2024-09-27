import Link from "next/link";
import { auth } from "@/lib/auth";
import ToggleTheme from "./toggle-theme";
import ProfileDropdown from "./profile-dropdown";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky left-0 top-0 z-50 flex items-center justify-between bg-zinc-50 px-6 py-3 drop-shadow-[0_0_2px_rgba(0,0,0,0.3)] dark:bg-zinc-950 dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]">
      <Link className="text-lg font-medium sm:text-xl" href="/">
        UseFeedback
      </Link>

      <div className="flex items-center gap-6">
        <ToggleTheme />

        {session?.user ? (
          <>
            <Link
              className="hidden hover:text-neutral-400 sm:block"
              href="/dashboard"
            >
              Dashboard
            </Link>

            <ProfileDropdown user={session.user} />
          </>
        ) : (
          <Link className="hover:text-neutral-400" href="/auth/signin">
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
