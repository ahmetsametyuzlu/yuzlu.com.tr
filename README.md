# asyOS

Ahmet Samet Yüzlü'nün kişisel portfolyosu: Ubuntu / GNOME (Yaru koyu) masaüstü
metaforuyla çalışan, tamamen istemci tarafında bir web uygulaması. Türkçe ve
İngilizce.

Ziyaretçi bir masaüstüne düşer: terminal `neofetch` çıktısıyla künyeyi verir,
dosya yöneticisi iş geçmişini klasör olarak gezdirir, metin düzenleyici
`experience.md` dosyasını gösterir, ayarlar paneli iletişim bilgilerini tutar.
İki oyun (Mayın Tarlası, Klondike Solitaire) gerçekten oynanır.

## Çalıştırma

```bash
npm run dev     # http://localhost:3000
npm run build   # statik export -> out/
npm run lint
```

## Yapı

| Yol | İçerik |
| --- | --- |
| `app/` | Next.js App Router girişi, fontlar, global tema değişkenleri |
| `lib/content.ts` | Tüm site metni, iki dilde |
| `lib/i18n.tsx` | Dil deposu (`useSyncExternalStore`) ve saat kancası |
| `lib/apps.ts` | Uygulama kaydı: başlık, ikon, varsayılan pencere boyutu |
| `components/os/` | Pencere yöneticisi, üst çubuk, dock, Activities, mobil kabuk |
| `components/apps/` | Terminal, deneyim, dosyalar, iletişim, iki oyun |
| `components/ui/Icon.tsx` | Tek bir SVG ikon seti (24px ızgara, stroke tabanlı) |

## Notlar

- **İçerik tek yerde.** Yeni bir iş, ders veya sertifika eklemek için sadece
  `lib/content.ts` düzenlenir; terminal, dosya yöneticisi, metin düzenleyici ve
  mobil görünüm aynı veriden beslenir.
- **İki dil.** Her metin `{ tr, en }` biçiminde. Dil seçimi `localStorage`'da
  saklanır, ilk ziyarette tarayıcı diline bakılır. Sunucu her zaman Türkçe
  render eder; istemci hidrasyondan sonra bir kez günceller.
- **Pencere konumları** `localStorage`'da tutulur; hangi pencerelerin açık
  olduğu tutulmaz, her ziyaret terminalle başlar.
- **Mobil** 900px altında ya da dokunmatik cihazlarda ayrı bir kabuğa geçer:
  tam ekran uygulamalar, altta dock, sahte durum çubuğu yok.
- **Markalar.** Ubuntu logosu, GitHub ve LinkedIn markaları kullanılmadı;
  dock ikonlarının hepsi özel çizim SVG.

## Yayın

Site [yuzlu.com.tr](https://yuzlu.com.tr) adresinde GitHub Pages üzerinden
yayımlanır. `next.config.ts` içindeki `output: "export"` ile `npm run build`
düz HTML/CSS/JS'i `out/` klasörüne üretir; `main` dalına her push'ta
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) lint + build
çalıştırıp `out/` klasörünü Pages'e yükler. Alan adı `public/CNAME` içinde.

`public/cv.pdf` CV'nin herkese açık sürümüdür; başka bir yerde üretilip buraya
kopyalanır.

## Lisans

Kaynak kod [MIT](LICENSE). Kişisel içerik (`lib/content.ts` içindeki metinler
ve `public/cv.pdf`) © Ahmet Samet Yüzlü, tüm hakları saklıdır.
