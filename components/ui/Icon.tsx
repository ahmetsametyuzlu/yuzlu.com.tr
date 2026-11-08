import type { SVGProps } from "react";

export type IconName =
  | "terminal"
  | "folder"
  | "file"
  | "editor"
  | "mail"
  | "git"
  | "globe"
  | "trash"
  | "settings"
  | "search"
  | "grid"
  | "wifi"
  | "volume"
  | "battery"
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "minus"
  | "square"
  | "close"
  | "clock"
  | "briefcase"
  | "cap"
  | "shield"
  | "code"
  | "flag"
  | "undo"
  | "power"
  | "home"
  | "menu"
  | "plus"
  | "list"
  | "recycle"
  | "language"
  | "download"
  | "external";

type IconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
  strokeWidth?: number;
};

/** One stroke-based icon set on a 24px grid, so everything scales and recolours. */
export function Icon({ name, size = 18, strokeWidth = 1.9, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

const paths: Record<IconName, React.ReactNode> = {
  terminal: (
    <>
      <polyline points="5 8 9 12 5 16" />
      <line x1="12" y1="16" x2="18" y2="16" />
    </>
  ),
  folder: (
    <path d="M3 6.6A1.4 1.4 0 0 1 4.4 5.2h4l1.8 2h9.4A1.4 1.4 0 0 1 21 8.6v9.2a1.4 1.4 0 0 1-1.4 1.4H4.4A1.4 1.4 0 0 1 3 17.8z" />
  ),
  file: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4" />
    </>
  ),
  editor: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="14.5" x2="15" y2="14.5" />
      <line x1="9" y1="18" x2="12.5" y2="18" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
      <polyline points="3.8 7 12 13 20.2 7" />
    </>
  ),
  git: (
    <>
      <circle cx="6.5" cy="6" r="2.2" />
      <circle cx="6.5" cy="18" r="2.2" />
      <circle cx="17.5" cy="10" r="2.2" />
      <path d="M6.5 8.2v7.6" />
      <path d="M17.5 12.2c0 2.6-2.2 3.6-5.2 3.9" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <ellipse cx="12" cy="12" rx="4" ry="8.6" />
      <path d="M3.6 9.4h16.8M3.6 14.6h16.8" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9.5 7V4.8h5V7" />
      <path d="M6.2 7l1 12.2h9.6L17.8 7" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.2v2.4M12 18.4v2.4M20.8 12h-2.4M5.6 12H3.2M18.2 5.8l-1.7 1.7M7.5 16.5l-1.7 1.7M18.2 18.2l-1.7-1.7M7.5 7.5 5.8 5.8" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <line x1="15" y1="15" x2="20" y2="20" />
    </>
  ),
  grid: (
    <g fill="currentColor" stroke="none">
      <circle cx="5" cy="5" r="1.9" />
      <circle cx="12" cy="5" r="1.9" />
      <circle cx="19" cy="5" r="1.9" />
      <circle cx="5" cy="12" r="1.9" />
      <circle cx="12" cy="12" r="1.9" />
      <circle cx="19" cy="12" r="1.9" />
      <circle cx="5" cy="19" r="1.9" />
      <circle cx="12" cy="19" r="1.9" />
      <circle cx="19" cy="19" r="1.9" />
    </g>
  ),
  wifi: (
    <>
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5 12a10.5 10.5 0 0 1 14 0" />
      <path d="M8.5 15.5a5.5 5.5 0 0 1 7 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </>
  ),
  volume: (
    <>
      <path d="M4 9v6h3.5L13 19V5L7.5 9H4z" />
      <path d="M17 9.5a4 4 0 0 1 0 5" />
    </>
  ),
  battery: (
    <>
      <rect x="2" y="7.5" width="17" height="9" rx="2.4" />
      <rect x="4" y="9.5" width="11" height="5" rx="1.2" fill="currentColor" stroke="none" />
      <path d="M21.4 10.6v2.8" strokeWidth="2.4" />
    </>
  ),
  "chevron-down": <polyline points="6 9.5 12 15.5 18 9.5" />,
  "chevron-right": <polyline points="10 5 17 12 10 19" />,
  "chevron-left": <polyline points="14 5 7 12 14 19" />,
  minus: <line x1="5" y1="12" x2="19" y2="12" />,
  square: <rect x="6" y="6" width="12" height="12" rx="1.6" />,
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="13" r="8" />
      <polyline points="12 8.5 12 13 15 15" />
      <line x1="9.5" y1="3" x2="14.5" y2="3" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V5.6h6V7.5" />
    </>
  ),
  cap: (
    <>
      <path d="M3 8.5 12 4.5l9 4-9 4z" />
      <path d="M7 11v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 19 6.5v5c0 4.2-2.9 7.6-7 8.9-4.1-1.3-7-4.7-7-8.9v-5z" />
      <polyline points="9 12 11.3 14.2 15.4 10" />
    </>
  ),
  code: (
    <>
      <polyline points="8 8 4 12 8 16" />
      <polyline points="16 8 20 12 16 16" />
    </>
  ),
  flag: (
    <>
      <path d="M7 4v16" strokeWidth="2" />
      <path d="M7.8 4.6h9.4l-2.6 3.6 2.6 3.6H7.8z" fill="currentColor" stroke="none" />
    </>
  ),
  undo: (
    <>
      <polyline points="9 6 4 11 9 16" />
      <path d="M4 11h9a6 6 0 0 1 0 12h-2" />
    </>
  ),
  power: (
    <>
      <path d="M12 4v8" />
      <path d="M17.6 7A8 8 0 1 1 6.4 7" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 10v9.5h13V10" />
    </>
  ),
  menu: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  list: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </>
  ),
  recycle: (
    <>
      <polyline points="20 5 20 10 15 10" />
      <path d="M20 10a8 8 0 1 0-2 6" />
    </>
  ),
  language: (
    <>
      <path d="M3.5 6.5h9" />
      <path d="M8 4.5v2" />
      <path d="M10.5 6.5c0 3.6-2.6 6.6-6 7.6" />
      <path d="M5.4 9.5c.9 2 2.6 3.6 4.8 4.4" />
      <path d="m12.5 20 3.6-8.4L19.8 20" />
      <path d="M13.8 17h4.6" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v10" />
      <polyline points="8 10.5 12 14.5 16 10.5" />
      <path d="M5 18.5h14" />
    </>
  ),
  external: (
    <>
      <path d="M14 5h5v5" />
      <path d="M19 5l-7.5 7.5" />
      <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
    </>
  ),
};
