"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import { APPS, DOCK_W, TOPBAR_H, type AppId } from "@/lib/apps";

export type WinState = {
  id: AppId;
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
};

type State = {
  windows: Record<AppId, WinState>;
  activeId: AppId | null;
  topZ: number;
  openedCount: number;
  /** the last app the visitor actually asked for — drives the mobile view */
  lastOpened: AppId | null;
};

type Action =
  | { type: "open"; id: AppId; viewport: { w: number; h: number } }
  | { type: "close"; id: AppId }
  | { type: "focus"; id: AppId }
  | { type: "minimize"; id: AppId }
  | { type: "toggleMax"; id: AppId }
  | { type: "move"; id: AppId; x: number; y: number }
  | { type: "resize"; id: AppId; w: number; h: number }
  | { type: "hydrate"; windows: Partial<Record<AppId, Partial<WinState>>> }
  | { type: "closeAll" };

const CASCADE = 28;

function seed(): Record<AppId, WinState> {
  const out = {} as Record<AppId, WinState>;
  (Object.keys(APPS) as AppId[]).forEach((id, index) => {
    const { defaultSize } = APPS[id];
    out[id] = {
      id,
      open: id === "terminal",
      minimized: false,
      maximized: false,
      x: DOCK_W + 40 + index * CASCADE,
      y: TOPBAR_H + 34 + index * CASCADE,
      w: defaultSize.w,
      h: defaultSize.h,
      z: id === "terminal" ? 2 : 1,
    };
  });
  return out;
}

const initialState: State = {
  windows: seed(),
  activeId: "terminal",
  topZ: 2,
  openedCount: 1,
  lastOpened: null,
};

function clampIntoView(win: WinState, viewport: { w: number; h: number }): WinState {
  const w = Math.min(win.w, Math.max(320, viewport.w - DOCK_W - 24));
  const h = Math.min(win.h, Math.max(240, viewport.h - TOPBAR_H - 24));
  return {
    ...win,
    w,
    h,
    x: Math.max(DOCK_W + 8, Math.min(win.x, viewport.w - w - 8)),
    y: Math.max(TOPBAR_H + 8, Math.min(win.y, viewport.h - h - 8)),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "open": {
      const current = state.windows[action.id];
      const z = state.topZ + 1;
      const placed = current.open
        ? current
        : clampIntoView(
            {
              ...current,
              x: DOCK_W + 40 + (state.openedCount % 6) * CASCADE,
              y: TOPBAR_H + 34 + (state.openedCount % 6) * CASCADE,
            },
            action.viewport,
          );
      return {
        ...state,
        topZ: z,
        activeId: action.id,
        openedCount: current.open ? state.openedCount : state.openedCount + 1,
        lastOpened: action.id,
        windows: {
          ...state.windows,
          [action.id]: { ...placed, open: true, minimized: false, z },
        },
      };
    }
    case "close": {
      const rest = (Object.keys(state.windows) as AppId[])
        .filter((id) => id !== action.id && state.windows[id].open && !state.windows[id].minimized)
        .sort((a, b) => state.windows[b].z - state.windows[a].z);
      return {
        ...state,
        activeId: rest[0] ?? null,
        lastOpened: state.lastOpened === action.id ? null : state.lastOpened,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], open: false, minimized: false },
        },
      };
    }
    case "focus": {
      if (state.activeId === action.id && !state.windows[action.id].minimized) return state;
      const z = state.topZ + 1;
      return {
        ...state,
        topZ: z,
        activeId: action.id,
        lastOpened: action.id,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], z, minimized: false },
        },
      };
    }
    case "minimize": {
      const rest = (Object.keys(state.windows) as AppId[])
        .filter((id) => id !== action.id && state.windows[id].open && !state.windows[id].minimized)
        .sort((a, b) => state.windows[b].z - state.windows[a].z);
      return {
        ...state,
        activeId: rest[0] ?? null,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], minimized: true },
        },
      };
    }
    case "toggleMax":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: {
            ...state.windows[action.id],
            maximized: !state.windows[action.id].maximized,
          },
        },
      };
    case "move":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], x: action.x, y: action.y },
        },
      };
    case "resize":
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], w: action.w, h: action.h },
        },
      };
    case "hydrate": {
      const windows = { ...state.windows };
      let topZ = state.topZ;
      let activeId = state.activeId;
      (Object.keys(action.windows) as AppId[]).forEach((id) => {
        if (!windows[id]) return;
        const patch = action.windows[id];
        if (!patch) return;
        windows[id] = { ...windows[id], ...patch, id };
        topZ = Math.max(topZ, windows[id].z);
        if (windows[id].open && !windows[id].minimized) {
          if (!activeId || windows[id].z >= windows[activeId].z) activeId = id;
        }
      });
      return { ...state, windows, topZ, activeId };
    }
    case "closeAll":
      return { ...initialState, windows: seed() };
    default:
      return state;
  }
}

const STORAGE_KEY = "asyos:windows";

type ShellValue = {
  windows: Record<AppId, WinState>;
  activeId: AppId | null;
  lastOpened: AppId | null;
  openApps: WinState[];
  overview: boolean;
  setOverview: (open: boolean) => void;
  isMobile: boolean;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMax: (id: AppId) => void;
  moveWindow: (id: AppId, x: number, y: number) => void;
  resizeWindow: (id: AppId, w: number, h: number) => void;
  closeAll: () => void;
  /** clicking a dock icon: open, focus, or minimise, like GNOME does */
  activate: (id: AppId) => void;
};

const ShellContext = createContext<ShellValue | null>(null);

function viewport() {
  if (typeof window === "undefined") return { w: 1440, h: 900 };
  return { w: window.innerWidth, h: window.innerHeight };
}

export function ShellProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [overview, setOverview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // restore geometry (never which windows were open — a fresh visit should
  // land on the terminal, the same way a fresh login does)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Record<AppId, Partial<WinState>>>;
      const clean: Partial<Record<AppId, Partial<WinState>>> = {};
      (Object.keys(parsed) as AppId[]).forEach((id) => {
        const w = parsed[id];
        if (!w) return;
        if (![w.x, w.y, w.w, w.h].every((n) => typeof n === "number" && Number.isFinite(n))) return;
        clean[id] = { x: w.x, y: w.y, w: w.w, h: w.h, maximized: Boolean(w.maximized) };
      });
      dispatch({ type: "hydrate", windows: clean });
    } catch {
      /* ignore unreadable storage */
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const geometry: Partial<Record<AppId, Partial<WinState>>> = {};
        (Object.keys(state.windows) as AppId[]).forEach((key) => {
          const { x, y, w, h, maximized } = state.windows[key];
          geometry[key] = { x, y, w, h, maximized };
        });
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(geometry));
      } catch {
        /* ignore */
      }
    }, 250);
    return () => window.clearTimeout(id);
  }, [state.windows]);

  const openApp = useCallback((id: AppId) => {
    dispatch({ type: "open", id, viewport: viewport() });
    setOverview(false);
  }, []);
  const closeApp = useCallback((id: AppId) => dispatch({ type: "close", id }), []);
  const focusApp = useCallback((id: AppId) => dispatch({ type: "focus", id }), []);
  const minimizeApp = useCallback((id: AppId) => dispatch({ type: "minimize", id }), []);
  const toggleMax = useCallback((id: AppId) => dispatch({ type: "toggleMax", id }), []);
  const moveWindow = useCallback(
    (id: AppId, x: number, y: number) => dispatch({ type: "move", id, x, y }),
    [],
  );
  const resizeWindow = useCallback(
    (id: AppId, w: number, h: number) => dispatch({ type: "resize", id, w, h }),
    [],
  );
  const closeAll = useCallback(() => dispatch({ type: "closeAll" }), []);

  const activate = useCallback(
    (id: AppId) => {
      const win = state.windows[id];
      if (!win.open) {
        dispatch({ type: "open", id, viewport: viewport() });
        setOverview(false);
        return;
      }
      if (win.minimized) {
        dispatch({ type: "focus", id });
        setOverview(false);
        return;
      }
      if (state.activeId === id && !overview) dispatch({ type: "minimize", id });
      else {
        dispatch({ type: "focus", id });
        setOverview(false);
      }
    },
    [state.windows, state.activeId, overview],
  );

  const openApps = useMemo(
    () =>
      (Object.keys(state.windows) as AppId[])
        .map((id) => state.windows[id])
        .filter((win) => win.open),
    [state.windows],
  );

  const value = useMemo<ShellValue>(
    () => ({
      windows: state.windows,
      activeId: state.activeId,
      lastOpened: state.lastOpened,
      openApps,
      overview,
      setOverview,
      isMobile,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMax,
      moveWindow,
      resizeWindow,
      closeAll,
      activate,
    }),
    [
      state.windows,
      state.activeId,
      state.lastOpened,
      openApps,
      overview,
      isMobile,
      openApp,
      closeApp,
      focusApp,
      minimizeApp,
      toggleMax,
      moveWindow,
      resizeWindow,
      closeAll,
      activate,
    ],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellValue {
  const context = useContext(ShellContext);
  if (!context) throw new Error("useShell must be used inside <ShellProvider>");
  return context;
}
