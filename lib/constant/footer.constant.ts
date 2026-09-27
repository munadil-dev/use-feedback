import { GithubIconSVG } from "@/icons/Github";
import { XIconSVG } from "@/icons/X";
import { siteLinks } from "./site.constant";

export const socialLinks = [
  { label: "X", href: siteLinks.x, Icon: XIconSVG },
  { label: "GitHub", href: siteLinks.github, Icon: GithubIconSVG },
];

export const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Sign in", href: "/auth/signin" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "Embed the widget", href: "/docs/embed-widget" },
      { label: "Self-hosting", href: "/docs/self-hosting" },
    ],
  },
  { title: "Connect", links: socialLinks },
];
