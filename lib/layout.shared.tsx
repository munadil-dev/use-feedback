import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "UseFeedback",
    },
    links: [
      { text: "Home", url: "/" },
      { text: "Dashboard", url: "/dashboard" },
      {
        text: "GitHub",
        url: "https://github.com/munadil-dev/use-feedback",
        external: true,
      },
    ],
    themeSwitch: { enabled: false },
  };
}
