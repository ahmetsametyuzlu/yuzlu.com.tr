"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { DOCK_ORDER, type AppId } from "@/lib/apps";
import { certifications, courses, experience, profile, projects } from "@/lib/content";
import { useLang, type L10n } from "@/lib/i18n";
import { useShell } from "@/components/os/shell";

const ASCII = ` █████╗ ███████╗██╗   ██╗
██╔══██╗██╔════╝╚██╗ ██╔╝
███████║███████╗ ╚████╔╝ 
██╔══██║╚════██║  ╚██╔╝  
██║  ██║███████║   ██║   
╚═╝  ╚═╝╚══════╝   ╚═╝   `;

type Entry = { id: number; command: string; cwd: string; node: ReactNode };

let entryId = 0;

/**
 * Every piece of terminal output is a component that reads the language from
 * context, so switching TR/EN re-translates the scrollback instead of leaving
 * a bilingual mess behind.
 */
export function TerminalApp() {
  const { t, setLang } = useLang();
  const { openApp } = useShell();
  const [cwd, setCwd] = useState("~");
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [greeting, setGreeting] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [entries]);

  const run = useCallback(
    (raw: string) => {
      const line = raw.trim();
      const at = cwd;
      const push = (node: ReactNode) =>
        setEntries((current) => [...current, { id: entryId++, command: line, cwd: at, node }]);

      if (!line) {
        push(null);
        return;
      }
      setHistory((current) => [...current, line]);
      const [head, ...args] = line.split(/\s+/);
      const arg = args.join(" ");
      const command = head.toLowerCase();

      switch (command) {
        case "help":
          push(<Help />);
          break;
        case "neofetch":
        case "fetch":
          push(<Neofetch />);
          break;
        case "whoami":
          push(<Out>{profile.user}</Out>);
          break;
        case "about":
        case "summary":
          push(<Msg v={profile.summary} wide />);
          break;
        case "pwd":
          push(<Out>{at === "~" ? "/home/ahmet" : `/home/ahmet/${at.slice(2)}`}</Out>);
          break;
        case "date":
          push(<Now />);
          break;
        case "echo":
          push(<Out>{arg}</Out>);
          break;
        case "ls":
          push(<Listing target={arg || at} />);
          break;
        case "cd": {
          const target = arg.replace(/\/$/, "");
          if (!target || target === "~" || target === "/" || target === "..") setCwd("~");
          else if (["work", "projects", "teaching", "certifications"].includes(target))
            setCwd(`~/${target}`);
          else
            push(
              <Msg
                error
                v={{
                  tr: `cd: böyle bir dizin yok: ${target}`,
                  en: `cd: no such directory: ${target}`,
                }}
              />,
            );
          break;
        }
        case "cat":
          push(<Cat file={arg} />);
          break;
        case "open": {
          // `open cv.pdf` behaves like xdg-open: the file goes to the Document Viewer
          const key = (/^(~\/)?cv\.pdf$/i.test(arg) ? "viewer" : arg.toLowerCase()) as AppId;
          if (DOCK_ORDER.includes(key)) {
            openApp(key);
            push(<Msg v={{ tr: `${arg} açılıyor…`, en: `opening ${arg}…` }} />);
          } else {
            push(
              <Msg
                error
                v={{
                  tr: `open: bilinmeyen uygulama: ${arg || "?"} (${DOCK_ORDER.join(", ")})`,
                  en: `open: unknown app: ${arg || "?"} (${DOCK_ORDER.join(", ")})`,
                }}
              />,
            );
          }
          break;
        }
        case "lang": {
          const next = arg.toLowerCase();
          if (next === "tr" || next === "en") {
            setLang(next);
            push(<Out>{next === "tr" ? "Dil: Türkçe" : "Language: English"}</Out>);
          } else {
            push(<Msg v={{ tr: "kullanım: lang tr|en", en: "usage: lang tr|en" }} />);
          }
          break;
        }
        case "contact":
          push(<Contact />);
          break;
        case "clear":
          setEntries([]);
          setGreeting(false);
          return;
        case "sudo":
          push(
            <Msg
              error
              v={{
                tr: "Bu olay bildirilecektir. (şaka, burası bir tarayıcı)",
                en: "This incident will be reported. (kidding, it's a browser)",
              }}
            />,
          );
          break;
        case "exit":
        case "logout":
          push(
            <Msg
              v={{
                tr: "Çıkmak için sekmeyi kapatman yeterli, ama önce bir el Solitaire: `open solitaire`",
                en: "Just close the tab, though there is Solitaire first: `open solitaire`",
              }}
            />,
          );
          break;
        default:
          push(
            <Msg
              error
              v={{
                tr: `${head}: komut bulunamadı. \`help\` yazabilirsin.`,
                en: `${head}: command not found. Try \`help\`.`,
              }}
            />,
          );
      }
    },
    [cwd, openApp, setLang],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      run(value);
      setValue("");
      setHistoryIndex(null);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next]);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setValue("");
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
      return;
    }
    if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      setEntries([]);
      setGreeting(false);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-auto bg-term px-5 py-4 font-mono text-[13.5px] leading-[1.55] text-[#eeeeec]"
      onClick={() => inputRef.current?.focus()}
    >
      {greeting ? <Neofetch /> : null}

      {entries.map((entry) => (
        <div key={entry.id}>
          <div>
            <Prompt cwd={entry.cwd} />
            <span>{entry.command}</span>
          </div>
          {entry.node}
        </div>
      ))}

      <div className="flex items-center">
        <Prompt cwd={cwd} />
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          aria-label={t({ tr: "Terminal komutu", en: "Terminal command" })}
          className="ml-1 min-w-0 flex-1 bg-transparent font-mono text-[13.5px] text-[#eeeeec] caret-[#eeeeec] focus:outline-none"
        />
      </div>
    </div>
  );
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <>
      <span className="font-bold text-ansi-green">
        {profile.user}@{profile.host}
      </span>
      <span>:</span>
      <span className="font-bold text-ansi-blue">{cwd}</span>
      <span>$ </span>
    </>
  );
}

function Out({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={`whitespace-pre-wrap text-ansi-grey ${wide ? "max-w-[76ch]" : ""}`}>
      {children}
    </div>
  );
}

function Msg({ v, error = false, wide = false }: { v: L10n; error?: boolean; wide?: boolean }) {
  const { t } = useLang();
  return (
    <div
      className={`whitespace-pre-wrap ${error ? "text-err" : "text-ansi-grey"} ${
        wide ? "max-w-[76ch]" : ""
      }`}
    >
      {t(v)}
    </div>
  );
}

function Now() {
  const { lang } = useLang();
  const [stamp] = useState(() => new Date());
  return (
    <Out>
      {stamp.toLocaleString(lang === "tr" ? "tr-TR" : "en-GB", {
        dateStyle: "full",
        timeStyle: "short",
      })}
    </Out>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="font-bold text-ub-orange">{label}</span>
      <span className="text-[#eeeeec]">: {children}</span>
    </div>
  );
}

const PALETTE_TOP = ["#2e3436", "#cc0000", "#4e9a06", "#c4a000", "#3465a4", "#75507b", "#06989a", "#d3d7cf"];
const PALETTE_BOTTOM = ["#555753", "#ef2929", "#8ae234", "#fce94f", "#729fcf", "#ad7fa8", "#34e2e2", "#eeeeec"];

function Neofetch() {
  const { t, lang } = useLang();
  const current = experience.filter((role) => role.current);
  return (
    <div className="mb-2 flex flex-wrap items-start gap-6">
      <pre className="m-0 font-mono text-[12px] leading-[1.18] whitespace-pre text-ub-orange [text-shadow:0_0_14px_rgba(233,84,32,0.45)]">
        {ASCII}
      </pre>
      <div className="flex flex-col text-[13px]">
        <div>
          <span className="font-bold text-ansi-green">{profile.user}</span>
          <span>@</span>
          <span className="font-bold text-ansi-green">{profile.host}</span>
        </div>
        <div className="text-[#eeeeec]">-------------------------------------------</div>
        <Row label="OS">
          {profile.name}, {profile.postNominals}
        </Row>
        <Row label="Host">{t(profile.location)}</Row>
        <Row label="Kernel">{t(profile.title)}</Row>
        <Row label="Uptime">
          {lang === "tr"
            ? `${profile.years} yıl yazılım sektöründe`
            : `${profile.years} years in the software industry`}
        </Row>
        {current.map((role) => (
          <Row key={role.id} label={t(role.org).split(",")[0]}>
            {t(role.role)} · {t(role.dates)}
          </Row>
        ))}
        <Row label="Packages">{certifications.map((item) => item.name).join(" · ")}</Row>
        <Row label="Locale">tr_TR.UTF-8 · en_US.UTF-8</Row>
        <div className="mt-2.5 flex">
          {PALETTE_TOP.map((color) => (
            <span key={color} className="h-3 w-5" style={{ background: color }} />
          ))}
        </div>
        <div className="flex">
          {PALETTE_BOTTOM.map((color) => (
            <span key={color} className="h-3 w-5" style={{ background: color }} />
          ))}
        </div>
        <div className="mt-2.5 text-ink-4">
          {t({ tr: "`help` ile komutları gör.", en: "Type `help` for commands." })}
        </div>
      </div>
    </div>
  );
}

const COMMANDS: { name: string; help: L10n }[] = [
  { name: "help", help: { tr: "bu listeyi göster", en: "show this list" } },
  { name: "neofetch", help: { tr: "künye kartını yeniden bas", en: "print the summary card again" } },
  { name: "about", help: { tr: "kısa özet", en: "short summary" } },
  { name: "ls [dizin]", help: { tr: "dizini listele", en: "list a directory" } },
  { name: "cd <dizin>", help: { tr: "dizin değiştir", en: "change directory" } },
  { name: "cat <dosya>", help: { tr: "dosyayı oku", en: "read a file" } },
  { name: "open <uygulama>", help: { tr: "pencere aç", en: "open a window" } },
  { name: "contact", help: { tr: "iletişim bilgileri", en: "contact details" } },
  { name: "lang tr|en", help: { tr: "site dilini değiştir", en: "switch the site language" } },
  { name: "date", help: { tr: "tarih ve saat", en: "date and time" } },
  { name: "clear", help: { tr: "ekranı temizle (Ctrl+L)", en: "clear the screen (Ctrl+L)" } },
];

function Help() {
  const { t } = useLang();
  return (
    <div className="mb-1 flex flex-col">
      {COMMANDS.map((command) => (
        <div key={command.name}>
          <span className="inline-block w-44 font-bold text-ub-orange">{command.name}</span>
          <span className="text-ansi-grey">{t(command.help)}</span>
        </div>
      ))}
      <div className="mt-1 text-ink-4">
        {t({ tr: "Geçmiş için ↑ / ↓.", en: "↑ / ↓ for history." })} {DOCK_ORDER.join(", ")}
      </div>
    </div>
  );
}

function Listing({ target }: { target: string }) {
  const { t } = useLang();
  const dir = target.replace(/^~\/?/, "").replace(/\/$/, "");

  if (!dir) {
    return (
      <div className="flex flex-wrap gap-7">
        {["work/", "projects/", "teaching/", "certifications/"].map((name) => (
          <span key={name} className="font-bold text-ansi-blue">
            {name}
          </span>
        ))}
        {["summary.txt", "contact.txt", "cv.pdf"].map((name) => (
          <span key={name} className="text-ansi-grey">
            {name}
          </span>
        ))}
      </div>
    );
  }
  if (dir === "work") {
    return (
      <div className="flex flex-wrap gap-7">
        {experience.map((role) => (
          <span key={role.id} className={role.draft ? "text-ink-4" : "font-bold text-ansi-blue"}>
            {role.id}/
          </span>
        ))}
      </div>
    );
  }
  if (dir === "teaching") {
    return (
      <div className="flex flex-col">
        {courses.map((course) => (
          <span key={course.name} className="text-ansi-grey">
            {course.name} <span className="text-ink-4">· {t(course.note)}</span>
          </span>
        ))}
      </div>
    );
  }
  if (dir === "certifications") {
    return (
      <div className="flex flex-col">
        {certifications.map((item) => (
          <span key={item.name} className="text-ansi-grey">
            {item.name} <span className="text-ink-4">· {t(item.note)}</span>
          </span>
        ))}
      </div>
    );
  }
  if (dir === "projects") {
    return (
      <div className="flex flex-col">
        {projects.map((project) => (
          <span key={project.id} className="text-ansi-grey">
            <span className="font-bold text-ansi-blue">{project.id}/</span>{" "}
            <span className="text-ink-4">· {t(project.blurb)}</span>
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="text-err">
      {t({ tr: `ls: erişilemiyor '${target}'`, en: `ls: cannot access '${target}'` })}
    </div>
  );
}

function Cat({ file }: { file: string }) {
  const { t } = useLang();
  const { openApp, isMobile } = useShell();
  const name = file.replace(/^~\/?/, "");

  if (name === "summary.txt" || name === "about.txt") return <Msg v={profile.summary} wide />;
  if (name === "contact.txt") return <Contact />;
  if (name === "experience.md" || name === "work/experience.md") {
    return (
      <div className="flex flex-col gap-2">
        {experience.map((role) => (
          <div key={role.id}>
            <div className={role.draft ? "text-ink-4" : "font-bold text-ub-orange-light"}>
              ## {t(role.org)} · {t(role.role)}
            </div>
            <div className={role.draft ? "text-ink-4" : "text-ansi-green"}>`{t(role.dates)}`</div>
            {role.bullets.map((bullet, index) => (
              <div key={index} className={role.draft ? "text-ink-4" : "text-ansi-grey"}>
                <span className="text-ub-orange">- </span>
                {t(bullet)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (name === "cv.pdf") {
    return (
      <div>
        <span className="text-err">
          {t({ tr: "cat: cv.pdf: ikili dosya. ", en: "cat: cv.pdf: binary file. " })}
        </span>
        <a
          href={profile.cv}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => {
            if (isMobile) return;
            event.preventDefault();
            openApp("viewer");
          }}
        >
          {t({ tr: "Belge Görüntüleyici'de aç →", en: "Open in Document Viewer →" })}
        </a>
      </div>
    );
  }
  return (
    <div className="text-err">
      {t({
        tr: `cat: ${file || "?"}: böyle bir dosya yok`,
        en: `cat: ${file || "?"}: no such file`,
      })}
    </div>
  );
}

function Contact() {
  return (
    <div className="flex flex-col">
      <div>
        <span className="font-bold text-ub-orange">email</span>
        <span>: </span>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </div>
      <div>
        <span className="font-bold text-ub-orange">github</span>
        <span>: </span>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          {profile.githubLabel}
        </a>
      </div>
      <div>
        <span className="font-bold text-ub-orange">linkedin</span>
        <span>: </span>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          {profile.linkedinLabel}
        </a>
      </div>
    </div>
  );
}
