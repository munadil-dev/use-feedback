import Link from "next/link";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { GithubIconSVG } from "@/icons/Github";
import { siteLinks } from "@/lib/constant/site.constant";
import { buttonVariants } from "./ui/button";
import ProfileDropdown from "./profile-dropdown";
import NavbarShell from "./navbar-shell";

const navLink = "text-zinc-600 transition-colors hover:text-zinc-950";

export default async function Navbar() {
  const session = await auth();

  return (
    <NavbarShell>
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <div className="flex items-center gap-8">
          <Link
            className="font-instrument-serif text-xl font-medium text-zinc-950"
            href="/"
          >
            useFeedback
          </Link>

          <div className="hidden items-center gap-6 text-sm sm:flex">
            <Link className={navLink} href="/docs">
              Docs
            </Link>
            <Link className={navLink} href="/docs/quickstart">
              Quickstart
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href={siteLinks.github}
            target="_blank"
            aria-label="GitHub repository"
            className="opacity-70 transition-opacity hover:opacity-100 [&_svg]:size-5"
          >
            <GithubIconSVG />
          </Link>

          <Link className={cn(navLink, "sm:hidden")} href="/docs">
            Docs
          </Link>

          {session?.user ? (
            <>
              <Link
                className={cn(navLink, "hidden sm:block")}
                href="/dashboard"
              >
                Dashboard
              </Link>

              <ProfileDropdown user={session.user} />
            </>
          ) : (
            <>
              <Link
                className={cn(navLink, "hidden sm:block")}
                href="/auth/signin"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signin"
                className={cn(buttonVariants({ size: "sm" }), "h-8")}
              >
                Start collecting
              </Link>
            </>
          )}
        </div>
      </nav>
    </NavbarShell>
  );
}
