import Link from "next/link";
import { XIconSVG } from "@/icons/X";
import { GithubIconSVG } from "@/icons/Github";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between bg-inherit px-8 py-4">
      <p className="font-medium text-neutral-500 dark:text-neutral-400">
        UseFeedback
      </p>

      <div className="flex items-center gap-8">
        <Link href="https://x.com/munadil_xd" target="_blank">
          <XIconSVG />
        </Link>

        <Link href="https://github.com/Munadil16/use-feedback" target="_blank">
          <GithubIconSVG />
        </Link>
      </div>
    </footer>
  );
}
