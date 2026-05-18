# 11 — UI Design Direction

Dokumen ini adalah panduan desain visual JagaRepo untuk Claude Code, Codex, atau developer yang mengerjakan UI.

Gunakan dokumen ini sebagai referensi tunggal saat membangun atau memperbaiki tampilan.

---

## 1. Visual Identity

**Karakter produk:**
JagaRepo adalah developer security tool, bukan consumer app. Tampilannya harus terasa seperti alat kerja yang serius, presisi, dan bisa dipercaya — bukan playful atau terlalu colorful.

**Referensi produk:**
- **Vercel**: black/white minimal, developer SaaS, typografi kuat, contrast tinggi
- **Linear**: premium dark product dashboard, smooth interaction, komponen rapi
- **Supabase**: developer platform, dark/light/system theme, layout yang breathable
- **Resend**: clean developer API landing page, spacing lega, copy yang jelas
- **Socket/Snyk**: security SaaS positioning — serius tapi tidak menakutkan
- **Raycast**: smooth command-style interaction, precision UX, dark-first

**Prinsip desain:**
- **Kejelasan di atas kecantikan.** Data harus dibaca dalam 3 detik.
- **Dark mode adalah default.** Bukan afterthought.
- **Spacing lebih baik daripada dekorasi.** Jangan tambah elemen visual jika tidak ada fungsinya.
- **Warna untuk makna, bukan dekorasi.** Setiap warna punya arti (severity, status, action).
- **Typografi yang kuat.** Font besar untuk angka penting (risk score, total deps).
- **Tidak overcrowd.** Berikan ruang untuk data bernapas.

---

## 2. Color Palette — Dark Mode

Dark mode adalah tema utama dan default JagaRepo.

### Background

| Nama           | Tailwind Token    | Hex       | Penggunaan                              |
|----------------|-------------------|-----------|-----------------------------------------|
| `bg-base`      | `zinc-950`        | `#09090B` | Page background utama                   |
| `bg-surface`   | `zinc-900`        | `#18181B` | Card, panel, sidebar                    |
| `bg-elevated`  | `zinc-800`        | `#27272A` | Hover state, input background           |
| `bg-subtle`    | `zinc-800/60`     | semi-trans | Section divider, table row zebra        |

### Border

| Nama           | Tailwind Token    | Penggunaan                              |
|----------------|-------------------|-----------------------------------------|
| `border-base`  | `zinc-800`        | Border card, panel, input               |
| `border-muted` | `zinc-700`        | Divider, tabel header                   |

### Text

| Nama           | Tailwind Token    | Penggunaan                              |
|----------------|-------------------|-----------------------------------------|
| `text-primary` | `zinc-50`         | Heading, konten utama                   |
| `text-muted`   | `zinc-400`        | Label, keterangan, placeholder          |
| `text-faint`   | `zinc-600`        | Teks dekoratif, copyright               |

### Accent — Emerald

| Nama             | Tailwind Token    | Penggunaan                              |
|------------------|-------------------|-----------------------------------------|
| `accent-base`    | `emerald-500`     | CTA utama, active state, badge safe     |
| `accent-hover`   | `emerald-400`     | Hover state CTA                         |
| `accent-subtle`  | `emerald-950`     | Background badge safe, success area     |
| `accent-border`  | `emerald-800`     | Border success card                     |
| `accent-text`    | `emerald-400`     | Teks link sukses, label "Aman"          |

### Severity

| Severity | Background      | Border          | Text            | Badge fill       |
|----------|-----------------|-----------------|-----------------|------------------|
| Critical | `red-950`       | `red-800`       | `red-400`       | `red-500`        |
| High     | `orange-950`    | `orange-800`    | `orange-400`    | `orange-500`     |
| Medium   | `amber-950`     | `amber-800`     | `amber-400`     | `amber-500`      |
| Low      | `emerald-950`   | `emerald-800`   | `emerald-400`   | `emerald-500`    |

### Brand Indigo (secondary)

Digunakan untuk rekomendasi, info, CTA sekunder.

| Nama           | Tailwind Token    |
|----------------|-------------------|
| `info-bg`      | `indigo-950`      |
| `info-border`  | `indigo-800`      |
| `info-text`    | `indigo-400`      |

---

## 3. Color Palette — Light Mode

Light mode tersedia sebagai pilihan. Tetap clean, bukan "putih polos".

### Background

| Nama           | Tailwind Token    | Hex       | Penggunaan                              |
|----------------|-------------------|-----------|-----------------------------------------|
| `bg-base`      | `zinc-50`         | `#FAFAFA` | Page background utama                   |
| `bg-surface`   | `white`           | `#FFFFFF` | Card, panel                             |
| `bg-elevated`  | `zinc-100`        | `#F4F4F5` | Table header, input background          |
| `bg-subtle`    | `zinc-100/60`     | semi-trans | Section divider, zebra                  |

### Border

| Nama           | Tailwind Token    |
|----------------|-------------------|
| `border-base`  | `zinc-200`        |
| `border-muted` | `zinc-300`        |

### Text

| Nama           | Tailwind Token    |
|----------------|-------------------|
| `text-primary` | `zinc-900`        |
| `text-muted`   | `zinc-500`        |
| `text-faint`   | `zinc-400`        |

### Accent — Emerald (Light)

| Nama             | Tailwind Token    |
|------------------|-------------------|
| `accent-base`    | `emerald-600`     |
| `accent-hover`   | `emerald-700`     |
| `accent-subtle`  | `emerald-50`      |
| `accent-border`  | `emerald-200`     |
| `accent-text`    | `emerald-700`     |

### Severity (Light)

| Severity | Background   | Border       | Text         | Badge fill    |
|----------|--------------|--------------|--------------|---------------|
| Critical | `red-50`     | `red-200`    | `red-700`    | `red-500`     |
| High     | `orange-50`  | `orange-200` | `orange-700` | `orange-500`  |
| Medium   | `amber-50`   | `amber-200`  | `amber-700`  | `amber-500`   |
| Low      | `emerald-50` | `emerald-200`| `emerald-700`| `emerald-500` |

---

## 4. Typography

### Font Family

```
font-sans: Geist Sans (atau Inter sebagai fallback)
font-mono: Geist Mono (atau JetBrains Mono, Fira Code sebagai fallback)
```

Next.js App Router sudah include `next/font` untuk Geist. Gunakan itu.

Semua nama package, ID CVE, versi, dan perintah terminal harus menggunakan `font-mono`.

### Font Scale

| Role               | Size     | Weight       | Token          |
|--------------------|----------|--------------|----------------|
| Page title         | 28–32px  | Bold (700)   | `text-3xl font-bold` |
| Section heading    | 18–20px  | Semibold     | `text-xl font-semibold` |
| Card heading       | 14–16px  | Semibold     | `text-sm font-semibold` |
| Body text          | 14px     | Regular      | `text-sm` |
| Caption / label    | 12px     | Medium       | `text-xs font-medium` |
| Micro / disclaimer | 11px     | Regular      | `text-xs` |
| Risk score         | 48–64px  | Extrabold    | `text-6xl font-extrabold` |
| Package name       | 14px     | Semibold mono| `font-mono font-semibold` |
| CVE ID             | 12px     | Regular mono | `font-mono text-xs` |

### Aturan Typografi

- Heading halaman selalu `font-bold`, bukan `font-semibold`.
- Angka metrik penting (score, jumlah dep) gunakan `font-extrabold` atau `tabular-nums`.
- Jangan gunakan italic kecuali untuk quote atau catatan khusus.
- Line height untuk body: `leading-relaxed` (1.625).
- Line height untuk heading: `leading-tight` (1.25).

---

## 5. Component Style

### Button

```
Primary CTA:
  bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl px-6 py-2.5 font-semibold
  Dark: sama
  Light: bg-emerald-600 hover:bg-emerald-700

Secondary / Ghost:
  border border-zinc-700 bg-transparent hover:bg-zinc-800 text-zinc-200 rounded-xl
  Light: border-zinc-300 hover:bg-zinc-100 text-zinc-700

Danger:
  bg-red-600 hover:bg-red-700 text-white rounded-xl

Disabled:
  opacity-40 cursor-not-allowed (jangan ubah warna background)
```

Semua button punya `transition-colors duration-150`. Tidak perlu animasi kompleks.

### Badge / Chip

Badge severity menggunakan warna dari palette severity di atas.

```
Critical: bg-red-950 text-red-400 border border-red-800     (dark)
          bg-red-50  text-red-700 border border-red-200      (light)

High:     bg-orange-950 text-orange-400 border border-orange-800
Medium:   bg-amber-950  text-amber-400  border border-amber-800
Low:      bg-emerald-950 text-emerald-400 border border-emerald-800

Info (npm, PyPI, ecosystem):
  bg-zinc-800 text-zinc-300 border border-zinc-700           (dark)
  bg-zinc-100 text-zinc-600 border border-zinc-200           (light)
```

Badge shape: `rounded-md px-2 py-0.5 text-xs font-medium`.

### Card / Panel

```
Dark:
  bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm

Light:
  bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm
```

Jangan gunakan `shadow-lg` atau `shadow-xl` kecuali untuk modal/dropdown.
Radius konsisten: `rounded-2xl` untuk card besar, `rounded-xl` untuk card kecil/inline.

### Input

```
Dark:
  bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2
  placeholder:text-zinc-500 text-zinc-100
  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500

Light:
  bg-white border border-zinc-300 rounded-xl px-3 py-2
  placeholder:text-zinc-400 text-zinc-900
  focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600
```

### Table

```
Header row:
  bg-zinc-900 (dark) / bg-zinc-50 (light)
  text-xs font-semibold uppercase tracking-wide text-zinc-400 (dark) / zinc-500 (light)

Data row:
  border-b border-zinc-800 (dark) / border-zinc-100 (light)
  hover:bg-zinc-800/60 (dark) / hover:bg-zinc-50 (light)
  cursor-pointer jika baris bisa diklik

Selected row:
  bg-emerald-950/50 (dark) / bg-emerald-50 (light)
```

### Alert / Notice

```
Warning:
  bg-amber-950 border border-amber-800 text-amber-400   (dark)
  bg-amber-50  border border-amber-200 text-amber-700   (light)

Error:
  bg-red-950 border border-red-800 text-red-400         (dark)
  bg-red-50  border border-red-200 text-red-700         (light)

Info:
  bg-indigo-950 border border-indigo-800 text-indigo-400 (dark)
  bg-indigo-50  border border-indigo-200 text-indigo-700 (light)

Success:
  bg-emerald-950 border border-emerald-800 text-emerald-400 (dark)
  bg-emerald-50  border border-emerald-200 text-emerald-700 (light)
```

Shape: `rounded-xl px-4 py-3`.

### Upload Zone / Dropzone

```
Dark:
  border-2 border-dashed border-zinc-700 bg-zinc-900/50 rounded-2xl
  hover: border-emerald-600 bg-zinc-900
  dragging: border-emerald-500 bg-emerald-950/30

Light:
  border-2 border-dashed border-zinc-300 bg-zinc-50 rounded-2xl
  hover: border-emerald-500 bg-white
  dragging: border-emerald-500 bg-emerald-50/50
```

---

## 6. Landing Page Structure

Landing page harus bisa menjawab "Apa ini dan kenapa saya perlu?" dalam 10 detik.

### Sections (urutan)

```
1. NAVBAR
   - Logo kiri: "JagaRepo" dengan emerald accent dot atau icon
   - Nav kanan: "Cara Kerja", "Fitur", tombol "Mulai Scan →" (emerald)
   - Sticky, backdrop-blur, border-b tipis

2. HERO
   - Eyebrow label: "Open Source Dependency Security"
   - Headline besar: "Cek dependency sebelum jadi celah."
   - Subheadline: satu kalimat menjelaskan value prop
   - CTA utama: "Scan Project →" (emerald, besar)
   - CTA sekunder: "Lihat Contoh Scan" (ghost)
   - Visual: animated terminal/code block atau mock dashboard screenshot
   - Background: gradient subtle dari zinc-950 ke zinc-900

3. TRUST BAR / FEATURE STRIP
   - 4 feature icon + label dalam satu baris horizontal
   - Contoh: "OSV Database", "100% Open Source", "Bahasa Indonesia", "No Login"

4. HOW IT WORKS
   - 3 langkah: Upload → Scan → Report
   - Step number dengan emerald accent
   - Icon dan deskripsi singkat tiap step

5. FEATURE HIGHLIGHTS
   - 3–4 card fitur utama
   - Risk Score, Vulnerability Details, Recommendation, PDF Report
   - Grid 2x2 atau 1x4 tergantung layar

6. BEFORE / AFTER DEMO
   - Split view: "Sebelum diketahui" vs "Setelah pakai JagaRepo"
   - Show mock vulnerability count dan risk score

7. CTA PENUTUP
   - "Mulai scan sekarang. Gratis."
   - Satu tombol besar

8. FOOTER
   - Logo kiri, disclaimer kanan
   - Link ke GitHub, OSV, dokumentasi
   - "Dibuat untuk developer Indonesia"
```

### Hero visual guidelines

- Hindari stock photo atau ilustrasi cartoon.
- Gunakan mock terminal, mock dashboard card, atau animated code block.
- Dark background dengan glow emerald subtle di belakang hero element.
- Tidak perlu hero image yang besar dan berat.

---

## 7. Scan Page Structure

```
SCAN PAGE LAYOUT
├── Page Header (sticky atau static)
│   ├── Breadcrumb: JagaRepo > Scan Project
│   ├── Judul: "Scan Dependency"
│   └── Subtitle: instruksi singkat
│
└── Main Content (max-w-2xl centered)
    │
    ├── STATE: idle
    │   ├── UploadArea (dropzone besar)
    │   ├── File info (setelah file dipilih)
    │   ├── Tombol "Mulai Scan" (emerald, full atau half width)
    │   └── Info box: "Belum punya file? Gunakan demo/vulnerable-package.json"
    │
    ├── STATE: uploading / scanning
    │   └── ScanLoadingState
    │       ├── Animated icon / spinner
    │       ├── Step list dengan progress (5 steps)
    │       └── Current step label
    │
    ├── STATE: error
    │   └── ScanErrorState
    │       ├── Error message (bukan technical, Bahasa Indonesia)
    │       └── Tombol "Coba Lagi"
    │
    └── STATE: done (max-w-5xl, lebih lebar)
        └── ScanResultDashboard (lihat Section 8)
```

### UX rules untuk scan page

- Upload zone harus support drag-and-drop dan klik.
- File yang sudah dipilih tampilkan: nama file, ukuran, icon ekosistem.
- Tombol scan disabled dan abu-abu jika belum ada file.
- Selama scan, jangan tampilkan tombol scan. Tampilkan loading state saja.
- Jika error, pesan harus dalam Bahasa Indonesia yang actionable.

---

## 8. Result Dashboard Structure

```
RESULT DASHBOARD (max-w-5xl)
│
├── HEADER ROW
│   ├── Kiri: "Hasil Scan" + severity badge + filename + tanggal
│   └── Kanan: tombol "Scan file lain" + "Unduh PDF Report"
│
├── ERROR ALERT (kondisional)
│   └── Jika PDF error atau scan error
│
├── SUMMARY CARDS (grid 4 kolom)
│   ├── Score Card: angka besar + risk bar + label kategori
│   ├── Total Dependency: angka + "packages diperiksa"
│   ├── Vulnerable: angka merah + "packages berisiko"
│   └── Aman: angka emerald + "packages aman"
│
├── SEVERITY BREAKDOWN (kondisional, jika ada vuln)
│   ├── Stacked bar horizontal
│   └── Legend: Critical / High / Medium / Low + count
│
├── LOCKFILE WARNING (kondisional)
│   └── Alert amber jika tidak ada lockfile
│
├── MOCK/DEMO NOTICE (kondisional)
│   └── Alert indigo jika data dari demo
│
├── FINDINGS TABLE
│   ├── Header: Package | Versi | Ekosistem | Risiko | Vuln | Score
│   ├── Rows: vulnerable package dulu, safe package di bawah
│   └── Baris bisa diklik → buka FindingDetailPanel
│
├── FINDING DETAIL PANEL (kondisional, setelah klik baris)
│   ├── Package name + version + ecosystem badge + risk badge
│   ├── Risk score bar + confidence label
│   ├── Vulnerability list (jika ada)
│   │   └── Tiap vuln: ID, severity badge, summary, advisory link
│   ├── Heuristic signals (jika ada) → amber box dengan disclaimer
│   ├── Analysis reasons (bullet list)
│   └── Recommendation (indigo box)
│
└── DISCLAIMER
    └── Teks kecil di bawah: "Score adalah indikator awal..."
```

### UX rules dashboard

- Score card harus paling mencolok. Font extrabold, warna sesuai kategori.
- Package nama selalu `font-mono`.
- Baris tabel yang dipilih highlight dengan `bg-emerald-950/50`.
- Detail panel muncul di bawah tabel, bukan modal/drawer, agar tidak memblokir tabel.
- Lockfile warning hanya muncul jika `hasLockfile === false`.
- Tombol "Unduh PDF Report" muncul dengan loading spinner saat generating.

---

## 9. PDF Report Visual Style

PDF digenerate server-side menggunakan `pdfkit` (atau `@react-pdf/renderer` jika migrasi ke client-side).

### Layout

```
PAGE SIZE    : A4 (595.28 × 841.89 pt)
MARGIN       : 50pt kiri/kanan/atas/bawah
CONTENT WIDTH: 495.28pt
```

### Color dalam PDF

PDF tidak support Tailwind CSS. Gunakan hex langsung:

| Elemen             | Hex                          |
|--------------------|------------------------------|
| Accent             | `#10B981` (emerald-500)      |
| Primary text       | `#18181B` (zinc-900)         |
| Muted text         | `#71717A` (zinc-500)         |
| Faint text         | `#A1A1AA` (zinc-400)         |
| Background strip   | `#F4F4F5` (zinc-100)         |
| Border line        | `#E4E4E7` (zinc-200)         |
| Critical           | `#DC2626` (red-600)          |
| High               | `#EA580C` (orange-600)       |
| Medium             | `#D97706` (amber-600)        |
| Low                | `#16A34A` (green-600)        |
| Recommendation bg  | `#EEF2FF` (indigo-50)        |
| Info accent        | `#4F46E5` (indigo-600)       |

### Struktur halaman PDF

```
[Accent bar tipis di atas halaman]

[Header: "JagaRepo — Laporan Keamanan Dependency"]
[Garis pemisah]

[Ringkasan Scan]
  File         : <filename>
  Ekosistem    : npm / Python
  Tanggal Scan : <date>
  Lockfile     : Ada / Tidak ada

[Risk Summary Box — background zinc-100]
  Angka score besar di kiri (colored)
  Stats di kanan: total dep, vulnerable, aman

[Section: TABEL DEPENDENCY]
  Header row: PACKAGE | VERSI | EKOSISTEM | KATEGORI | VULN | SCORE
  Data rows: zebra striping ringan

[Section: DETAIL TEMUAN]
  Per package yang vulnerable:
  - Header bar dengan accent warna severity
  - Vulnerability list dengan ID dan summary
  - Analisis (reasons)
  - Rekomendasi box (indigo bg)
  - Horizontal divider

[DISCLAIMER]
  Teks kecil

[Page numbers di footer setiap halaman]
```

### Typography PDF

```
Font  : Helvetica (built-in pdfkit, no external font needed)
Bold  : Helvetica-Bold
Mono  : diemulasikan dengan Courier atau Helvetica dengan spasi

Heading section : 9pt, Helvetica-Bold, uppercase
Body text       : 8–9pt, Helvetica
Package name    : 9pt, Helvetica-Bold
Score big       : 32pt, Helvetica-Bold, colored
CVE ID          : 8pt, Helvetica-Bold
```

---

## 10. Animation Rules

JagaRepo menggunakan animasi **subtle dan purposeful**. Tidak ada animasi yang pure dekoratif.

### Library

- **Motion** (Framer Motion versi baru) untuk page transition, panel mount, card stagger.
- **Tailwind CSS transition** untuk hover/focus state (cukup `transition-colors duration-150`).
- **Sonner** untuk toast notification (sudah punya animasi built-in, tidak perlu custom).

### Aturan

```
✅ BOLEH
- Fade in saat komponen pertama mount (opacity 0 → 1, 200ms)
- Slide up saat result dashboard muncul (y: 8px → 0, 250ms ease-out)
- Stagger card summary (tiap card delay 50ms)
- Smooth transition pada risk score bar (transition-all duration-500)
- Spin animation untuk loading state tombol
- Hover transition warna tombol dan baris tabel (150ms)

❌ JANGAN
- Bounce, spring kuat, atau animasi yang "playful"
- Animasi yang berlangsung lebih dari 400ms pada elemen UI
- Parallax atau scroll-based animation
- Animasi pada elemen yang sering berubah (tabel, data real-time)
- Reduced motion diabaikan (selalu respect prefers-reduced-motion)
```

### Reduced motion

Semua animasi harus wrap dengan kondisi `prefers-reduced-motion`:

```tsx
// Gunakan hook dari Motion atau implementasi manual
const prefersReducedMotion = useReducedMotion();

const variants = {
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 8 },
  visible: { opacity: 1, y: 0 },
};
```

---

## 11. Accessibility Rules

JagaRepo harus accessible minimal hingga **WCAG 2.1 Level AA**.

### Warna dan Kontras

- Text utama di dark mode: minimal 7:1 contrast ratio (AAA target).
- Text muted (`zinc-400` di atas `zinc-900`): minimal 4.5:1.
- Jangan andalkan warna saja untuk menyampaikan informasi. Selalu sertakan teks atau icon.
- Severity badge harus punya label teks, bukan hanya dot warna.

### Keyboard Navigation

- Semua tombol dan link harus reachable dengan Tab.
- Focus ring harus terlihat jelas: `ring-2 ring-emerald-500 ring-offset-2 ring-offset-zinc-950` (dark).
- Baris tabel yang bisa diklik harus punya `tabIndex={0}` dan handler `onKeyDown` untuk Enter/Space.
- Upload dropzone harus bisa diaktifkan dengan keyboard.

### Screen Reader

- Semua icon-only button harus punya `aria-label`.
- Loading state: gunakan `aria-live="polite"` dan `aria-busy={true}`.
- Error message: gunakan `role="alert"` agar langsung dibaca screen reader.
- Tabel harus punya `<caption>` atau `aria-label`.
- Badge severity harus punya teks yang bisa dibaca (bukan hanya warna).

### Form dan Input

- Semua input punya `<label>` yang terhubung (`htmlFor` / `id`).
- Error state punya `aria-describedby` yang menunjuk ke pesan error.
- Upload file punya instruksi format yang jelas sebelum interaksi.

### Lainnya

- Gambar dekoratif punya `alt=""`.
- Gambar informasional punya `alt` yang deskriptif.
- Jangan gunakan `title` sebagai satu-satunya cara menyampaikan informasi.
- PDF report harus tetap readable jika dicetak hitam-putih.

---

## 12. Do and Don't

### Visual

| Do ✅                                                                 | Don't ❌                                                          |
|-----------------------------------------------------------------------|-------------------------------------------------------------------|
| Gunakan zinc-950 sebagai base background dark                         | Gunakan pure black `#000000` sebagai background                  |
| Font mono untuk semua package name, version, CVE ID                  | Font sans untuk kode dan package name                            |
| Warna severity untuk data severity, bukan dekorasi                   | Warna random untuk variasi visual                                |
| Spacing lega antar section (min 24px)                                 | Padding terlalu rapat, informasi crowded                         |
| Icon yang konsisten (lucide-react saja)                               | Mix icon dari library berbeda                                    |
| Risk score sebagai angka besar dan mencolok                           | Risk score kecil dan tersembunyi                                 |
| Badge rounded-md, bukan pill (rounded-full)                           | Semua badge rounded-full                                         |

### Copy dan Konten

| Do ✅                                                                 | Don't ❌                                                          |
|-----------------------------------------------------------------------|-------------------------------------------------------------------|
| "Package ini punya vulnerability yang diketahui."                    | "Package ini pasti malware."                                     |
| "Signal ini mencurigakan, perlu dicek manual."                       | "Package ini berbahaya, hapus sekarang."                         |
| "Score adalah indikator awal, bukan jaminan."                        | "JagaRepo menjamin aplikasi aman 100%."                          |
| Bahasa Indonesia yang manusiawi dan actionable                        | Bahasa teknis yang tidak dipahami developer pemula               |
| Label severity dalam Bahasa Indonesia di tooltip/detail              | Hanya kode seperti "HIGH" tanpa konteks                          |

### Interaksi

| Do ✅                                                                 | Don't ❌                                                          |
|-----------------------------------------------------------------------|-------------------------------------------------------------------|
| Tombol disabled dengan `opacity-40`, bukan ubah warna                | Tombol disabled punya warna baru yang membingungkan              |
| Loading state yang informatif (langkah apa yang sedang berjalan)     | Spinner tanpa label                                              |
| Error message dalam Bahasa Indonesia yang actionable                  | Error dump teknis seperti `TypeError: Cannot read...`            |
| Baris tabel bisa diklik, highlight saat hover                        | Baris tabel klik tapi tidak ada visual feedback                  |
| PDF download dengan nama file yang meaningful                         | PDF bernama `download.pdf` atau UUID panjang                     |

### Kode

| Do ✅                                                                 | Don't ❌                                                          |
|-----------------------------------------------------------------------|-------------------------------------------------------------------|
| Satu component satu tanggung jawab                                    | God component yang handle semua state                            |
| Severity color dari fungsi helper terpusat                           | Hardcode hex color di tiap komponen                              |
| Dark/light mode via CSS variable atau `dark:` Tailwind               | Hardcode color hanya untuk satu mode                             |
| `next-themes` untuk theme toggle                                      | Manual `localStorage` dan `document.body.className`             |

---

## 13. Dribbble Search Keywords

Gunakan keyword berikut untuk referensi visual saat desain atau pitching:

**Dashboard & Data**
- `security dashboard dark`
- `developer tool dark ui`
- `saas dashboard dark mode`
- `vulnerability scanner ui`
- `data table dark ui`

**Landing Page**
- `developer saas landing page dark`
- `b2b saas minimal landing page`
- `api product landing dark`
- `security product landing page`
- `startup landing page dark minimal`

**Component & Detail**
- `badge chip ui dark`
- `risk score card ui`
- `status badge component`
- `file upload component dark`
- `loading steps progress ui`

**Referensi Produk (search di Dribbble atau Behance)**
- Vercel Dashboard
- Linear App
- Supabase Dashboard
- Resend Email Platform
- Railway Dashboard
- Raycast UI

---

## Stack UI Reference

Berikut stack yang digunakan JagaRepo dan panduan singkat penggunaannya:

| Library             | Versi  | Kegunaan                                               |
|---------------------|--------|--------------------------------------------------------|
| `next.js`           | 15+    | App Router, RSC, SSR                                   |
| `tailwindcss`       | 4+     | Utility CSS, dark mode dengan `class` strategy         |
| `shadcn/ui`         | latest | Base component (Button, Badge, Table, Dialog, dll)     |
| `lucide-react`      | latest | Icon library — satu-satunya yang digunakan             |
| `motion`            | latest | Animasi (Framer Motion v11+)                           |
| `recharts`          | latest | Visualisasi data (severity chart, score chart)         |
| `next-themes`       | latest | Dark/light/system theme toggle                         |
| `sonner`            | latest | Toast notification                                     |
| `zod`               | latest | Validasi schema form dan API response                  |
| `@tanstack/table`   | latest | Table dengan sorting, filtering, pagination            |
| `@react-pdf/renderer`| latest | Client-side PDF generation (opsi alternatif pdfkit)   |

### Catatan penting

- `shadcn/ui` adalah **base**, bukan design system final. Semua komponen dari shadcn harus disesuaikan dengan palette JagaRepo.
- `@tanstack/table` digunakan untuk findings table jika perlu sorting/filtering yang kompleks. Untuk tabel sederhana, table HTML biasa sudah cukup.
- `@react-pdf/renderer` adalah alternatif jika ingin generate PDF di client-side. Keuntungan: tidak butuh backend untuk PDF. Kekurangan: bundle lebih besar.
- `recharts` digunakan untuk severity breakdown chart jika dibutuhkan visualisasi yang lebih kompleks dari stacked bar CSS biasa.
- `motion` harus respek `prefers-reduced-motion`. Selalu sertakan fallback.
