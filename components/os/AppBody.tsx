"use client";

import type { AppId } from "@/lib/apps";
import { TerminalApp } from "@/components/apps/TerminalApp";
import { ExperienceApp } from "@/components/apps/ExperienceApp";
import { FilesApp } from "@/components/apps/FilesApp";
import { ContactApp } from "@/components/apps/ContactApp";
import { PdfViewerApp } from "@/components/apps/PdfViewerApp";
import { MinesweeperApp } from "@/components/apps/MinesweeperApp";
import { SolitaireApp } from "@/components/apps/SolitaireApp";

export function AppBody({ id }: { id: AppId }) {
  switch (id) {
    case "terminal":
      return <TerminalApp />;
    case "experience":
      return <ExperienceApp />;
    case "files":
      return <FilesApp />;
    case "contact":
      return <ContactApp />;
    case "viewer":
      return <PdfViewerApp />;
    case "mines":
      return <MinesweeperApp />;
    case "solitaire":
      return <SolitaireApp />;
    default:
      return null;
  }
}
