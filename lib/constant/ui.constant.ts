export const ease = [0.23, 1, 0.32, 1] as const;

export const grainTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const windowDots = {
  color: ["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"],
  muted: ["bg-white/15", "bg-white/15", "bg-white/15"],
};
