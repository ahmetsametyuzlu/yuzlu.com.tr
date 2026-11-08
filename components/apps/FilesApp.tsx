"use client";

import { useMemo, useState } from "react";
import { certifications, courses, experience, projects, type Role } from "@/lib/content";
import { useLang, type L10n } from "@/lib/i18n";
import { Icon, type IconName } from "@/components/ui/Icon";

type FolderId = "work" | "teaching" | "certifications" | "projects";

const FOLDERS: { id: FolderId; label: L10n; icon: IconName }[] = [
  { id: "work", label: { tr: "work", en: "work" }, icon: "folder" },
  { id: "teaching", label: { tr: "teaching", en: "teaching" }, icon: "folder" },
  { id: "certifications", label: { tr: "certifications", en: "certifications" }, icon: "folder" },
  { id: "projects", label: { tr: "projects", en: "projects" }, icon: "folder" },
];

export function FilesApp() {
  const { t } = useLang();
  const [folder, setFolder] = useState<FolderId>("work");
  const [selected, setSelected] = useState<string>(experience[0].id);

  const items = useMemo(() => {
    if (folder === "work") return experience.map((role) => role.id);
    if (folder === "projects") return projects.map((project) => project.id);
    if (folder === "teaching") return courses.map((course) => course.name);
    return certifications.map((item) => item.name);
  }, [folder]);

  const activeId = items.includes(selected) ? selected : items[0];

  return (
    <div className="flex h-full">
      {/* places sidebar */}
      <nav
        aria-label={t({ tr: "Konumlar", en: "Places" })}
        className="hidden w-50 shrink-0 flex-col gap-0.5 overflow-auto border-r border-line bg-side p-2.5 text-[13.5px] text-ink-3 sm:flex"
      >
        <span className="px-2.5 pt-1.5 pb-1 text-[11.5px] font-bold tracking-wider text-ink-4 uppercase">
          {t({ tr: "Portfolyo", en: "Portfolio" })}
        </span>
        <SideRow icon="clock" label={t({ tr: "Son kullanılan", en: "Recent" })} />
        <SideRow icon="home" label={t({ tr: "Ev", en: "Home" })} />
        {FOLDERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFolder(item.id)}
            aria-current={folder === item.id}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ub-orange ${
              folder === item.id
                ? "bg-ub-orange/18 font-medium text-[#ffb794]"
                : "hover:bg-white/6"
            }`}
          >
            <Icon name={item.icon} size={16} />
            {t(item.label)}
          </button>
        ))}
        <div className="flex-1" />
        <SideRow icon="trash" label={t({ tr: "Çöp", en: "Trash" })} />
      </nav>

      {/* list */}
      <div className="flex w-full max-w-[360px] shrink-0 flex-col gap-px overflow-auto border-r border-line p-2 md:w-[340px]">
        {folder === "work"
          ? experience.map((role) => (
              <ListRow
                key={role.id}
                active={activeId === role.id}
                onClick={() => setSelected(role.id)}
                icon="folder"
                title={role.id}
                subtitle={`${t(role.role)} · ${t(role.dates)}`}
                dim={role.draft}
              />
            ))
          : null}
        {folder === "projects"
          ? projects.map((project) => (
              <ListRow
                key={project.id}
                active={activeId === project.id}
                onClick={() => setSelected(project.id)}
                icon="folder"
                title={t(project.name)}
                subtitle={t(project.blurb)}
                dim={project.draft}
              />
            ))
          : null}
        {folder === "teaching"
          ? courses.map((course) => (
              <ListRow
                key={course.name}
                active={activeId === course.name}
                onClick={() => setSelected(course.name)}
                icon="cap"
                title={course.name}
                subtitle={t(course.note)}
              />
            ))
          : null}
        {folder === "certifications"
          ? certifications.map((item) => (
              <ListRow
                key={item.name}
                active={activeId === item.name}
                onClick={() => setSelected(item.name)}
                icon="shield"
                title={item.name}
                subtitle={t(item.note)}
              />
            ))
          : null}
      </div>

      {/* preview */}
      <div className="hidden flex-1 overflow-auto bg-sunken px-7 py-6 lg:block">
        <Preview folder={folder} id={activeId} />
      </div>
    </div>
  );
}

function SideRow({ icon, label }: { icon: IconName; label: string }) {
  return (
    <span className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
      <Icon name={icon} size={16} />
      {label}
    </span>
  );
}

function ListRow({
  active,
  onClick,
  icon,
  title,
  subtitle,
  dim,
}: {
  active: boolean;
  onClick: () => void;
  icon: IconName;
  title: string;
  subtitle: string;
  dim?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ub-orange ${
        active ? "bg-ub-orange/20" : "hover:bg-white/6"
      }`}
    >
      <span className={`shrink-0 ${dim ? "text-ink-4" : "text-[#6f8cb8]"}`}>
        <Icon name={icon} size={26} strokeWidth={1.6} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className={`truncate text-[14px] ${dim ? "text-ink-4" : "text-ink"}`}>{title}</span>
        <span className="truncate text-[12px] text-ink-4">{subtitle}</span>
      </span>
    </button>
  );
}

function Preview({ folder, id }: { folder: FolderId; id: string }) {
  const { t } = useLang();

  if (folder === "work") {
    const role = experience.find((item) => item.id === id);
    if (!role) return null;
    return <RolePreview role={role} />;
  }

  if (folder === "projects") {
    const project = projects.find((item) => item.id === id);
    if (!project) return null;
    return (
      <article className="flex flex-col gap-3">
        <Kicker>{t({ tr: "Önizleme", en: "Preview" })}</Kicker>
        <h2 className="text-[25px] leading-tight font-bold text-ink">{t(project.name)}</h2>
        <p className="max-w-prose text-[14px] leading-relaxed text-ink-3">{t(project.blurb)}</p>
        <Tags items={project.tech} />
        {project.url ? (
          <a
            className="mt-2 font-mono text-[13px]"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.url.replace(/^https:\/\//, "")} →
          </a>
        ) : null}
      </article>
    );
  }

  if (folder === "teaching") {
    const course = courses.find((item) => item.name === id);
    if (!course) return null;
    return (
      <article className="flex flex-col gap-3">
        <Kicker>{t({ tr: "Ders", en: "Course" })}</Kicker>
        <h2 className="text-[25px] leading-tight font-bold text-ink">{course.name}</h2>
        <p className="text-[14px] text-ink-3">{t(course.note)}</p>
        <p className="max-w-prose text-[14px] leading-relaxed text-ink-3">
          {t({
            tr: "Ankara Science University'de lisans düzeyinde, Türkçe ve İngilizce veriliyor.",
            en: "Taught at undergraduate level at Ankara Science University, in Turkish and English.",
          })}
        </p>
      </article>
    );
  }

  const item = certifications.find((entry) => entry.name === id);
  if (!item) return null;
  return (
    <article className="flex flex-col gap-3">
      <Kicker>{t({ tr: "Sertifika", en: "Certification" })}</Kicker>
      <h2 className="text-[25px] leading-tight font-bold text-ink">{item.name}</h2>
      <p className="max-w-prose text-[14px] leading-relaxed text-ink-3">{t(item.note)}</p>
    </article>
  );
}

function RolePreview({ role }: { role: Role }) {
  const { t } = useLang();
  return (
    <article className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-3">
        <Kicker>{t({ tr: "Önizleme", en: "Preview" })}</Kicker>
        <span
          className={`rounded-full px-2.5 py-1 text-[11.5px] font-medium ${
            role.current ? "bg-ok/18 text-ok-light" : "bg-white/8 text-ink-4"
          }`}
        >
          {t(role.dates)}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className={`text-[25px] leading-tight font-bold ${role.draft ? "text-ink-4" : "text-ink"}`}>
          {t(role.org)}
        </h2>
        <p className={`text-[15px] font-medium ${role.draft ? "text-ink-4" : "text-ub-orange"}`}>
          {t(role.role)}
        </p>
      </div>

      <p className="max-w-prose text-[14px] leading-relaxed text-ink-3 text-pretty">
        {t(role.summary)}
      </p>

      <ul className="mt-1 flex flex-col gap-2.5">
        {role.bullets.map((bullet, index) => (
          <li key={index} className="flex items-start gap-3">
            <span
              className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${
                role.draft ? "bg-ink-4" : "bg-ub-orange"
              }`}
            />
            <span className={`text-[13.5px] leading-relaxed ${role.draft ? "text-ink-4" : "text-ink-2"}`}>
              {t(bullet)}
            </span>
          </li>
        ))}
      </ul>

      <Tags items={role.tech} dim={role.draft} />
    </article>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11.5px] font-bold tracking-wider text-ink-4 uppercase">{children}</span>
  );
}

function Tags({ items, dim }: { items: string[]; dim?: boolean }) {
  if (!items.length) return null;
  return (
    <div className="mt-1 flex flex-wrap gap-2">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={`rounded-md border border-white/8 bg-white/7 px-2.5 py-1 font-mono text-[12px] ${
            dim ? "text-ink-4" : "text-ink-3"
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
