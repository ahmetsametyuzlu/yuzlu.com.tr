"use client";

import { APPS, DOCK_ORDER } from "@/lib/apps";
import { profile } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { useShell } from "@/components/os/shell";
import { Icon } from "@/components/ui/Icon";

export function Dock() {
  const { t } = useLang();
  const { windows, activeId, activate, overview, setOverview } = useShell();

  return (
    <nav
      aria-label={t({ tr: "Uygulamalar", en: "Applications" })}
      className="absolute top-8 bottom-0 left-0 z-900 flex w-18 flex-col items-center gap-2.5 border-r border-white/7 bg-black/45 py-3"
    >
      {DOCK_ORDER.map((id) => {
        const app = APPS[id];
        const win = windows[id];
        const running = win.open;
        const focused = activeId === id && !win.minimized;
        return (
          <div key={id} className="group relative flex items-center">
            <span
              aria-hidden="true"
              className={`absolute -left-2 w-[3px] rounded-sm bg-ub-orange transition-all ${
                running ? (focused ? "h-5 opacity-100" : "h-2 opacity-70") : "h-0 opacity-0"
              }`}
            />
            <button
              type="button"
              onClick={() => activate(id)}
              aria-label={t(app.label)}
              aria-pressed={focused}
              className={`flex h-12 w-12 items-center justify-center rounded-[13px] text-white shadow-[0_3px_8px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange ${app.tile}`}
            >
              <Icon name={app.icon} size={25} strokeWidth={1.9} />
            </button>
            <span
              role="tooltip"
              className="pointer-events-none absolute left-15 z-50 hidden whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2.5 py-1.5 text-[12.5px] text-ink-2 group-hover:block"
            >
              {t(app.label)}
            </span>
          </div>
        );
      })}

      <span className="my-1 h-px w-8 bg-white/15" />

      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="group relative flex h-12 w-12 items-center justify-center rounded-[13px] bg-[linear-gradient(160deg,#3a4048_0%,#1c2024_100%)] text-white shadow-[0_3px_8px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange"
      >
        <Icon name="git" size={24} />
        <span className="pointer-events-none absolute left-15 hidden whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2.5 py-1.5 text-[12.5px] text-ink-2 group-hover:block">
          GitHub
        </span>
      </a>

      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="group relative flex h-12 w-12 items-center justify-center rounded-[13px] bg-[linear-gradient(160deg,#3f7fd6_0%,#1d4f97_100%)] text-white shadow-[0_3px_8px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange"
      >
        <Icon name="globe" size={24} strokeWidth={1.8} />
        <span className="pointer-events-none absolute left-15 hidden whitespace-nowrap rounded-md border border-white/10 bg-black/85 px-2.5 py-1.5 text-[12.5px] text-ink-2 group-hover:block">
          LinkedIn
        </span>
      </a>

      <div className="flex-1" />

      <button
        type="button"
        onClick={() => setOverview(!overview)}
        aria-label={t({ tr: "Uygulamaları göster", en: "Show applications" })}
        aria-pressed={overview}
        className="flex h-12 w-12 items-center justify-center rounded-[13px] bg-white/10 text-ink-2 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange"
      >
        <Icon name="grid" size={22} />
      </button>
    </nav>
  );
}
