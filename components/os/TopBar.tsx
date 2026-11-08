"use client";

import { useEffect, useRef, useState } from "react";
import { APPS } from "@/lib/apps";
import { useLang, useMinute } from "@/lib/i18n";
import { useShell } from "@/components/os/shell";
import { Icon } from "@/components/ui/Icon";

const LOCALE = { tr: "tr-TR", en: "en-GB" } as const;

export function TopBar() {
  const { t, lang, setLang } = useLang();
  const { overview, setOverview, activeId, isMobile } = useShell();
  const minute = useMinute();
  const [menuOpen, setMenuOpen] = useState(false);
  const [shutdown, setShutdown] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const clock =
    minute === null
      ? ""
      : new Date(minute * 60_000).toLocaleString(LOCALE[lang], {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-1000 flex h-8 items-center justify-between bg-black/88 px-3.5 text-[13.5px] font-medium text-[#f2f0ef]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOverview(!overview)}
            aria-pressed={overview}
            className={`flex items-center gap-2 rounded px-1.5 py-0.5 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ub-orange ${
              overview ? "border-b-2 border-ub-orange" : ""
            }`}
          >
            <Icon name="grid" size={13} />
            <span>{t({ tr: "Etkinlikler", en: "Activities" })}</span>
          </button>
          {activeId && !isMobile ? (
            <span className="hidden items-center gap-2 text-[#c8c4c2] sm:flex">
              <Icon name={APPS[activeId].icon} size={14} />
              <span className="font-normal">{t(APPS[activeId].title)}</span>
            </span>
          ) : null}
        </div>

        <span className="pointer-events-none absolute inset-x-0 text-center" suppressHydrationWarning>
          {clock}
        </span>

        <div className="relative flex items-center gap-2" ref={menuRef}>
          <div
            className="flex items-center overflow-hidden rounded-full border border-white/20 text-[11.5px] font-semibold"
            role="group"
            aria-label={t({ tr: "Site dili", en: "Site language" })}
          >
            {(["tr", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={`px-2 py-0.5 uppercase transition-colors ${
                  lang === code ? "bg-ub-orange text-white" : "text-[#c8c4c2] hover:bg-white/15"
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={t({ tr: "Sistem menüsü", en: "System menu" })}
            className="flex items-center gap-2.5 rounded px-1.5 py-1 transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ub-orange"
          >
            <Icon name="wifi" size={15} strokeWidth={2} />
            <Icon name="volume" size={15} strokeWidth={2} />
            <Icon name="battery" size={17} strokeWidth={1.8} />
            <Icon name="chevron-down" size={10} strokeWidth={2} />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute top-9 right-0 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#1f1f1f] p-1.5 shadow-[0_18px_44px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(150deg,#f0723f,#b8360f)] font-mono text-[12px] font-bold text-white">
                  ASY
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[13.5px] font-semibold text-ink">Ahmet Samet Yüzlü</span>
                  <span className="text-[11.5px] text-ink-4">ahmet@portfolio</span>
                </span>
              </div>
              <div className="my-1 h-px bg-white/8" />
              <MenuRow
                icon="language"
                label={t({ tr: "Dili değiştir", en: "Switch language" })}
                value={lang === "tr" ? "Türkçe" : "English"}
                onClick={() => setLang(lang === "tr" ? "en" : "tr")}
              />
              <MenuRow
                icon="power"
                label={t({ tr: "Kapat", en: "Power off" })}
                onClick={() => {
                  setMenuOpen(false);
                  setShutdown(true);
                }}
              />
            </div>
          ) : null}
        </div>
      </header>

      {shutdown ? <ShutdownDialog onClose={() => setShutdown(false)} /> : null}
    </>
  );
}

function MenuRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: "language" | "power";
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13.5px] text-ink-2 transition-colors hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ub-orange"
    >
      <Icon name={icon} size={16} />
      <span className="flex-1">{label}</span>
      {value ? <span className="text-[12px] text-ink-4">{value}</span> : null}
    </button>
  );
}

function ShutdownDialog({ onClose }: { onClose: () => void }) {
  const { t } = useLang();
  const { openApp } = useShell();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="absolute inset-0 z-1100 flex items-center justify-center bg-black/55 p-6"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shutdown-title"
        className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#2b2b2b] p-6 text-center shadow-[0_26px_64px_rgba(0,0,0,0.6)]"
      >
        <h2 id="shutdown-title" className="text-[17px] font-bold text-ink">
          {t({ tr: "asyOS kapatılsın mı?", en: "Power off asyOS?" })}
        </h2>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-3">
          {t({
            tr: "Kapatmadan önce bir el Solitaire. Kural böyle.",
            en: "One hand of Solitaire before you go. House rules.",
          })}
        </p>
        <div className="mt-5 flex justify-center gap-2.5">
          <button
            type="button"
            autoFocus
            onClick={() => {
              openApp("solitaire");
              onClose();
            }}
            className="rounded-lg bg-ub-orange px-4 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-ub-orange-light"
          >
            {t({ tr: "Solitaire aç", en: "Open Solitaire" })}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/8 px-4 py-2.5 text-[13.5px] text-ink-2 transition-colors hover:bg-white/15"
          >
            {t({ tr: "Vazgeç", en: "Cancel" })}
          </button>
        </div>
      </div>
    </div>
  );
}
