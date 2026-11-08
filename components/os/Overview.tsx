"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { APPS, DOCK_ORDER, type AppId } from "@/lib/apps";
import { useLang } from "@/lib/i18n";
import { useShell } from "@/components/os/shell";
import { Icon } from "@/components/ui/Icon";

export function Overview() {
  const { overview } = useShell();
  // mounting only while open keeps the search box empty on every entry
  return overview ? <OverviewPanel /> : null;
}

function OverviewPanel() {
  const { t, lang } = useLang();
  const { setOverview, windows, openApp, closeApp, focusApp } = useShell();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOverview(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [setOverview]);

  const openWindows = useMemo(
    () => DOCK_ORDER.filter((id) => windows[id].open),
    [windows],
  );

  const matches = useMemo(() => {
    const needle = query
      .trim()
      .toLocaleLowerCase(lang === "tr" ? "tr-TR" : "en-GB");
    if (!needle) return DOCK_ORDER;
    return DOCK_ORDER.filter((id) =>
      `${t(APPS[id].label)} ${t(APPS[id].title)}`
        .toLocaleLowerCase(lang === "tr" ? "tr-TR" : "en-GB")
        .includes(needle),
    );
  }, [query, lang, t]);

  return (
    <div
      className="absolute inset-0 z-800 flex flex-col bg-black/45 pt-8 pl-18 backdrop-blur-md"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) setOverview(false);
      }}
    >
      <div className="flex justify-center pt-7 pb-6">
        <label className="flex h-11 w-[420px] max-w-[80%] items-center gap-2.5 rounded-full border border-white/15 bg-white/12 px-4.5">
          <Icon name="search" size={16} className="text-ink-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t({ tr: "Aramak için yazın…", en: "Type to search…" })}
            aria-label={t({ tr: "Uygulama ara", en: "Search applications" })}
            className="w-full bg-transparent text-[14.5px] text-ink placeholder:text-[#cfcbc8] focus:outline-none"
          />
        </label>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-10 pb-14">
        {openWindows.length > 0 && !query ? (
          <div className="flex flex-wrap items-start justify-center gap-6 px-10">
            {openWindows.map((id) => (
              <WindowCard
                key={id}
                id={id}
                onOpen={() => {
                  focusApp(id);
                  setOverview(false);
                }}
                onClose={() => closeApp(id)}
              />
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap items-start justify-center gap-5 px-10">
          {matches.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => openApp(id)}
              className="flex w-28 flex-col items-center gap-2.5 rounded-xl p-3 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[0_4px_12px_rgba(0,0,0,0.45)] ${APPS[id].tile}`}
              >
                <Icon name={APPS[id].icon} size={28} />
              </span>
              <span className="text-center text-[12.5px] leading-tight text-ink">
                {t(APPS[id].label)}
              </span>
            </button>
          ))}
          {matches.length === 0 ? (
            <p className="text-[14px] text-ink-3">
              {t({
                tr: "Eşleşen uygulama yok.",
                en: "No matching application.",
              })}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function WindowCard({
  id,
  onOpen,
  onClose,
}: {
  id: AppId;
  onOpen: () => void;
  onClose: () => void;
}) {
  const { t } = useLang();
  const app = APPS[id];
  return (
    <div className="flex w-[248px] flex-col items-center gap-3">
      <div className="relative w-full">
        <button
          type="button"
          onClick={onOpen}
          className="flex h-[152px] w-full flex-col overflow-hidden rounded-xl border-2 border-white/15 bg-win text-left shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition-colors hover:border-ub-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange"
        >
          <span className="flex h-7 shrink-0 items-center justify-center bg-head text-[10.5px] text-ink-3">
            {t(app.title)}
          </span>
          <span
            className={`flex flex-1 items-center justify-center ${
              id === "terminal"
                ? "bg-term"
                : id === "solitaire"
                  ? "bg-[#1b3a2a]"
                  : "bg-sunken"
            }`}
          >
            <Icon name={app.icon} size={40} className="text-white/35" />
          </span>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={`${t({ tr: "Kapat", en: "Close" })}: ${t(app.title)}`}
          className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#1a1a1a] text-ink-2 transition-colors hover:bg-ub-orange hover:text-white"
        >
          <Icon name="close" size={11} />
        </button>
      </div>
      <span className="text-[13.5px] text-ink">{t(app.label)}</span>
    </div>
  );
}
