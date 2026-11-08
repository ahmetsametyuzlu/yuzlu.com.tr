import type { L10n } from "@/lib/i18n";

/**
 * All site copy lives here in both languages. Terminal, Files, the text editor
 * and the mobile shell all read from this one file.
 */

export const profile = {
  name: "Ahmet Samet Yüzlü",
  postNominals: "MSc, MBA",
  user: "ahmet",
  host: "portfolio",
  initials: "ASY",
  years: "15+",
  title: {
    tr: "Teknik Lider · Yazılım Mimarı · Kurucu",
    en: "Technical Lead · Software Architect · Founder",
  } satisfies L10n,
  shortTitle: {
    tr: "Teknik Lider ve Yazılım Mimarı",
    en: "Technical Lead & Software Architect",
  } satisfies L10n,
  location: { tr: "Ankara, Türkiye · Uzaktan", en: "Ankara, Türkiye · Remote" } satisfies L10n,
  summary: {
    tr:
      "2010'dan beri üretimde çalışan uygulamalar geliştiren ve işleten full-stack mühendis ve teknik lider; " +
      "2013'ten beri uzaktan çalışıyor. Mall IQ platformunun ilk backend sürümünü yazdı ve 2019'dan beri " +
      "mühendisliğini yönetiyor: milyonlarca kullanıcıya hizmet veren, 40+ sunuculu, tek sunucuda 1.500 " +
      "istek/saniyeye ulaşan bir platform. Node.js/TypeScript backend'ler, React ve Angular arayüzler, AWS, " +
      "CI/CD, gözlemlenebilirlik ve olay müdahalesi uçtan uca sorumluluğunda. Güvenlik günlük işinin parçası: " +
      "GitHub Advanced Security, sızma testi bulgularının kapatılması, Keycloak SSO, ISO 27001 ve SOC 2 " +
      "süreçleri. YouReply'ın kurucu ortağı ve CTO'su, açık kaynak güvenlik platformu Openasy'nin kurucusu.",
    en:
      "Full-stack engineer and technical lead building and running production applications since 2010, " +
      "remote since 2013. I wrote the first version of the Mall IQ platform backend and have led its " +
      "engineering since 2019: a platform serving millions of users on a 40+ server fleet, with the busiest " +
      "single server peaking at 1,500 requests per second. I own delivery end to end: Node.js/TypeScript " +
      "backends, React and Angular frontends, AWS, CI/CD, observability and incident response. Security is " +
      "part of my daily work: GitHub Advanced Security, penetration-test remediation, Keycloak SSO and " +
      "ISO 27001 / SOC 2 work. Co-founder and CTO of YouReply, founder of the open-source security platform " +
      "Openasy.",
  } satisfies L10n,
  email: "ahmetsametyuzlu@gmail.com",
  linkedin: "https://www.linkedin.com/in/ahmetsametyuzlu",
  linkedinLabel: "/in/ahmetsametyuzlu",
  github: "https://github.com/ahmetsametyuzlu",
  githubLabel: "github.com/ahmetsametyuzlu",
  cv: "/cv.pdf",
};

export type Role = {
  /** folder-safe id, also the path shown in Files and the terminal */
  id: string;
  org: string | L10n;
  role: L10n;
  dates: L10n;
  location: L10n;
  summary: L10n;
  bullets: L10n[];
  tech: string[];
  current: boolean;
  /** true while the entry is still waiting on real CV data */
  draft?: boolean;
};

const remote: L10n = { tr: "Uzaktan", en: "Remote" };

export const experience: Role[] = [
  {
    id: "mall-iq",
    org: "Mall IQ, Inc.",
    role: { tr: "Teknik Lider", en: "Technical Lead" },
    dates: { tr: "Eyl 2019 – Halen", en: "Sep 2019 – Present" },
    location: { tr: "Uzaktan · ABD merkezli", en: "Remote · US-based" },
    summary: {
      tr:
        "ABD merkezli kurumsal konum zekâsı ve pazarlama teknolojisi platformunun mühendislik liderliği: " +
        "mimari, mühendislik standartları, güvenlik ve teslimat.",
      en:
        "Engineering lead for a US-based enterprise location-intelligence and marketing-technology " +
        "platform: architecture, engineering standards, security and delivery.",
    },
    bullets: [
      {
        tr: "En fazla beş mühendisten oluşan ekibi yönetiyor; tasarım, kod kalitesi ve teslimattan sorumlu, ekipteki geliştiricileri kıdemli mühendisliğe taşıdı.",
        en: "Lead and mentor a team of up to five engineers, owning technical design, code quality and delivery; grew developers on the team into senior engineers.",
      },
      {
        tr: "40+ sunucuda milyonlarca kullanıcıya hizmet veren, tek sunucuda 1.500 istek/saniyeye ulaşan platformun tüm katmanları (Node.js/TypeScript, MySQL, Redis, Angular, React).",
        en: "Own the full stack (Node.js/TypeScript, MySQL, Redis, Angular, React) of a platform serving millions of users on 40+ servers, with the busiest single server peaking at 1,500 requests per second.",
      },
      {
        tr: "OpenAI API'lerini müşteri panellerine entegre ederek kampanya oluşturma ve kitle segmentasyonunu otomatikleştirdi; ekibi GitHub Copilot'tan Claude'a uzanan yapay zekâ destekli geliştirmeye geçirdi.",
        en: "Integrated OpenAI APIs into client dashboards to automate campaign creation and audience segmentation; moved the team to AI-first engineering, from GitHub Copilot to Claude.",
      },
      {
        tr: "Sürümlü REST API'ler ve iş ortaklarını bilgilendiren webhook'larla çift yönlü entegrasyonlar kurdu.",
        en: "Built bidirectional partner integrations: versioned REST APIs plus outbound webhooks.",
      },
      {
        tr: "Güvenilirlik ve gözlemlenebilirlik: MySQL replikasyonu, Redis önbellek, yük testleri, Prometheus/Grafana izleme ve nöbetli olay müdahalesi.",
        en: "Reliability and observability: MySQL replication and read replicas, Redis caching, load testing, Prometheus/Grafana monitoring and on-call incident response.",
      },
      {
        tr: "CI/CD (GitHub Actions), otomatik testler (Jest, Mocha, Cypress), izleme ve zafiyet taramasını devreye aldı.",
        en: "Introduced CI/CD (GitHub Actions), automated testing (Jest, Mocha, Cypress), monitoring and vulnerability scanning.",
      },
      {
        tr: "Güvenli yazılım geliştirme: GitHub Advanced Security, sızma testi bulgularının kapatılması, Keycloak ile kurumsal IAM ve SSO; ISO 27001 ve SOC 2 sertifikasyonlarına katkı ve güvenlik dokümantasyonu.",
        en: "Secure SDLC: GitHub Advanced Security, penetration-test remediation, Keycloak for enterprise IAM and SSO; contributed to ISO 27001 and SOC 2 certification and authored security documentation.",
      },
      {
        tr: "Yığını yerinde modernize etti (Node.js 16→24, Angular 10→19, Debian 8→13).",
        en: "Modernised the stack in place (Node.js 16→24, Angular 10→19, Debian 8→13).",
      },
    ],
    tech: ["Node.js", "TypeScript", "MySQL", "Redis", "Angular", "React", "AWS", "GitHub Actions", "Keycloak", "Prometheus", "Grafana", "OpenAI API"],
    current: true,
  },
  {
    id: "openasy",
    org: "Openasy",
    role: { tr: "Kurucu ve Baş Geliştirici", en: "Founder & Lead Developer" },
    dates: { tr: "Eyl 2026 – Halen", en: "Sep 2026 – Present" },
    location: { tr: "Açık kaynak", en: "Open source" },
    summary: {
      tr: "TypeScript ile yazılan açık kaynak (AGPL) güvenlik platformu.",
      en: "An open-source (AGPL) security platform written in TypeScript.",
    },
    bullets: [
      {
        tr: "VPN erişim yönetimi, zafiyet önceliklendirme, SAST/DAST/zararlı yazılım tarama ajanları, WAF (Coraza, OWASP CRS), Suricata tabanlı ağ IDS ve uyum kanıtları (ISO 27001, SOC 2, GDPR, PCI DSS).",
        en: "VPN access management, vulnerability prioritisation, SAST/DAST/malware scanning agents, WAF (Coraza, OWASP CRS), Suricata-based network IDS and compliance evidence (ISO 27001, SOC 2, GDPR, PCI DSS).",
      },
      {
        tr: "Mall IQ ve YouReply'da üretimde kullanılıyor.",
        en: "Used in production at Mall IQ and YouReply.",
      },
    ],
    tech: ["TypeScript", "Coraza", "OWASP CRS", "Suricata"],
    current: true,
  },
  {
    id: "youreply",
    org: "YouReply",
    role: { tr: "Kurucu Ortak ve CTO", en: "Co-founder & CTO" },
    dates: { tr: "Mar 2023 – Halen", en: "Mar 2023 – Present" },
    location: { tr: "Yarı zamanlı", en: "Part-time" },
    summary: {
      tr: "Güvenilir, kitle kaynaklı akademik araştırma platformu.",
      en: "A reliable crowdsourced academic research platform.",
    },
    bullets: [
      {
        tr: "Tüm teknolojiyi yönetiyor; backend'i TypeScript ve Python ile tasarlayıp yazdı.",
        en: "Lead all technology; designed and hand-built the backend in TypeScript and Python.",
      },
      {
        tr: "Araştırmacılardan katılımcılara ödeme akışlarını ve T.C. kimlik doğrulamasını (başarısızlıkta otomatik hesap iptali) geliştirdi.",
        en: "Built payment flows from researchers to participants and identity verification against Turkish national ID records, with automatic account cancellation on failure.",
      },
      {
        tr: "Platform 400+ akademik çalışmada kullanıldı.",
        en: "The platform has been used in 400+ academic studies.",
      },
    ],
    tech: ["TypeScript", "Python", "FastAPI", "Node.js"],
    current: true,
  },
  {
    id: "mall-iq-fullstack",
    org: "Mall IQ, Inc.",
    role: { tr: "Full Stack Yazılım Mühendisi", en: "Full Stack Software Engineer" },
    dates: { tr: "Eyl 2016 – Eyl 2019", en: "Sep 2016 – Sep 2019" },
    location: remote,
    summary: {
      tr: "Mall IQ platformunun ilk backend sürümünü yazdı.",
      en: "Wrote the first version of the Mall IQ platform backend.",
    },
    bullets: [
      {
        tr: "Kampanya, segmentasyon, raporlama, denetim/geçmiş ve yönetim modülleri için backend API'leri ve müşteri panelleri geliştirdi.",
        en: "Built backend APIs and customer-facing dashboards for campaigns, segmentation, reporting, audit/history and administration.",
      },
      {
        tr: "Apache Airflow ile otomatik veri iş akışları kurdu; 40+ sunucu ve kümeyi kurup işletti.",
        en: "Integrated Apache Airflow for automated data workflows; deployed and maintained 40+ servers and clusters.",
      },
    ],
    tech: ["Node.js", "MySQL", "Angular", "Apache Airflow", "Linux"],
    current: false,
  },
  {
    id: "ankara-science-university",
    org: "Ankara Science University",
    role: { tr: "Öğretim Görevlisi (yarı zamanlı)", en: "Lecturer (part-time)" },
    dates: { tr: "Oca 2024 – Haz 2026", en: "Jan 2024 – Jun 2026" },
    location: { tr: "Ankara, Türkiye", en: "Ankara, Türkiye" },
    summary: {
      tr: "Lisans düzeyinde Türkçe ve İngilizce dersler verdi.",
      en: "Taught undergraduate courses in both Turkish and English.",
    },
    bullets: [
      {
        tr: "Network Security, System Analysis & Design ve Web Design & Development derslerini verdi.",
        en: "Taught Network Security, System Analysis & Design and Web Design & Development.",
      },
    ],
    tech: ["Network Security", "System Analysis & Design", "Web Design & Development"],
    current: false,
  },
  {
    id: "cpe-link",
    org: "CPE Link (Wolters Kluwer)",
    role: { tr: "Yazılım Mühendisi", en: "Software Engineer" },
    dates: { tr: "Nis 2013 – Eyl 2016", en: "Apr 2013 – Sep 2016" },
    location: remote,
    summary: {
      tr: "cpelink.com ve 25+ ilgili projenin geliştirilmesi, bakımı ve testi.",
      en: "Developed, maintained and tested cpelink.com and 25+ related projects.",
    },
    bullets: [
      {
        tr: "Mobil web henüz yeniyken sitenin mobil sürümünü geliştirdi.",
        en: "Built the mobile version of the site when mobile web was still new.",
      },
      {
        tr: "Learning Ladder'ı geliştirdi, Compliance Manager'ı modernize etti.",
        en: "Developed Learning Ladder and modernised Compliance Manager.",
      },
      {
        tr: "Büyük hata giderme ve süreç iyileştirme çalışmalarına liderlik etti.",
        en: "Led major bug-fixing and process-improvement efforts.",
      },
    ],
    tech: [],
    current: false,
  },
  {
    id: "fikir-fabrikasi",
    org: "Fikir Fabrikası",
    role: { tr: "Yazılım Mühendisi", en: "Software Engineer" },
    dates: { tr: "Eyl 2011 – Nis 2013", en: "Sep 2011 – Apr 2013" },
    location: remote,
    summary: {
      tr: "Uzaktan ekip üyesi olarak 20+ web projesi teslim etti.",
      en: "Delivered 20+ web projects as a remote team member.",
    },
    bullets: [
      {
        tr: "Uzaktan ekip üyesi olarak 20+ web projesi teslim etti.",
        en: "Delivered 20+ web projects as a remote team member.",
      },
    ],
    tech: [],
    current: false,
  },
  {
    id: "brew-interactive",
    org: "Brew Interactive",
    role: { tr: "Backend Geliştirici", en: "Backend Developer" },
    dates: { tr: "Eki 2010 – Eyl 2011", en: "Oct 2010 – Sep 2011" },
    location: { tr: "Türkiye", en: "Türkiye" },
    summary: {
      tr: "15+ müşteri projesi için backend altyapısı kurdu.",
      en: "Built backend infrastructure for 15+ client projects.",
    },
    bullets: [
      {
        tr: "15+ müşteri projesi için backend altyapısı kurdu.",
        en: "Built backend infrastructure for 15+ client projects.",
      },
    ],
    tech: [],
    current: false,
  },
];

export const courses: { name: string; note: L10n }[] = [
  { name: "Network Security", note: { tr: "Lisans · TR/EN · Ankara Bilim Üni.", en: "Undergraduate · TR/EN · Ankara Science Univ." } },
  { name: "System Analysis & Design", note: { tr: "Lisans · TR/EN · Ankara Bilim Üni.", en: "Undergraduate · TR/EN · Ankara Science Univ." } },
  { name: "Web Design & Development", note: { tr: "Lisans · TR/EN · Ankara Bilim Üni.", en: "Undergraduate · TR/EN · Ankara Science Univ." } },
];

export const certifications: { name: string; note: L10n; verified: boolean }[] = [
  {
    name: "Oracle MySQL 5.6 Developer",
    note: { tr: "Oracle Certified Professional · 2015", en: "Oracle Certified Professional · 2015" },
    verified: true,
  },
  {
    name: "Zend PHP 5.3",
    note: { tr: "Zend Certified Engineer · 2012", en: "Zend Certified Engineer · 2012" },
    verified: true,
  },
  {
    name: "ISO 27001",
    note: {
      tr: "Sertifikasyon sürecine katkı (Mall IQ)",
      en: "Contributed to certification (Mall IQ)",
    },
    verified: true,
  },
  {
    name: "SOC 2",
    note: {
      tr: "Sertifikasyon sürecine katkı (Mall IQ)",
      en: "Contributed to certification (Mall IQ)",
    },
    verified: true,
  },
];

export type Project = {
  id: string;
  name: string | L10n;
  blurb: L10n;
  tech: string[];
  url?: string;
  draft?: boolean;
};

export const projects: Project[] = [
  {
    id: "openasy",
    name: "Openasy",
    blurb: {
      tr: "Açık kaynak (AGPL) güvenlik platformu: VPN erişimi, zafiyet önceliklendirme, tarama ajanları, WAF, ağ IDS ve uyum kanıtları.",
      en: "Open-source (AGPL) security platform: VPN access, vulnerability prioritisation, scanning agents, WAF, network IDS and compliance evidence.",
    },
    tech: ["TypeScript", "Coraza", "Suricata", "OWASP CRS"],
    url: "https://github.com/openasy",
  },
  {
    id: "youreply",
    name: "YouReply",
    blurb: {
      tr: "Kitle kaynaklı akademik araştırma platformu; 400+ çalışmada kullanıldı. Ödeme akışları ve T.C. kimlik doğrulaması.",
      en: "Crowdsourced academic research platform used in 400+ studies, with participant payments and national-ID verification.",
    },
    tech: ["TypeScript", "Python", "FastAPI"],
  },
  {
    id: "asyos",
    name: "asyOS",
    blurb: {
      tr: "Bu site: Ubuntu masaüstü metaforuyla çalışan, iki dilli, tamamen istemci taraflı portfolyo.",
      en: "This site: a bilingual, fully client-side portfolio built as an Ubuntu-style desktop.",
    },
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    url: "https://github.com/ahmetsametyuzlu/landing",
  },
];

export const education: { degree: L10n; place: L10n; year: L10n }[] = [
  {
    degree: { tr: "Doktora · İşletme", en: "PhD · Business Administration" },
    place: { tr: "Ankara Üniversitesi (SBF)", en: "Ankara University (Political Science)" },
    year: { tr: "2026 – devam ediyor", en: "2026 – in progress" },
  },
  {
    degree: { tr: "Tezli YL · Üretim ve İşlemler Yönetimi", en: "MSc · Production & Operations Mgmt." },
    place: { tr: "Hacettepe Üniversitesi", en: "Hacettepe University" },
    year: { tr: "2024 – 2026", en: "2024 – 2026" },
  },
  {
    degree: { tr: "MBA", en: "MBA" },
    place: { tr: "Hacettepe Üniversitesi", en: "Hacettepe University" },
    year: { tr: "2022 – 2024", en: "2022 – 2024" },
  },
  {
    degree: { tr: "YL · Yazılım Yönetimi", en: "MSc · Software Management" },
    place: { tr: "ODTÜ", en: "METU" },
    year: { tr: "2015 – 2018", en: "2015 – 2018" },
  },
  {
    degree: { tr: "Lisans · Havacılık ve Uzay Müh.", en: "BSc · Aerospace Engineering" },
    place: { tr: "ODTÜ", en: "METU" },
    year: { tr: "2014", en: "2014" },
  },
];

export const languages: L10n[] = [
  { tr: "Türkçe (ana dil)", en: "Turkish (native)" },
  { tr: "İngilizce (akıcı)", en: "English (fluent)" },
  { tr: "Almanca (başlangıç)", en: "German (beginner)" },
];
