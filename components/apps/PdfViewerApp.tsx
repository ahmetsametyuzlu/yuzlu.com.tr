"use client";

import { profile } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { useShell } from "@/components/os/shell";
import { Icon } from "@/components/ui/Icon";

const FILE_NAME = "Ahmet_Samet_Yuzlu_CV.pdf";

/**
 * Document Viewer: shows cv.pdf through the browser's own PDF renderer.
 * Mobile browsers render PDFs in an iframe poorly or not at all, so there the
 * app shows a card that hands the file to the system viewer instead.
 */
export function PdfViewerApp() {
  const { t } = useLang();
  const { isMobile } = useShell();

  const actions = (
    <div className="flex items-center gap-1.5">
      <a
        href={profile.cv}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px] text-ink-2 transition-colors hover:bg-white/8"
      >
        <Icon name="external" size={15} />
        {t({ tr: "Yeni sekmede aç", en: "Open in new tab" })}
      </a>
      <a
        href={profile.cv}
        download={FILE_NAME}
        className="flex items-center gap-1.5 rounded-md bg-ub-orange px-2.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-ub-orange-light"
      >
        <Icon name="download" size={15} />
        {t({ tr: "İndir", en: "Download" })}
      </a>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <span className="flex h-20 w-16 items-center justify-center rounded-md bg-[#f2efed] font-mono text-[13px] font-bold text-[#c52b20]">
          PDF
        </span>
        <span className="font-mono text-[15px] text-ink">{FILE_NAME}</span>
        {actions}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#3a3a3a]">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line bg-head px-3 py-1.5">
        <span className="truncate font-mono text-[12.5px] text-ink-3">{FILE_NAME}</span>
        {actions}
      </div>
      <iframe
        src={`${profile.cv}#view=FitH&navpanes=0`}
        title={t({ tr: "CV (PDF)", en: "CV (PDF)" })}
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>
  );
}
