"use client";

import { experience } from "@/lib/content";
import { useLang } from "@/lib/i18n";

/** experience.md, shown the way GNOME Text Editor shows a markdown source. */
export function ExperienceApp() {
  const { t, lang } = useLang();

  return (
    <div className="flex h-full flex-col overflow-auto bg-sunken px-10 py-6 font-mono text-[13.5px] leading-[1.75]">
      <div className="text-[17px] font-bold text-ub-orange"># experience.md</div>
      <div className="text-ink-4">
        {t({
          tr: "<!-- 18+ yıl · Ankara, Türkiye · TR/EN -->",
          en: "<!-- 18+ years · Ankara, Türkiye · TR/EN -->",
        })}
      </div>

      {experience.map((role) => (
        <section key={role.id} className="mt-5">
          <h2
            className={`text-[15px] font-bold ${role.draft ? "text-ink-4" : "text-ub-orange-light"}`}
          >
            ## {t(role.org)} · {t(role.role)}
          </h2>
          <p className={role.draft ? "text-ink-4" : "text-ink-3"}>
            <span className={role.draft ? "text-[#7fa055]" : "text-ansi-green"}>
              `{t(role.dates)}`
            </span>{" "}
            · {t(role.location)}
          </p>
          <ul className="mt-1.5 flex flex-col">
            {role.bullets.map((bullet, index) => (
              <li
                key={index}
                className={`pl-3.5 -indent-3.5 ${role.draft ? "text-ink-4" : "text-ink-2"}`}
              >
                <span className={role.draft ? "text-[#b06a44]" : "text-ub-orange"}>- </span>
                {t(bullet)}
              </li>
            ))}
          </ul>
          {role.tech.length ? (
            <p className={`mt-1.5 ${role.draft ? "text-ink-4" : "text-info"}`}>
              {role.tech.map((item) => `\`${item}\``).join(" ")}
            </p>
          ) : null}
        </section>
      ))}

      <div className="mt-8 flex items-center justify-between border-t border-white/7 pt-3 text-[12px] text-ink-4">
        <span>Markdown · UTF-8 · LF</span>
        <span>
          {lang === "tr" ? "Sa" : "Ln"} {experience.length * 8}, {lang === "tr" ? "Sü" : "Col"} 1 ·{" "}
          {lang === "tr" ? "Boşluk" : "Spaces"}: 2
        </span>
      </div>
    </div>
  );
}
