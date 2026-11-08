import type { Metadata, Viewport } from "next";
import { Ubuntu_Sans, Ubuntu_Sans_Mono } from "next/font/google";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const ubuntuSans = Ubuntu_Sans({
  variable: "--font-ubuntu-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const ubuntuMono = Ubuntu_Sans_Mono({
  variable: "--font-ubuntu-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const SITE_TITLE = "Ahmet Samet Yüzlü · Technical Lead & Software Architect";
const SITE_DESCRIPTION =
  "Portfolio of Ahmet Samet Yüzlü: technical lead and software architect with 15+ years building and " +
  "running production systems across full-stack development, cloud, DevOps and security.";

export const metadata: Metadata = {
  metadataBase: new URL("https://yuzlu.com.tr"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: "asyOS",
  authors: [{ name: "Ahmet Samet Yüzlü", url: "https://yuzlu.com.tr" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "asyOS",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#2c001e",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${ubuntuSans.variable} ${ubuntuMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
