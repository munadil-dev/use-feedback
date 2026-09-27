import Link from "next/link";
import { footerColumns, socialLinks } from "@/lib/constant/footer.constant";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link
            className="font-instrument-serif text-xl font-medium text-zinc-950"
            href="/"
          >
            useFeedback
          </Link>
          <p className="mt-3 max-w-xs text-sm text-zinc-500">
            Collect customer feedback and show the best of it on your website.
          </p>
          <ul className="mt-5 flex items-center gap-4 [&_svg]:size-4.5">
            {socialLinks.map(({ label, href, Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  aria-label={label}
                  className="flex opacity-60 transition-opacity hover:opacity-100"
                >
                  <Icon />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-medium text-zinc-950">
              {column.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    className="text-zinc-500 transition-colors hover:text-zinc-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-zinc-200">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} UseFeedback. MIT licensed.
        </p>
      </div>

      <div aria-hidden="true" className="overflow-hidden">
        <p className="mx-auto max-w-6xl translate-y-[18%] mask-[linear-gradient(to_bottom,#000_40%,transparent)] px-5 text-center text-[clamp(3.5rem,15vw,12.25rem)] leading-[0.8] font-semibold tracking-[-0.06em] text-zinc-200 select-none">
          useFeedback
        </p>
      </div>
    </footer>
  );
}
