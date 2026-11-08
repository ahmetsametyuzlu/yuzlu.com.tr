"use client";

import { DOCK_ORDER } from "@/lib/apps";
import { useLang } from "@/lib/i18n";
import { ShellProvider, useShell } from "@/components/os/shell";
import { WindowFrame } from "@/components/os/Window";
import { TopBar } from "@/components/os/TopBar";
import { Dock } from "@/components/os/Dock";
import { Overview } from "@/components/os/Overview";
import { AppBody } from "@/components/os/AppBody";
import { MobileShell } from "@/components/os/MobileShell";

export function Desktop() {
  return (
    <ShellProvider>
      <Session />
    </ShellProvider>
  );
}

function Session() {
  const { isMobile } = useShell();

  if (isMobile) return <MobileShell />;

  return (
    <div className="wallpaper relative h-full w-full overflow-hidden">
      <TopBar />
      <Dock />
      <DesktopIcons />

      {DOCK_ORDER.map((id) => (
        <WindowFrame key={id} id={id}>
          <AppBody id={id} />
        </WindowFrame>
      ))}

      <Overview />
    </div>
  );
}

function DesktopIcons() {
  const { t } = useLang();
  const { openApp } = useShell();

  return (
    <div className="absolute top-12 left-23 z-0 flex flex-col gap-3.5">
      <button
        type="button"
        onDoubleClick={() => openApp("files")}
        onClick={(event) => {
          if (event.detail === 0) openApp("files");
        }}
        className="flex w-23 flex-col items-center gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange"
      >
        <svg width="46" height="46" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M3 10.6 12 3.6l9 7v9.2a1.2 1.2 0 0 1-1.2 1.2H4.2A1.2 1.2 0 0 1 3 19.8z"
            fill="#c9a999"
            stroke="#7b5b4c"
            strokeWidth="1.1"
          />
          <rect x="9.6" y="14" width="4.8" height="6" fill="#7b5b4c" />
        </svg>
        <span className="text-[12.5px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
          {t({ tr: "Ev", en: "Home" })}
        </span>
      </button>

      <button
        type="button"
        onDoubleClick={() => openApp("viewer")}
        onClick={(event) => {
          if (event.detail === 0) openApp("viewer");
        }}
        title={t({ tr: "CV'yi aç (PDF)", en: "Open CV (PDF)" })}
        className="flex w-23 flex-col items-center gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange"
      >
        <svg width="46" height="46" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 2.6h8l4.4 4.4v14.4H6z" fill="#f2efed" stroke="#b8b2ad" strokeWidth="1" />
          <path d="M14 2.6 18.4 7H14z" fill="#c9c3be" />
          <rect x="5.2" y="12.4" width="13.6" height="6.2" rx="1.4" fill="#c52b20" />
          <text
            x="12"
            y="17.2"
            fontFamily="var(--font-sans), sans-serif"
            fontSize="4.2"
            fontWeight="700"
            fill="#ffffff"
            textAnchor="middle"
          >
            PDF
          </text>
        </svg>
        <span className="text-[12.5px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
          cv.pdf
        </span>
      </button>
    </div>
  );
}
