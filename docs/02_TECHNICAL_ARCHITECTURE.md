# 02 — Technical Architecture

## Recommended Architecture

JagaRepo direkomendasikan sebagai web-based app dengan server-side scanning.

```txt
User
  ↓
Next.js Web App
  ↓
Backend API
  ↓
Dependency Parser
  ↓
Risk Engine
  ↓
External APIs
  ├─ OSV API
  ├─ npm Registry API
  └─ PyPI API
  ↓
PostgreSQL
  ↓
Dashboard + PDF Report
```

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js + Tailwind CSS |
| Backend | NestJS atau Express |
| Database | PostgreSQL |
| Frontend deployment | Vercel |
| Backend/database deployment | Railway |
| External API utama | OSV API |
| Optional metadata API | npm Registry API, PyPI API |
| Optional advisory source | GitHub Advisory Database |
| PDF generator | Server-side PDF generator |
| AI layer | Optional, hanya explanation, bukan deteksi utama |

## Frontend Architecture

Frontend bertanggung jawab untuk:

- Landing page
- Scan page
- Upload component
- Loading/empty/error/result states
- Result dashboard
- Dependency detail panel
- PDF report download action
- Before/after demo state

Rekomendasi folder:

```txt
src/
  app/
    page.tsx
    scan/page.tsx
    results/[scanId]/page.tsx
  components/
    landing/
    scan/
    dashboard/
    report/
    ui/
  lib/
    api-client.ts
    format-risk.ts
  types/
    scan.ts
```

## Backend Architecture

Backend bertanggung jawab untuk:

- File upload endpoint
- File validation
- Parser orchestration
- OSV API integration
- Risk scoring
- Explanation/recommendation generation
- PDF report generation
- Optional database persistence

Rekomendasi folder:

```txt
server/
  src/
    modules/
      upload/
      parser/
      scanner/
      risk/
      explanation/
      report/
    lib/
      osv-client.ts
      npm-client.ts
      pypi-client.ts
    types/
```

## Parser Architecture

Parser harus support:

- `package.json`
  - `dependencies`
  - `devDependencies`
  - optional `peerDependencies`
- `package-lock.json`
  - basic dependency extraction
  - lockfile presence signal
- `requirements.txt`
  - `package==version`
  - `package>=version`
  - `package~=version`
  - package tanpa version

Output parser harus dinormalisasi:

```ts
type ParsedDependency = {
  name: string;
  version?: string;
  ecosystem: "npm" | "PyPI";
  sourceFile: string;
  dependencyType?: "prod" | "dev" | "lock" | "unknown";
};
```

## Risk Engine Architecture

Risk engine menerima:

- Parsed dependency
- OSV vulnerabilities
- Metadata signal
- Project-level signal seperti missing lockfile

Risk engine menghasilkan:

```ts
type RiskFinding = {
  packageName: string;
  version?: string;
  ecosystem: "npm" | "PyPI";
  riskScore: number;
  riskCategory: "Low" | "Medium" | "High" | "Critical";
  confidence: "Low" | "Medium" | "High";
  reasons: string[];
  vulnerabilities: NormalizedVulnerability[];
  recommendation: string;
  explanationId?: string;
};
```

## External API Integration

### OSV API

Wajib untuk MVP. Dipakai untuk cek known vulnerability berdasarkan ecosystem, package, dan version.

### npm Registry API

Optional untuk MVP, berguna untuk metadata:

- publish time
- repository link
- maintainers
- latest version
- deprecated status

### PyPI API

Optional untuk MVP, berguna untuk metadata Python package.

### GitHub Advisory Database

Optional. Bisa dipakai di fase lanjutan untuk melengkapi OSV.

## Database Plan

MVP boleh berjalan tanpa login/database penuh jika waktu terbatas, tetapi struktur database disiapkan agar project bisa dikembangkan.

Tabel minimal:

- `users`
- `scans`
- `scan_dependencies`
- `vulnerabilities`
- `reports`

Jika waktu terbatas:

- Simpan scan result in-memory atau local storage untuk demo.
- PDF bisa generate dari current scan result tanpa history.

## PDF Generation Plan

PDF report dibuat server-side agar stabil dan konsisten.

Isi report:

- Project name
- Scan date
- Risk score
- Risk category
- Total dependencies
- Findings table
- Explanation
- Recommendation
- Disclaimer
- Next steps

## Deployment Architecture

```txt
Vercel
  └─ Next.js frontend

Railway
  ├─ Backend API
  └─ PostgreSQL database
```

Jika backend belum siap deploy:

- Gunakan API route Next.js untuk demo MVP.
- Tetap dokumentasikan rencana split backend.

## Environment Variables

Contoh:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
API_PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/jagarepo
OSV_API_BASE_URL=https://api.osv.dev
NPM_REGISTRY_BASE_URL=https://registry.npmjs.org
PYPI_API_BASE_URL=https://pypi.org/pypi
PDF_STORAGE_PATH=./storage/reports
DEMO_MODE=false
```

## Error Handling Strategy

Handle error berikut:

- File kosong
- File type tidak didukung
- JSON invalid
- Dependency version kosong
- OSV API timeout
- OSV API error
- Metadata API error
- PDF generation gagal
- Network error
- Result kosong

UI harus menampilkan error dalam Bahasa Indonesia dan tidak crash.

## Kenapa Web-based?

- Ringan.
- Tidak perlu install.
- Cocok untuk laptop kentang.
- Mudah diakses juri.
- Mudah di-hosting.
- Cocok untuk demo production.

## Kenapa Server-side Scanning?

- Device user tidak terbebani.
- Logic scanner terpusat.
- API integration lebih aman.
- Bisa menyimpan scan history nanti.
- Lebih mudah dikembangkan jadi SaaS.

## Kenapa Tidak Pakai ML Dulu?

- ML malicious package detection butuh dataset besar.
- Rawan false positive.
- Sulit divalidasi untuk demo cepat.
- Bisa membuat klaim security terlalu berlebihan.
- OSV API + rule-based scoring lebih realistis.

## Kenapa OSV API Cukup untuk MVP?

- OSV fokus pada vulnerability open-source.
- Bisa query berdasarkan ecosystem + package + version.
- Cocok untuk npm dan PyPI.
- Tidak perlu membangun database vulnerability sendiri.
- Membantu MVP tetap ringan dan grounded.
