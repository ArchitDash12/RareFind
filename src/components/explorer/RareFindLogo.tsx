import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function RareFindLogo({ className, size = 20 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Background ink stone */}
      <rect width="64" height="64" rx="12" fill="#1C1B1A" />

      {/* Terracotta outer portal arch */}
      <path
        d="M15 54V28C15 18.6112 22.6112 11 32 11C41.3888 11 49 18.6112 49 28V54"
        stroke="#C85A32"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Keystone crown */}
      <path d="M29 11L30 7H34L35 11H29Z" fill="#C85A32" />

      {/* Impost moldings / Capitals */}
      <line x1="12" y1="28" x2="18" y2="28" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="46" y1="28" x2="52" y2="28" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />

      {/* Base plinth */}
      <line x1="11" y1="54" x2="53" y2="54" stroke="#C85A32" strokeWidth="2.5" strokeLinecap="round" />

      {/* Inner aperture contour */}
      <path
        d="M20 54V30C20 23.3726 25.3726 18 32 18C38.6274 18 44 23.3726 44 30V54"
        stroke="#FAF8F5"
        strokeOpacity="0.2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Compass Ring */}
      <circle cx="32" cy="34" r="7.5" stroke="#C85A32" strokeWidth="1" strokeDasharray="2 2" />

      {/* 4-point compass star */}
      <polygon points="32,22 34,32 32,34 30,32" fill="#FAF8F5" />
      <polygon points="32,46 34,36 32,34 30,36" fill="#FAF8F5" />
      <polygon points="20,34 30,32 32,34 30,36" fill="#FAF8F5" />
      <polygon points="44,34 34,32 32,34 34,36" fill="#FAF8F5" />

      {/* Terracotta bevel facets */}
      <polygon points="32,22 32,34 34,32" fill="#C85A32" />
      <polygon points="32,46 32,34 30,36" fill="#C85A32" />
      <polygon points="20,34 32,34 30,32" fill="#C85A32" />
      <polygon points="44,34 32,34 34,36" fill="#C85A32" />

      {/* Center hub */}
      <circle cx="32" cy="34" r="1.5" fill="#FAF8F5" />
    </svg>
  );
}
