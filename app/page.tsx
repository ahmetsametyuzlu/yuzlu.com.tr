import { Desktop } from "@/components/os/Desktop";

export default function Home() {
  return (
    <>
      {/* Readable without JavaScript and for crawlers; the desktop replaces it visually. */}
      <h1 className="sr-only">Ahmet Samet Yüzlü · Technical Lead, Software Architect &amp; Lecturer</h1>
      <main className="h-full">
        <Desktop />
      </main>
    </>
  );
}
