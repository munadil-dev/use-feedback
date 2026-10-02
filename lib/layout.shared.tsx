import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "Vouch",
    },
    links: [
      { text: "Home", url: "/" },
      { text: "Dashboard", url: "/dashboard" },
      {
        text: "GitHub",
        url: "https://github.com/munadil-dev/vouch",
        external: true,
      },
    ],
    themeSwitch: { enabled: false },
  };
}
