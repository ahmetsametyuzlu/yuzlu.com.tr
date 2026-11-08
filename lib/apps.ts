import type { IconName } from "@/components/ui/Icon";
import type { L10n } from "@/lib/i18n";

export type AppId =
  | "terminal"
  | "experience"
  | "files"
  | "contact"
  | "viewer"
  | "mines"
  | "solitaire";

export type AppDef = {
  id: AppId;
  /** window titlebar */
  title: L10n;
  subtitle?: L10n;
  /** dock tooltip + overview caption */
  label: L10n;
  /** one word, for the mobile dock */
  short: L10n;
  icon: IconName;
  /** dock tile background */
  tile: string;
  defaultSize: { w: number; h: number };
  minSize: { w: number; h: number };
  /** apps that manage their own scrolling */
  fixed?: boolean;
};

export const APPS: Record<AppId, AppDef> = {
  terminal: {
    id: "terminal",
    title: { tr: "ahmet@portfolio: ~", en: "ahmet@portfolio: ~" },
    subtitle: { tr: "bash", en: "bash" },
    label: { tr: "Terminal · Hakkında", en: "Terminal · About" },
    short: { tr: "Terminal", en: "Terminal" },
    icon: "terminal",
    tile: "bg-[linear-gradient(160deg,#3d3846_0%,#241f31_100%)]",
    defaultSize: { w: 800, h: 560 },
    minSize: { w: 420, h: 320 },
    fixed: true,
  },
  experience: {
    id: "experience",
    title: { tr: "experience.md", en: "experience.md" },
    subtitle: { tr: "~/work · Markdown", en: "~/work · Markdown" },
    label: { tr: "Metin Düzenleyici · Deneyim", en: "Text Editor · Experience" },
    short: { tr: "Deneyim", en: "Experience" },
    icon: "editor",
    tile: "bg-[linear-gradient(160deg,#f6f5f4_0%,#d6d1cd_100%)] text-[#3d3846]",
    defaultSize: { w: 900, h: 640 },
    minSize: { w: 460, h: 320 },
  },
  files: {
    id: "files",
    title: { tr: "Dosyalar", en: "Files" },
    subtitle: { tr: "~/work", en: "~/work" },
    label: { tr: "Dosyalar · İş Geçmişi", en: "Files · Work" },
    short: { tr: "Dosyalar", en: "Files" },
    icon: "folder",
    tile: "bg-[linear-gradient(160deg,#5b7fb3_0%,#35507c_100%)]",
    defaultSize: { w: 980, h: 640 },
    minSize: { w: 560, h: 380 },
    fixed: true,
  },
  contact: {
    id: "contact",
    title: { tr: "İletişim", en: "Contact" },
    subtitle: { tr: "Ayarlar", en: "Settings" },
    label: { tr: "Ayarlar · İletişim", en: "Settings · Contact" },
    short: { tr: "İletişim", en: "Contact" },
    icon: "mail",
    tile: "bg-[linear-gradient(160deg,#f0723f_0%,#c73f14_100%)]",
    defaultSize: { w: 860, h: 620 },
    minSize: { w: 480, h: 380 },
  },
  viewer: {
    id: "viewer",
    title: { tr: "cv.pdf", en: "cv.pdf" },
    subtitle: { tr: "Belge Görüntüleyici", en: "Document Viewer" },
    label: { tr: "Belge Görüntüleyici · CV", en: "Document Viewer · CV" },
    short: { tr: "CV", en: "CV" },
    icon: "file",
    tile: "bg-[linear-gradient(160deg,#e0483c_0%,#a3231a_100%)]",
    // roughly one A4 page wide; the shell clamps it to the viewport
    defaultSize: { w: 860, h: 980 },
    minSize: { w: 420, h: 360 },
    fixed: true,
  },
  mines: {
    id: "mines",
    title: { tr: "Mayın Tarlası", en: "Minesweeper" },
    subtitle: { tr: "Oyunlar", en: "Games" },
    label: { tr: "Mayın Tarlası", en: "Minesweeper" },
    short: { tr: "Mayın", en: "Mines" },
    icon: "flag",
    tile: "bg-[linear-gradient(160deg,#3a4048_0%,#1c2024_100%)]",
    // tall enough for the 16×16 board plus both toolbars
    defaultSize: { w: 560, h: 748 },
    minSize: { w: 360, h: 420 },
    fixed: true,
  },
  solitaire: {
    id: "solitaire",
    title: { tr: "Solitaire", en: "Solitaire" },
    subtitle: { tr: "Klondike", en: "Klondike" },
    label: { tr: "Solitaire", en: "Solitaire" },
    short: { tr: "Solitaire", en: "Solitaire" },
    icon: "code",
    tile: "bg-[linear-gradient(160deg,#2f7a52_0%,#1b3a2a_100%)]",
    defaultSize: { w: 720, h: 700 },
    minSize: { w: 460, h: 460 },
    fixed: true,
  },
};

/** dock order, top to bottom */
export const DOCK_ORDER: AppId[] = [
  "terminal",
  "files",
  "experience",
  "contact",
  "viewer",
  "mines",
  "solitaire",
];

export const TOPBAR_H = 32;
export const DOCK_W = 72;
export const HEADERBAR_H = 48;
