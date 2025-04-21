import Link from "next/link";
import { XIconSVG } from "@/icons/X";
import { GithubIconSVG } from "@/icons/Github";

export default function Footer() {
  return (
    <footer className="bg-inherit px-5 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <p className="font-medium text-neutral-500 dark:text-neutral-400">
          UseFeedback
        </p>

        <div className="flex items-center gap-8">
          <Link href="https://x.com/munadil_xd" target="_blank">
            <XIconSVG />
          </Link>

          <Link
            href="https://github.com/Munadil16/use-feedback"
            target="_blank"
          >
            <GithubIconSVG />
          </Link>
        </div>
      </div>
    </footer>
  );
}
