# JagaRepo

**Tagline:** Cek dependency sebelum jadi celah.

JagaRepo adalah platform web ringan berbahasa Indonesia untuk membantu developer pemula, mahasiswa, kampus, dan startup kecil mengecek risiko dependency open-source di project mereka.

> Fokus project ini adalah demo production MVP: terlihat serius, usable, dan punya alur end-to-end dari upload dependency file sampai security report.

## Problem

Developer modern jarang membuat aplikasi dari nol. Mereka memakai banyak dependency seperti npm packages, PyPI packages, GitHub Actions, framework, dan template project. Dependency mempercepat development, tetapi juga membuka risiko supply chain attack jika package yang digunakan vulnerable, mencurigakan, atau disusupi.

## Solution

JagaRepo membantu user:

- Upload `package.json`, `package-lock.json`, atau `requirements.txt`
- Parse dependency
- Scan vulnerability via OSV API
- Memberi risk score dan kategori risiko
- Menjelaskan risiko dalam Bahasa Indonesia
- Memberi rekomendasi fix
- Generate PDF security report
- Menunjukkan demo before/after score

## Core Features MVP

- Landing page
- Scan page
- File upload + validation
- Dependency parser untuk npm dan PyPI
- OSV API vulnerability scan
- Risk scoring 0–100
- Risk category: Low / Medium / High / Critical
- Dependency findings table
- Explanation + recommendation Bahasa Indonesia
- PDF report generator
- Demo sample vulnerable/safe project
- Offline mock fallback untuk demo

## Tech Stack

Rekomendasi stack:

- Frontend: Next.js + Tailwind CSS
- Backend: NestJS atau Express
- Database: PostgreSQL
- Frontend deployment: Vercel
- Backend/database deployment: Railway
- External API utama: OSV API
- Optional metadata API: npm Registry API, PyPI API
- PDF generation: server-side
- AI layer: optional untuk explanation, bukan deteksi utama

## How to Run Locally

> Sesuaikan command setelah implementasi project setup selesai.

```bash
npm install
npm run dev
```

Jika memakai monorepo:

```bash
npm run dev:web
npm run dev:api
```

## Demo Flow

1. Buka landing page JagaRepo.
2. Jelaskan bahwa aplikasi modern memakai banyak dependency.
3. Upload sample vulnerable `package.json`.
4. Sistem parse dependency dan scan OSV.
5. Dashboard menampilkan risk score.
6. Buka dependency detail.
7. Tampilkan explanation Bahasa Indonesia dan rekomendasi fix.
8. Generate PDF report.
9. Tampilkan before/after score dengan sample safe project.
10. Closing: keamanan bisa dimulai dari cek dependency sederhana.

## Folder Structure

```txt
docs/
  README.md
  00_PROJECT_CONTEXT.md
  01_PRODUCT_REQUIREMENTS.md
  02_TECHNICAL_ARCHITECTURE.md
  03_DEMO_PRODUCTION_SCOPE.md
  04_SPRINT_TASK_PLANNING.md
  05_TASK_EXECUTION_RULES.md
  06_ACCEPTANCE_CRITERIA.md
  07_DEMO_SCRIPT.md
  08_TESTING_CHECKLIST.md
  09_DEPLOYMENT_GUIDE.md
  10_FINAL_SUBMISSION_CHECKLIST.md
  tasks/
    TASK_00_REPO_AUDIT.md
    ...
    TASK_15_FINAL_DEMO_PACKAGE.md
```

## Environment Variables

Contoh awal:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
API_PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/jagarepo
OSV_API_BASE_URL=https://api.osv.dev
PDF_STORAGE_PATH=./storage/reports
DEMO_MODE=false
```

Catatan:

- Jangan commit `.env`.
- Simpan hanya `.env.example`.
- OSV API public tidak selalu membutuhkan API key, tetapi tetap buat config URL agar mudah diubah.

## Limitations

JagaRepo bukan pengganti Snyk, Dependabot, Socket, GitHub Advanced Security, atau scanner enterprise lain. JagaRepo adalah platform edukatif dan ringan untuk membantu developer Indonesia memahami risiko dependency.

Batasan MVP:

- Tidak membuat ML malware detector.
- Tidak membuat malware sandbox.
- Tidak mengklaim bisa mendeteksi semua malicious package.
- Tidak membuat enterprise compliance engine.
- Tidak membuat VS Code extension.
- Tidak melakukan auto pull request fix.

## Future Improvements

- GitHub repo URL scan
- Scan history
- Team workspace
- SBOM export
- GitHub OAuth
- GitHub Actions integration
- Education plan untuk kelas/kampus
- Before/after remediation report yang lebih detail

## Documentation for Agents

Sebelum coding, agent wajib membaca:

1. [`docs/00_PROJECT_CONTEXT.md`](docs/00_PROJECT_CONTEXT.md)
2. [`docs/04_SPRINT_TASK_PLANNING.md`](docs/04_SPRINT_TASK_PLANNING.md)
3. [`docs/05_TASK_EXECUTION_RULES.md`](docs/05_TASK_EXECUTION_RULES.md)
4. File task yang sedang dikerjakan di [`docs/tasks`](docs/tasks)
