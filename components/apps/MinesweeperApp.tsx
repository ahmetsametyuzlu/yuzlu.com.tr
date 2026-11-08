"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

type Level = "easy" | "medium";
type Status = "ready" | "playing" | "won" | "lost";

type Cell = { mine: boolean; adj: number; open: boolean; flag: boolean; blast: boolean };

const LEVELS: Record<Level, { w: number; h: number; mines: number; label: string }> = {
  easy: { w: 9, h: 9, mines: 10, label: "9×9" },
  medium: { w: 16, h: 16, mines: 40, label: "16×16" },
};

const NUMBER_COLOR = [
  "",
  "text-[#78aeed]",
  "text-[#57cf94]",
  "text-[#ff7b6b]",
  "text-[#c095f0]",
  "text-[#e0b070]",
  "text-[#5fd0d8]",
  "text-[#deddda]",
  "text-[#9a9996]",
];

function blank(level: Level): Cell[] {
  const { w, h } = LEVELS[level];
  return Array.from({ length: w * h }, () => ({
    mine: false,
    adj: 0,
    open: false,
    flag: false,
    blast: false,
  }));
}

function neighbours(index: number, w: number, h: number): number[] {
  const x = index % w;
  const y = Math.floor(index / w);
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) out.push(ny * w + nx);
    }
  }
  return out;
}

function plant(cells: Cell[], level: Level, safeIndex: number) {
  const { w, h, mines } = LEVELS[level];
  const safe = new Set<number>([safeIndex, ...neighbours(safeIndex, w, h)]);
  let placed = 0;
  let guard = 0;
  while (placed < mines && guard < 20_000) {
    guard++;
    const index = Math.floor(Math.random() * cells.length);
    if (safe.has(index) || cells[index].mine) continue;
    cells[index].mine = true;
    placed++;
  }
  cells.forEach((cell, index) => {
    cell.adj = neighbours(index, w, h).filter((n) => cells[n].mine).length;
  });
}

function flood(cells: Cell[], level: Level, start: number) {
  const { w, h } = LEVELS[level];
  const stack = [start];
  while (stack.length) {
    const index = stack.pop()!;
    const cell = cells[index];
    if (cell.open || cell.flag) continue;
    cell.open = true;
    if (cell.adj === 0 && !cell.mine) {
      for (const n of neighbours(index, w, h)) if (!cells[n].open) stack.push(n);
    }
  }
}

export function MinesweeperApp() {
  const { t } = useLang();
  const [level, setLevel] = useState<Level>("medium");
  const [cells, setCells] = useState<Cell[]>(() => blank("medium"));
  const [status, setStatus] = useState<Status>("ready");
  const [seconds, setSeconds] = useState(0);
  const [flagMode, setFlagMode] = useState(false);

  const reset = useCallback((next: Level) => {
    setLevel(next);
    setCells(blank(next));
    setStatus("ready");
    setSeconds(0);
  }, []);

  useEffect(() => {
    if (status !== "playing") return;
    const id = window.setInterval(() => setSeconds((value) => Math.min(999, value + 1)), 1000);
    return () => window.clearInterval(id);
  }, [status]);

  const toggleFlag = useCallback(
    (index: number) => {
      if (status === "won" || status === "lost") return;
      setCells((current) => {
        if (current[index].open) return current;
        const next = current.map((cell) => ({ ...cell }));
        next[index].flag = !next[index].flag;
        return next;
      });
    },
    [status],
  );

  const openCell = useCallback(
    (index: number) => {
      if (status === "won" || status === "lost") return;
      if (flagMode) {
        toggleFlag(index);
        return;
      }
      if (cells[index].flag || cells[index].open) return;

      const next = cells.map((cell) => ({ ...cell }));
      let nextStatus: Status = status;
      if (status === "ready") {
        plant(next, level, index);
        nextStatus = "playing";
      }

      if (next[index].mine) {
        next[index].blast = true;
        next.forEach((cell) => {
          if (cell.mine) cell.open = true;
        });
        setCells(next);
        setStatus("lost");
        return;
      }

      flood(next, level, index);
      if (next.every((cell) => cell.mine || cell.open)) nextStatus = "won";
      setCells(next);
      setStatus(nextStatus);
    },
    [cells, flagMode, level, status, toggleFlag],
  );

  const flags = useMemo(() => cells.filter((cell) => cell.flag).length, [cells]);
  const { w, mines } = LEVELS[level];
  const pad = (value: number) => String(value).padStart(3, "0");

  const statusLine =
    status === "won"
      ? { text: t({ tr: "Tarlayı temizledin", en: "Field cleared" }), className: "text-ok-light" }
      : status === "lost"
        ? { text: t({ tr: "Mayına bastın", en: "You hit a mine" }), className: "text-err" }
        : status === "playing"
          ? { text: t({ tr: "Oyun sürüyor", en: "In progress" }), className: "text-ink-3" }
          : { text: t({ tr: "Bir kareye tıkla", en: "Click any square" }), className: "text-ink-4" };

  return (
    <div className="flex h-full flex-col overflow-auto bg-win">
      <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-4 pb-2.5">
        <div className="flex items-center gap-2">
          <Icon name="flag" size={15} className="text-ub-orange" />
          <span className="rounded-md border border-white/8 bg-[#1a1a1a] px-3 py-1 font-mono text-[17px] font-bold tracking-wider text-ub-orange-light">
            {pad(Math.max(0, mines - flags))}
          </span>
        </div>

        <div
          className="flex overflow-hidden rounded-lg border border-white/10"
          role="group"
          aria-label={t({ tr: "Zorluk", en: "Difficulty" })}
        >
          {(Object.keys(LEVELS) as Level[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => reset(key)}
              aria-pressed={level === key}
              className={`px-3 py-1.5 text-[12.5px] transition-colors ${
                level === key ? "bg-ub-orange text-white" : "bg-white/6 text-ink-3 hover:bg-white/12"
              }`}
            >
              {LEVELS[key].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-md border border-white/8 bg-[#1a1a1a] px-3 py-1 font-mono text-[17px] font-bold tracking-wider text-info">
            {pad(seconds)}
          </span>
          <Icon name="clock" size={15} className="text-ink-4" />
        </div>
      </div>

      <p className={`shrink-0 px-5 pb-2 text-center text-[13.5px] font-medium ${statusLine.className}`}>
        {statusLine.text}
      </p>

      <div className="flex flex-1 items-center justify-center px-5 py-2">
        <div
          className="grid gap-0.5 rounded-lg border border-white/7 bg-[#1a1a1a] p-2.5"
          style={{ gridTemplateColumns: `repeat(${w}, 28px)` }}
          role="grid"
          aria-label={t({ tr: "Mayın tarlası", en: "Minefield" })}
        >
          {cells.map((cell, index) => {
            const revealed = cell.open;
            const showNumber = revealed && !cell.mine && cell.adj > 0;
            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                aria-label={`${(index % w) + 1}, ${Math.floor(index / w) + 1}`}
                onClick={() => openCell(index)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  toggleFlag(index);
                }}
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-[4px] font-mono text-[14px] font-bold select-none",
                  revealed
                    ? cell.mine
                      ? cell.blast
                        ? "bg-[#c01c28]"
                        : "bg-[#5c1a12]"
                      : "bg-[#262626] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
                    : "bg-[linear-gradient(180deg,#454545,#3a3a3a)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] hover:bg-[linear-gradient(180deg,#545454,#464646)]",
                  showNumber ? NUMBER_COLOR[cell.adj] : "",
                ].join(" ")}
              >
                {showNumber ? cell.adj : null}
                {revealed && cell.mine ? (
                  <span
                    className={`h-3 w-3 rounded-full ${
                      cell.blast ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" : "bg-[#ff5c48]"
                    }`}
                  />
                ) : null}
                {!revealed && cell.flag ? (
                  <span className="h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-ub-orange" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-white/6 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => reset(level)}
            className="rounded-lg border border-white/10 bg-white/8 px-3.5 py-2 text-[13.5px] text-ink-2 transition-colors hover:bg-white/15"
          >
            {t({ tr: "Yeni oyun", en: "New game" })}
          </button>
          <button
            type="button"
            onClick={() => setFlagMode((value) => !value)}
            aria-pressed={flagMode}
            className={`flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13.5px] transition-colors ${
              flagMode
                ? "border-ub-orange bg-ub-orange text-white"
                : "border-white/10 bg-white/8 text-ink-2 hover:bg-white/15"
            }`}
          >
            <Icon name="flag" size={13} />
            {t({ tr: "Bayrak modu", en: "Flag mode" })}
          </button>
        </div>
        <span className="hidden text-[12px] text-ink-4 sm:block">
          {t({ tr: "Sağ tık da bayrak koyar", en: "Right-click also flags" })}
        </span>
      </div>
    </div>
  );
}
