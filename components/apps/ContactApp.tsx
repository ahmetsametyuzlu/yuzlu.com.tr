"use client";

import { useState } from "react";
import { certifications, education, languages, profile } from "@/lib/content";
import { useLang, type L10n } from "@/lib/i18n";
import { useShell } from "@/components/os/shell";
import { Icon, type IconName } from "@/components/ui/Icon";

type SectionId = "contact" | "education" | "certifications";

const SECTIONS: { id: SectionId; label: L10n; icon: IconName }[] = [
  { id: "contact", label: { tr: "İletişim", en: "Contact" }, icon: "mail" },
  { id: "education", label: { tr: "Eğitim", en: "Education" }, icon: "cap" },
  { id: "certifications", label: { tr: "Sertifikalar", en: "Certifications" }, icon: "shield" },
];

export function ContactApp() {
  const { t } = useLang();
  const [section, setSection] = useState<SectionId>("contact");

  return (
    <div className="flex h-full">
      <nav
        aria-label={t({ tr: "Bölümler", en: "Sections" })}
        className="hidden w-56 shrink-0 flex-col gap-0.5 border-r border-line bg-side p-2.5 sm:flex"
      >
        {SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            aria-current={section === item.id}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ub-orange ${
              section === item.id
                ? "bg-ub-orange font-medium text-white"
                : "text-ink-3 hover:bg-white/6"
            }`}
          >
            <Icon name={item.icon} size={17} />
            {t(item.label)}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-auto px-8 py-7">
        {section === "contact" ? <ContactSection /> : null}
        {section === "education" ? <EducationSection /> : null}
        {section === "certifications" ? <CertificationsSection /> : null}
      </div>
    </div>
  );
}

function ContactSection() {
  const { t } = useLang();
  const { openApp, isMobile } = useShell();
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-5">
      <div className="flex flex-col items-center gap-2.5">
        <span className="flex h-21 w-21 items-center justify-center rounded-full bg-[linear-gradient(150deg,#f0723f,#b8360f)] font-mono text-[27px] font-bold text-white shadow-[0_6px_20px_rgba(233,84,32,0.35)]">
          {profile.initials}
        </span>
        <span className="text-[22px] font-bold text-ink">{profile.name}</span>
        <span className="text-[14px] text-ink-3">
          {profile.postNominals} · {t(profile.shortTitle)}
        </span>
      </div>

      <Card>
        <Row label={t({ tr: "E-posta", en: "Email" })}>
          <a className="font-mono text-[13.5px]" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </Row>
        <Row label={t({ tr: "Konum", en: "Location" })}>
          <span className="text-[13.5px] text-ink">{t(profile.location)}</span>
        </Row>
        <Row label="LinkedIn">
          <a
            className="font-mono text-[13.5px]"
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.linkedinLabel}
          </a>
        </Row>
        <Row label="GitHub">
          <a
            className="font-mono text-[13.5px]"
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.githubLabel}
          </a>
        </Row>
        <Row label={t({ tr: "Diller", en: "Languages" })}>
          <span className="text-[13.5px] text-ink">{languages.map((l) => t(l)).join(" · ")}</span>
        </Row>
      </Card>

      <div className="flex flex-wrap gap-2.5">
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 rounded-lg bg-ub-orange px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-ub-orange-light"
        >
          <Icon name="mail" size={16} />
          {t({ tr: "E-posta gönder", en: "Send an email" })}
        </a>
        <a
          href={profile.cv}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            if (isMobile) return;
            event.preventDefault();
            openApp("viewer");
          }}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-5 py-2.5 text-[14px] text-ink transition-colors hover:bg-white/10"
        >
          <Icon name="download" size={16} />
          {t({ tr: "CV (PDF)", en: "CV (PDF)" })}
        </a>
      </div>
    </div>
  );
}

function EducationSection() {
  const { t } = useLang();
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-4">
      <h2 className="text-[18px] font-bold text-ink">{t({ tr: "Eğitim", en: "Education" })}</h2>
      <Card>
        {education.map((item, index) => (
          <Row key={index} label={t(item.degree)}>
            <span className="text-right text-[13.5px] text-ink-4">
              {t(item.place)} · {t(item.year)}
            </span>
          </Row>
        ))}
      </Card>
    </div>
  );
}

function CertificationsSection() {
  const { t } = useLang();
  return (
    <div className="mx-auto flex max-w-[560px] flex-col gap-4">
      <h2 className="text-[18px] font-bold text-ink">
        {t({ tr: "Sertifikalar ve güvenlik", en: "Certifications & security" })}
      </h2>
      <Card>
        {certifications.map((item) => (
          <Row key={item.name} label={item.name}>
            <span className="text-right text-[13.5px] text-ink-3">{t(item.note)}</span>
          </Row>
        ))}
      </Card>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex shrink-0 flex-col overflow-hidden rounded-xl border border-white/7 bg-head">
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4.5 py-3.5 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-white/7">
      <span className="shrink-0 text-[14px] text-ink-3">{label}</span>
      {children}
    </div>
  );
}
