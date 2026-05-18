# 09 — Deployment Guide

## Catatan Utama

Kalau waktu terbatas, MVP boleh dibuat tanpa login dan database penuh. Prioritaskan end-to-end demo berjalan dulu.

Urutan prioritas deployment:

1. Frontend bisa diakses juri.
2. Scan flow berjalan.
3. OSV scan jalan atau mock fallback jalan.
4. Dashboard tampil.
5. PDF report bisa dibuat/download.
6. README dan demo script jelas.

## Environment Variables

Contoh `.env.example`:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEMO_MODE=false

# Backend
API_PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jagarepo

# External APIs
OSV_API_BASE_URL=https://api.osv.dev
NPM_REGISTRY_BASE_URL=https://registry.npmjs.org
PYPI_API_BASE_URL=https://pypi.org/pypi

# PDF
PDF_STORAGE_PATH=./storage/reports
```

## Local Development Commands

Sesuaikan dengan struktur repo setelah setup.

### Single app

```bash
npm install
npm run dev
npm run lint
npm run build
```

### Monorepo example

```bash
npm install
npm run dev:web
npm run dev:api
npm run lint
npm run build
```

## Build Commands

Frontend:

```bash
npm run build
```

Backend:

```bash
npm run build
npm run start
```

## Vercel Deployment Plan

1. Push repo ke GitHub.
2. Import project di Vercel.
3. Set root directory jika frontend ada di folder khusus.
4. Set env:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_DEMO_MODE`
5. Deploy.
6. Test landing page.
7. Test scan page.
8. Test koneksi ke backend.

## Railway Deployment Plan

1. Buat Railway project.
2. Deploy backend service.
3. Tambahkan PostgreSQL jika dipakai.
4. Set env:
   - `API_PORT`
   - `DATABASE_URL`
   - `CORS_ORIGIN`
   - `OSV_API_BASE_URL`
5. Pastikan backend punya health endpoint.
6. Test API dari frontend production.

## Database Migration Plan

Jika pakai Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

Production:

```bash
npx prisma migrate deploy
```

Jika waktu terbatas:

- Skip database login/history.
- Simpan hasil scan sementara di memory atau return langsung ke frontend.
- PDF generate dari current scan result.

## CORS Checklist

- [ ] `CORS_ORIGIN` sesuai domain Vercel.
- [ ] Upload endpoint menerima request dari frontend.
- [ ] Error CORS tidak muncul di browser.
- [ ] Localhost tetap bisa dipakai untuk development.

## Production Checklist

- [ ] `.env` tidak tercommit.
- [ ] `.env.example` lengkap.
- [ ] Frontend URL aktif.
- [ ] Backend URL aktif.
- [ ] Health check backend aktif.
- [ ] Upload test sukses.
- [ ] OSV scan sukses atau fallback aktif.
- [ ] PDF report test sukses.
- [ ] Root README punya link deployment.
- [ ] Demo script siap.

## Demo Fallback Jika Backend Gagal

Fallback strategy:

1. Aktifkan frontend demo mode.
2. Load mock result dari file static.
3. Render dashboard dari mock.
4. Generate report dari mock jika memungkinkan.
5. Jelaskan fallback dengan jujur jika ditanya.

Copy yang aman:

> “Untuk menjaga demo tetap stabil, kami menyediakan fallback mock result yang mengikuti format hasil scan asli. Core flow dan UI tetap sama.”

## Rollback Plan

Jika deployment production gagal mendekati demo:

- Gunakan local demo.
- Gunakan recorded video demo.
- Gunakan mock fallback.
- Tampilkan screenshot dashboard/report.
- Jangan memaksakan fitur belum stabil.
