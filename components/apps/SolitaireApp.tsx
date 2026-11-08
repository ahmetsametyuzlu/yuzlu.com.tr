"use client";

import { useCallback, useMemo, useState } from "react";
import { useLang } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

type Card = { r: number; s: number; up: boolean };
type Piles = { stock: Card[]; waste: Card[]; foundations: Card[][]; tableau: Card[][] };
type Selection = { from: "waste" | "tableau"; pile: number; index: number } | null;

const RANKS = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["♠", "♥", "♦", "♣"];
const isRed = (suit: number) => suit === 1 || suit === 2;

function freshDeal(): Piles {
  const deck: Card[] = [];
  for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) deck.push({ r, s, up: false });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const tableau: Card[][] = [];
  for (let column = 0; column < 7; column++) {
    const pile: Card[] = [];
    for (let k = 0; k <= column; k++) {
      const card = deck.pop()!;
      card.up = k === column;
      pile.push(card);
    }
    tableau.push(pile);
  }
  return { stock: deck, waste: [], foundations: [[], [], [], []], tableau };
}

const clone = (piles: Piles): Piles => ({
  stock: piles.stock.map((c) => ({ ...c })),
  waste: piles.waste.map((c) => ({ ...c })),
  foundations: piles.foundations.map((f) => f.map((c) => ({ ...c }))),
  tableau: piles.tableau.map((t) => t.map((c) => ({ ...c }))),
});

const canStack = (card: Card, onto: Card | undefined) =>
  onto ? isRed(card.s) !== isRed(onto.s) && card.r === onto.r - 1 : card.r === 13;

const canFound = (card: Card, pile: Card[], index: number) =>
  pile.length === 0
    ? card.r === 1 && card.s === index
    : card.s === pile[pile.length - 1].s && card.r === pile[pile.length - 1].r + 1;

export function SolitaireApp() {
  const { t } = useLang();
  const [piles, setPiles] = useState<Piles>(freshDeal);
  const [selection, setSelection] = useState<Selection>(null);
  const [moves, setMoves] = useState(0);
  const [history, setHistory] = useState<{ piles: Piles; moves: number }[]>([]);
  const [drawThree, setDrawThree] = useState(false);

  const won = useMemo(
    () => piles.foundations.every((pile) => pile.length === 13),
    [piles.foundations],
  );

  const commit = useCallback(
    (next: Piles) => {
      setHistory((current) => [...current.slice(-40), { piles, moves }]);
      setPiles(next);
      setMoves((value) => value + 1);
      setSelection(null);
    },
    [piles, moves],
  );

  const newGame = useCallback(() => {
    setPiles(freshDeal());
    setSelection(null);
    setMoves(0);
    setHistory([]);
  }, []);

  const undo = useCallback(() => {
    setHistory((current) => {
      if (!current.length) return current;
      const previous = current[current.length - 1];
      setPiles(previous.piles);
      setMoves(previous.moves);
      setSelection(null);
      return current.slice(0, -1);
    });
  }, []);

  const dealStock = useCallback(() => {
    const next = clone(piles);
    if (next.stock.length === 0) {
      if (next.waste.length === 0) return;
      next.stock = next.waste
        .slice()
        .reverse()
        .map((card) => ({ ...card, up: false }));
      next.waste = [];
    } else {
      const count = Math.min(drawThree ? 3 : 1, next.stock.length);
      for (let i = 0; i < count; i++) {
        const card = next.stock.pop()!;
        card.up = true;
        next.waste.push(card);
      }
    }
    commit(next);
  }, [commit, drawThree, piles]);

  const takeSelected = (next: Piles, sel: NonNullable<Selection>): Card[] => {
    if (sel.from === "waste") return next.waste.splice(next.waste.length - 1, 1);
    const moving = next.tableau[sel.pile].splice(sel.index);
    const rest = next.tableau[sel.pile];
    if (rest.length && !rest[rest.length - 1].up) rest[rest.length - 1].up = true;
    return moving;
  };

  const moveToTableau = useCallback(
    (target: number): boolean => {
      if (!selection) return false;
      if (selection.from === "tableau" && selection.pile === target) {
        setSelection(null);
        return true;
      }
      const next = clone(piles);
      const moving = takeSelected(next, selection);
      const destination = next.tableau[target];
      if (!moving.length || !canStack(moving[0], destination[destination.length - 1])) return false;
      next.tableau[target] = destination.concat(moving);
      commit(next);
      return true;
    },
    [commit, piles, selection],
  );

  const moveToFoundation = useCallback(
    (target: number): boolean => {
      if (!selection) return false;
      if (selection.from === "tableau" && selection.index !== piles.tableau[selection.pile].length - 1)
        return false;
      const next = clone(piles);
      const moving = takeSelected(next, selection);
      if (moving.length !== 1 || !canFound(moving[0], next.foundations[target], target)) return false;
      next.foundations[target] = next.foundations[target].concat(moving);
      commit(next);
      return true;
    },
    [commit, piles, selection],
  );

  const sendHome = useCallback(
    (from: "waste" | "tableau", pile: number, index: number) => {
      const card =
        from === "waste" ? piles.waste[piles.waste.length - 1] : piles.tableau[pile][index];
      if (!card?.up) return;
      if (from === "tableau" && index !== piles.tableau[pile].length - 1) return;
      for (let target = 0; target < 4; target++) {
        if (!canFound(card, piles.foundations[target], target)) continue;
        const next = clone(piles);
        const moving = from === "waste" ? next.waste.splice(next.waste.length - 1, 1) : next.tableau[pile].splice(index);
        if (from === "tableau") {
          const rest = next.tableau[pile];
          if (rest.length && !rest[rest.length - 1].up) rest[rest.length - 1].up = true;
        }
        next.foundations[target] = next.foundations[target].concat(moving);
        commit(next);
        return;
      }
    },
    [commit, piles],
  );

  const autoPlay = useCallback(() => {
    const next = clone(piles);
    let moved = true;
    let any = false;
    let guard = 0;
    while (moved && guard < 200) {
      moved = false;
      guard++;
      for (let column = 0; column < 7; column++) {
        const pile = next.tableau[column];
        const card = pile[pile.length - 1];
        if (!card?.up) continue;
        for (let target = 0; target < 4; target++) {
          if (!canFound(card, next.foundations[target], target)) continue;
          next.foundations[target].push(pile.pop()!);
          if (pile.length && !pile[pile.length - 1].up) pile[pile.length - 1].up = true;
          moved = true;
          any = true;
          break;
        }
      }
      const wasteTop = next.waste[next.waste.length - 1];
      if (wasteTop) {
        for (let target = 0; target < 4; target++) {
          if (!canFound(wasteTop, next.foundations[target], target)) continue;
          next.foundations[target].push(next.waste.pop()!);
          moved = true;
          any = true;
          break;
        }
      }
    }
    if (any) commit(next);
  }, [commit, piles]);

  const clickTableauCard = (pile: number, index: number, card: Card) => {
    if (!card.up) {
      if (index === piles.tableau[pile].length - 1) {
        const next = clone(piles);
        next.tableau[pile][index].up = true;
        commit(next);
      }
      return;
    }
    if (selection) {
      const same =
        selection.from === "tableau" && selection.pile === pile && selection.index === index;
      if (same) {
        setSelection(null);
        return;
      }
      if (moveToTableau(pile)) return;
    }
    setSelection({ from: "tableau", pile, index });
  };

  const isSelected = (from: "waste" | "tableau", pile: number, index: number) => {
    if (!selection || selection.from !== from) return false;
    if (from === "waste") return true;
    return selection.pile === pile && index >= selection.index;
  };

  const status = won
    ? { text: t({ tr: "Kazandın!", en: "You won!" }), className: "text-ok-light" }
    : selection
      ? { text: t({ tr: "Hedef desteyi seç", en: "Pick a destination" }), className: "text-ub-orange-light" }
      : { text: t({ tr: "Kartı seç, sonra hedefe tıkla", en: "Select a card, then its target" }), className: "text-ink-3" };

  const wasteShown = piles.waste.slice(Math.max(0, piles.waste.length - (drawThree ? 3 : 1)));

  return (
    <div className="flex h-full flex-col overflow-auto bg-win">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-line bg-side px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Toolbutton onClick={newGame} primary>
            {t({ tr: "Yeni oyun", en: "New game" })}
          </Toolbutton>
          <Toolbutton onClick={undo} disabled={!history.length}>
            <Icon name="undo" size={14} />
            {t({ tr: "Geri al", en: "Undo" })}
          </Toolbutton>
          <Toolbutton onClick={autoPlay}>{t({ tr: "Otomatik", en: "Auto" })}</Toolbutton>
          <Toolbutton onClick={() => setDrawThree((value) => !value)} active={drawThree}>
            {drawThree ? t({ tr: "3 kart", en: "Draw 3" }) : t({ tr: "1 kart", en: "Draw 1" })}
          </Toolbutton>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[13px] font-medium ${status.className}`}>{status.text}</span>
          <span className="font-mono text-[13px] text-ink-4">
            {moves} {t({ tr: "hamle", en: "moves" })}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-[radial-gradient(700px_420px_at_50%_0%,#24503b_0%,#1b3a2a_55%,#142c20_100%)] p-5">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={dealStock}
            aria-label={t({ tr: "Desteden çek", en: "Deal from stock" })}
            className="flex h-[106px] w-[76px] shrink-0 items-center justify-center rounded-[9px]"
          >
            {piles.stock.length ? (
              <CardBack />
            ) : (
              <span className="flex h-full w-full items-center justify-center rounded-[9px] border-2 border-dashed border-white/20 text-white/45">
                {piles.waste.length ? <Icon name="recycle" size={24} /> : null}
              </span>
            )}
          </button>

          <div className="flex h-[106px] w-[132px] shrink-0">
            {wasteShown.map((card, index) => {
              const absolute = piles.waste.length - wasteShown.length + index;
              const top = absolute === piles.waste.length - 1;
              return (
                <button
                  key={`${card.s}-${card.r}`}
                  type="button"
                  disabled={!top}
                  onClick={() => {
                    if (!top) return;
                    if (selection?.from === "waste") setSelection(null);
                    else setSelection({ from: "waste", pile: 0, index: absolute });
                  }}
                  onDoubleClick={() => top && sendHome("waste", 0, absolute)}
                  className={index > 0 ? "-ml-13" : ""}
                >
                  <CardFace card={card} selected={top && isSelected("waste", 0, absolute)} />
                </button>
              );
            })}
          </div>

          <div className="flex-1" />

          {piles.foundations.map((pile, index) => (
            <button
              key={index}
              type="button"
              onClick={() => moveToFoundation(index)}
              aria-label={`${t({ tr: "Temel deste", en: "Foundation" })} ${SUITS[index]}`}
              className="h-[106px] w-[76px] shrink-0"
            >
              {pile.length ? (
                <CardFace card={pile[pile.length - 1]} />
              ) : (
                <span
                  className={`flex h-full w-full items-center justify-center rounded-[9px] border-2 border-dashed border-white/20 text-[30px] leading-none ${
                    isRed(index) ? "text-[#c01c28]/45" : "text-white/26"
                  }`}
                >
                  {SUITS[index]}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          {piles.tableau.map((pile, column) => (
            <div
              key={column}
              className="flex w-[76px] shrink-0 flex-col"
              onClick={() => {
                if (!pile.length && selection) moveToTableau(column);
              }}
            >
              {pile.length === 0 ? (
                <span className="h-[106px] w-[76px] rounded-[9px] border-2 border-dashed border-white/20" />
              ) : (
                pile.map((card, index) => (
                  <button
                    key={`${card.s}-${card.r}`}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      clickTableauCard(column, index, card);
                    }}
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      sendHome("tableau", column, index);
                    }}
                    className={index === 0 ? "" : pile[index - 1].up ? "-mt-[78px]" : "-mt-[94px]"}
                  >
                    {card.up ? (
                      <CardFace card={card} selected={isSelected("tableau", column, index)} />
                    ) : (
                      <CardBack />
                    )}
                  </button>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardFace({ card, selected = false }: { card: Card; selected?: boolean }) {
  const colour = isRed(card.s) ? "text-[#c01c28]" : "text-[#241f31]";
  return (
    <span
      className={`relative block h-[106px] w-[76px] rounded-[8px] border border-[#cfc9c4] bg-[#f7f6f4] shadow-[0_2px_5px_rgba(0,0,0,0.45)] ${
        selected ? "outline-3 outline-offset-1 outline-ub-orange" : ""
      }`}
      style={{ fontVariantEmoji: "text" } as React.CSSProperties}
    >
      <span className={`absolute top-1.5 left-2 flex flex-col items-center leading-none ${colour}`}>
        <span className="text-[17px] font-bold">{RANKS[card.r]}</span>
        <span className="mt-px text-[13px]">{SUITS[card.s]}</span>
      </span>
      <span className={`absolute right-2 bottom-1.5 text-[26px] leading-none opacity-90 ${colour}`}>
        {SUITS[card.s]}
      </span>
    </span>
  );
}

function CardBack() {
  return (
    <span className="relative block h-[106px] w-[76px] rounded-[8px] border border-white/16 bg-[linear-gradient(150deg,#77216f_0%,#3d0f38_100%)] shadow-[0_2px_5px_rgba(0,0,0,0.45)]">
      <span className="absolute inset-[7px] rounded-[4px] border border-white/14 bg-[repeating-linear-gradient(45deg,rgba(233,84,32,0.55)_0_2px,rgba(233,84,32,0)_2px_8px)]" />
    </span>
  );
}

function Toolbutton({
  children,
  onClick,
  active = false,
  primary = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        primary
          ? "border-ub-orange bg-ub-orange text-white hover:bg-ub-orange-light"
          : active
            ? "border-ub-orange bg-ub-orange text-white"
            : "border-white/10 bg-white/8 text-ink-2 hover:bg-white/15",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
