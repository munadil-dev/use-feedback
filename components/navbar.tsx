import Link from "next/link";
import { auth } from "@/lib/auth";
import ToggleTheme from "./toggle-theme";
import ProfileDropdown from "./profile-dropdown";
import * as motion from "framer-motion/client";

export default async function Navbar() {
  const session = await auth();

  return (
    <motion.nav
      className="sticky left-0 top-0 z-50 flex items-center justify-between bg-inherit px-6 py-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 0.2,
        delay: 0.45,
      }}
    >
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
    </motion.nav>
  );
}
