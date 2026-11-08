"use client";

import { APPS, type AppId } from "@/lib/apps";
import { certifications, courses, experience, profile } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { useShell } from "@/components/os/shell";
import { Icon } from "@/components/ui/Icon";
import { AppBody } from "@/components/os/AppBody";

const MOBILE_DOCK: AppId[] = ["terminal", "files", "mines", "solitaire", "contact"];

export function MobileShell() {
  const { t, lang, setLang } = useLang();
  const { lastOpened, windows, openApp, closeApp } = useShell();
  const current = lastOpened && windows[lastOpened].open ? lastOpened : null;

  return (
    <div className="flex h-full flex-col bg-[#1c1c1c]">
      <div className="h-7 shrink-0 bg-ub-aubergine" aria-hidden="true" />

      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-white/8 bg-ub-aubergine px-3">
        {current ? (
          <button
            type="button"
            onClick={() => closeApp(current)}
            aria-label={t({ tr: "Geri", en: "Back" })}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-[#f2f0ef]"
          >
            <Icon name="chevron-left" size={22} strokeWidth={2.2} />
          </button>
        ) : (
          <span className="flex h-11 w-11 items-center justify-center text-[#f2f0ef]">
            <Icon name="menu" size={20} strokeWidth={2} />
          </span>
        )}

        <span className="truncate font-mono text-[15px] font-medium text-white">
          {current ? t(APPS[current].title) : `${profile.user}@${profile.host}`}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLang(lang === "tr" ? "en" : "tr")}
            aria-label={t({ tr: "Dili değiştir", en: "Switch language" })}
            className="flex h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 px-2 text-[12px] font-semibold text-[#f2f0ef] uppercase"
          >
            {lang === "tr" ? "EN" : "TR"}
          </button>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-auto">
        {current ? <AppBody id={current} /> : <MobileHome />}
      </main>

      <nav
        aria-label={t({ tr: "Uygulamalar", en: "Applications" })}
        className="flex h-17 shrink-0 items-center justify-around border-t border-white/8 bg-ub-aubergine px-1.5"
      >
        {MOBILE_DOCK.map((id) => {
          const active = current === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => openApp(id)}
              aria-current={active}
              className="flex h-13 w-15 flex-col items-center justify-center gap-1 rounded-lg"
            >
              <Icon
                name={APPS[id].icon}
                size={21}
                className={active ? "text-ub-orange" : "text-ink-3"}
              />
              <span
                className={`w-full truncate text-center text-[10.5px] leading-none ${
                  active ? "font-medium text-ub-orange" : "text-ink-3"
                }`}
              >
                {t(APPS[id].short)}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function MobileHome() {
  const { t, lang } = useLang();
  const { openApp } = useShell();

  return (
    <div className="flex flex-col gap-5 p-3.5">
      <section className="flex flex-col gap-2 rounded-xl border border-white/9 bg-term p-4 font-mono">
        <p className="text-[11.5px]">
          <span className="font-bold text-ansi-green">
            {profile.user}@{profile.host}
          </span>
          <span className="text-[#eeeeec]">:</span>
          <span className="font-bold text-ansi-blue">~</span>
          <span className="text-[#eeeeec]">$ whoami</span>
        </p>
        <pre className="m-0 text-[8.5px] leading-[1.15] whitespace-pre text-ub-orange">{` █████╗ ███████╗██╗   ██╗
██╔══██╗██╔════╝╚██╗ ██╔╝
███████║███████╗ ╚████╔╝ 
██╔══██║╚════██║  ╚██╔╝  
██║  ██║███████║   ██║   
╚═╝  ╚═╝╚══════╝   ╚═╝   `}</pre>
        <div className="flex flex-col gap-0.5 text-[11.5px]">
          <Line label="Name">
            {profile.name}, {profile.postNominals}
          </Line>
          <Line label="Role">{t(profile.shortTitle)}</Line>
          <Line label="Uptime">
            {lang === "tr" ? `${profile.years} yıl` : `${profile.years} years`}
          </Line>
          <Line label="Host">{t(profile.location)}</Line>
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="pl-1 text-[11.5px] font-bold tracking-wider text-ink-4 uppercase">
          {t({ tr: "Deneyim", en: "Experience" })}
        </h2>
        <div className="flex flex-col overflow-hidden rounded-xl border border-white/7 bg-side">
          {experience.map((role, index) => (
            <button
              key={role.id}
              type="button"
              onClick={() => openApp("files")}
              className={`flex min-h-16 items-center gap-3 px-3.5 py-3 text-left ${
                index > 0 ? "border-t border-white/7" : ""
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  role.draft ? "bg-white/6 text-ink-4" : "bg-ub-orange/18 text-ub-orange-light"
                }`}
              >
                <Icon name="briefcase" size={19} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className={`truncate text-[14.5px] font-medium ${role.draft ? "text-ink-4" : "text-ink"}`}>
                  {t(role.org)}
                </span>
                <span className="truncate text-[12.5px] text-ink-4">
                  {t(role.role)} · {t(role.dates)}
                </span>
              </span>
              <Icon name="chevron-right" size={15} className="text-ink-4" />
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="pl-1 text-[11.5px] font-bold tracking-wider text-ink-4 uppercase">
          {t({ tr: "Sertifika & güvenlik", en: "Certifications & security" })}
        </h2>
        <div className="flex flex-wrap gap-2">
          {certifications.map((item) => (
            <span
              key={item.name}
              className="rounded-lg border border-ok/28 bg-ok/16 px-3 py-2 font-mono text-[12.5px] text-ok-light"
            >
              {item.name}
            </span>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2.5 pb-4">
        <h2 className="pl-1 text-[11.5px] font-bold tracking-wider text-ink-4 uppercase">
          {t({ tr: "Eğitmenlik", en: "Teaching" })}
        </h2>
        <div className="flex flex-col gap-2 rounded-xl border border-white/7 bg-side p-3.5">
          <span className="text-[14.5px] font-medium text-ink">Ankara Science University</span>
          <div className="flex flex-wrap gap-2">
            {courses.map((course) => (
              <span
                key={course.name}
                className="rounded-lg bg-white/7 px-3 py-1.5 text-[12.5px] text-ink-3"
              >
                {course.name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="font-bold text-ub-orange">{label}</span>
      <span className="text-[#eeeeec]">: {children}</span>
    </div>
  );
}
