"use client";

import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { APPS, DOCK_W, HEADERBAR_H, TOPBAR_H, type AppId } from "@/lib/apps";
import { useLang } from "@/lib/i18n";
import { useShell } from "@/components/os/shell";
import { Icon } from "@/components/ui/Icon";

type DragState = { pointerX: number; pointerY: number; x: number; y: number };
type ResizeState = {
  pointerX: number;
  pointerY: number;
  w: number;
  h: number;
  edge: "right" | "bottom" | "corner";
};

export function WindowFrame({
  id,
  children,
  headerStart,
  headerEnd,
  bodyClassName = "",
}: {
  id: AppId;
  children: ReactNode;
  headerStart?: ReactNode;
  headerEnd?: ReactNode;
  bodyClassName?: string;
}) {
  const app = APPS[id];
  const { t } = useLang();
  const {
    windows,
    activeId,
    focusApp,
    closeApp,
    minimizeApp,
    toggleMax,
    moveWindow,
    resizeWindow,
  } = useShell();
  const win = windows[id];
  const active = activeId === id;
  const drag = useRef<DragState | null>(null);
  const resize = useRef<ResizeState | null>(null);

  const onTitlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.button !== 0 || win.maximized) return;
      if ((event.target as HTMLElement).closest("button")) return;
      focusApp(id);
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        x: win.x,
        y: win.y,
      };
    },
    [focusApp, id, win.maximized, win.x, win.y],
  );

  const onTitlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = drag.current;
      if (!start) return;
      const nextX = start.x + event.clientX - start.pointerX;
      const nextY = start.y + event.clientY - start.pointerY;
      moveWindow(
        id,
        Math.max(
          DOCK_W - win.w + 120,
          Math.min(nextX, window.innerWidth - 120),
        ),
        Math.max(TOPBAR_H, Math.min(nextY, window.innerHeight - HEADERBAR_H)),
      );
    },
    [id, moveWindow, win.w],
  );

  const endDrag = useCallback(() => {
    drag.current = null;
  }, []);

  const onResizePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>, edge: ResizeState["edge"]) => {
      if (event.button !== 0) return;
      event.stopPropagation();
      focusApp(id);
      event.currentTarget.setPointerCapture(event.pointerId);
      resize.current = {
        pointerX: event.clientX,
        pointerY: event.clientY,
        w: win.w,
        h: win.h,
        edge,
      };
    },
    [focusApp, id, win.h, win.w],
  );

  const onResizePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const start = resize.current;
      if (!start) return;
      const dx = event.clientX - start.pointerX;
      const dy = event.clientY - start.pointerY;
      const nextW =
        start.edge === "bottom"
          ? win.w
          : Math.max(
              app.minSize.w,
              Math.min(start.w + dx, window.innerWidth - win.x - 4),
            );
      const nextH =
        start.edge === "right"
          ? win.h
          : Math.max(
              app.minSize.h,
              Math.min(start.h + dy, window.innerHeight - win.y - 4),
            );
      resizeWindow(id, nextW, nextH);
    },
    [
      app.minSize.h,
      app.minSize.w,
      id,
      resizeWindow,
      win.h,
      win.w,
      win.x,
      win.y,
    ],
  );

  const endResize = useCallback(() => {
    resize.current = null;
  }, []);

  if (!win.open || win.minimized) return null;

  const geometry = win.maximized
    ? {
        left: DOCK_W,
        top: TOPBAR_H,
        right: 0,
        bottom: 0,
        width: undefined,
        height: undefined,
      }
    : { left: win.x, top: win.y, width: win.w, height: win.h };

  return (
    <section
      role="dialog"
      aria-label={t(app.title)}
      aria-modal={false}
      className="absolute"
      style={{ ...geometry, zIndex: 100 + win.z }}
      onPointerDown={() => focusApp(id)}
    >
      <div
        className={[
          "flex h-full w-full flex-col overflow-hidden rounded-win border border-white/10 bg-win text-ink-2",
          active
            ? "shadow-[0_26px_64px_rgba(0,0,0,0.62)]"
            : "shadow-[0_14px_34px_rgba(0,0,0,0.45)]",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-12 shrink-0 items-center justify-between gap-2 border-b border-line px-2.5",
            active ? "bg-head" : "bg-side",
            win.maximized ? "" : "cursor-grab active:cursor-grabbing",
          ].join(" ")}
          onPointerDown={onTitlePointerDown}
          onPointerMove={onTitlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onDoubleClick={() => toggleMax(id)}
        >
          <div className="flex min-w-0 flex-1 items-center gap-1.5">
            {headerStart}
          </div>

          <div className="flex min-w-0 shrink-0 flex-col items-center leading-tight">
            <span
              className={`truncate text-[14.5px] font-bold ${active ? "text-ink" : "text-ink-3"}`}
            >
              {t(app.title)}
            </span>
            {app.subtitle ? (
              <span className="truncate text-[11.5px] text-ink-4">
                {t(app.subtitle)}
              </span>
            ) : null}
          </div>

          <div className="flex flex-1 items-center justify-end gap-1.5">
            {headerEnd}
            <WindowButton
              label={t({ tr: "Küçült", en: "Minimize" })}
              onClick={() => minimizeApp(id)}
              icon="minus"
            />
            <WindowButton
              label={
                win.maximized
                  ? t({ tr: "Eski boyut", en: "Restore" })
                  : t({ tr: "Büyüt", en: "Maximize" })
              }
              onClick={() => toggleMax(id)}
              icon="square"
            />
            <WindowButton
              label={t({ tr: "Kapat", en: "Close" })}
              onClick={() => closeApp(id)}
              icon="close"
            />
          </div>
        </div>

        <div
          className={`min-h-0 flex-1 ${app.fixed ? "overflow-hidden" : "overflow-auto"} ${bodyClassName}`}
        >
          {children}
        </div>
      </div>

      {!win.maximized ? (
        <>
          <div
            className="absolute top-12 -right-1 bottom-4 w-2.5 cursor-ew-resize"
            onPointerDown={(event) => onResizePointerDown(event, "right")}
            onPointerMove={onResizePointerMove}
            onPointerUp={endResize}
            onPointerCancel={endResize}
            onLostPointerCapture={endResize}
          />
          <div
            className="absolute right-4 -bottom-1 left-0 h-2.5 cursor-ns-resize"
            onPointerDown={(event) => onResizePointerDown(event, "bottom")}
            onPointerMove={onResizePointerMove}
            onPointerUp={endResize}
            onPointerCancel={endResize}
            onLostPointerCapture={endResize}
          />
          <div
            className="absolute -right-1 -bottom-1 h-5 w-5 cursor-nwse-resize"
            role="separator"
            aria-orientation="vertical"
            aria-label={t({
              tr: "Pencereyi yeniden boyutlandır",
              en: "Resize window",
            })}
            onPointerDown={(event) => onResizePointerDown(event, "corner")}
            onPointerMove={onResizePointerMove}
            onPointerUp={endResize}
            onPointerCancel={endResize}
            onLostPointerCapture={endResize}
          />
        </>
      ) : null}
    </section>
  );
}

function WindowButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: "minus" | "square" | "close";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-white/10 text-ink-2 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange"
    >
      <Icon name={icon} size={icon === "square" ? 9 : 11} strokeWidth={1.8} />
    </button>
  );
}

/** Small pill button used inside app headerbars. */
export function HeaderButton({
  children,
  onClick,
  label,
  active = false,
  primary = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  label?: string;
  active?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13.5px] transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ub-orange",
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
