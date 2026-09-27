import { grainTexture } from "@/lib/constant/ui.constant";

export function Scene({ id }: { id: string }) {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <svg
        className="size-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1f3eb5" />
            <stop offset="0.4" stopColor="#4a6ee0" />
            <stop offset="0.64" stopColor="#a9bdf7" />
            <stop offset="0.8" stopColor="#ffe3c7" />
          </linearGradient>
          <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fffaf3" />
            <stop offset="0.18" stopColor="#ffe8cf" stopOpacity="0.85" />
            <stop offset="0.5" stopColor="#ffd9b8" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ffd9b8" stopOpacity="0" />
          </radialGradient>
          <filter
            id={`${id}-blur`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="28" />
          </filter>
        </defs>

        <rect width="1600" height="900" fill={`url(#${id}-sky)`} />
        <circle cx="800" cy="790" r="520" fill={`url(#${id}-sun)`} />
        <circle cx="800" cy="790" r="72" fill="#fff8ef" />

        <g filter={`url(#${id}-blur)`} fill="#fff" opacity="0.35">
          <ellipse cx="260" cy="210" rx="260" ry="46" />
          <ellipse cx="820" cy="140" rx="200" ry="36" />
          <ellipse cx="1380" cy="260" rx="240" ry="40" />
        </g>

        <path
          d="M0 730 C180 680 330 690 470 710 C640 735 760 650 930 665 C1100 680 1220 730 1380 700 C1480 682 1560 690 1600 696 V900 H0Z"
          fill="#8aa2f0"
          opacity="0.9"
        />
        <path
          d="M0 795 C160 755 300 785 460 775 C620 765 700 715 880 735 C1060 755 1180 815 1340 795 C1450 781 1540 767 1600 771 V900 H0Z"
          fill="#5b7ae4"
        />
        <path
          d="M0 875 C200 835 380 865 560 855 C760 843 900 795 1080 815 C1260 835 1420 885 1600 855 V900 H0Z"
          fill="#3552c8"
        />
      </svg>
      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{ backgroundImage: grainTexture }}
      />
    </div>
  );
}
