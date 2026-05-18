# 08 — Testing Checklist

## Setup Test

- [ ] `npm install` berhasil.
- [ ] `.env.example` tersedia.
- [ ] `.env` tidak tercommit.
- [ ] Local dev server berjalan.
- [ ] Build command tersedia.
- [ ] Tidak ada error saat app start.

## Frontend Test

- [ ] Landing page render.
- [ ] CTA menuju scan page.
- [ ] Scan page render.
- [ ] Upload component muncul.
- [ ] Empty state muncul sebelum upload.
- [ ] Loading state muncul saat scan.
- [ ] Error state muncul saat file invalid/API error.
- [ ] Result dashboard render dengan mock/real data.
- [ ] UI responsive desktop.
- [ ] UI responsive mobile/tablet.
- [ ] Tidak ada overflow horizontal.

## Backend Test

- [ ] Upload endpoint tersedia.
- [ ] Endpoint menolak file kosong.
- [ ] Endpoint menolak file tidak didukung.
- [ ] Endpoint menerima `package.json`.
- [ ] Endpoint menerima `requirements.txt`.
- [ ] Error response konsisten.
- [ ] Timeout OSV ditangani.
- [ ] Mock fallback tersedia.

## Parser Test

### package.json

- [ ] `package.json` valid.
- [ ] `package.json` dengan `dependencies`.
- [ ] `package.json` dengan `devDependencies`.
- [ ] `package.json` tanpa dependencies.
- [ ] `package.json` invalid JSON.
- [ ] dependency version kosong.
- [ ] dependency version dengan prefix `^`, `~`, `>=`.

### package-lock.json

- [ ] lockfile valid.
- [ ] lockfile kosong/invalid.
- [ ] basic extraction berjalan.
- [ ] lockfile presence signal terbaca.

### requirements.txt

- [ ] package dengan `==`.
- [ ] package dengan `>=`.
- [ ] package dengan `~=`.
- [ ] package tanpa version.
- [ ] comment line diawali `#`.
- [ ] blank line.
- [ ] invalid line tidak membuat crash.

### File Type

- [ ] `.txt` selain `requirements.txt` ditolak jika tidak didukung.
- [ ] `.json` selain `package.json/package-lock.json` ditolak atau diberi warning.
- [ ] file terlalu besar ditolak.
- [ ] file kosong ditolak.

## API Integration Test

### OSV

- [ ] API sukses.
- [ ] API timeout.
- [ ] API error.
- [ ] package tanpa vulnerability.
- [ ] package dengan vulnerability.
- [ ] package version kosong.
- [ ] ecosystem npm.
- [ ] ecosystem PyPI.
- [ ] response dinormalisasi.

### Metadata API Optional

- [ ] npm package ditemukan.
- [ ] npm package tidak ditemukan.
- [ ] PyPI package ditemukan.
- [ ] PyPI package tidak ditemukan.
- [ ] metadata API gagal tanpa merusak scan utama.

## Risk Scoring Test

- [ ] Package tanpa vulnerability score rendah.
- [ ] Low vulnerability menambah score kecil.
- [ ] Medium vulnerability menambah score sedang.
- [ ] High vulnerability menambah score besar.
- [ ] Critical vulnerability menambah score besar.
- [ ] Missing lockfile menambah project risk.
- [ ] Suspicious heuristic tidak dianggap known malware.
- [ ] Score maksimum 100.
- [ ] Category sesuai range.
- [ ] Confidence level tampil.

## PDF Report Test

- [ ] PDF bisa dibuat dari real scan.
- [ ] PDF bisa dibuat dari mock scan.
- [ ] PDF bisa di-download.
- [ ] PDF punya project summary.
- [ ] PDF punya risk score.
- [ ] PDF punya findings table.
- [ ] PDF punya recommendation.
- [ ] PDF punya disclaimer.
- [ ] Data kosong tidak crash.

## Responsive Test

- [ ] 1366x768 laptop.
- [ ] 1920x1080 monitor.
- [ ] 768px tablet.
- [ ] 390px mobile.
- [ ] Dashboard table tidak merusak layout.
- [ ] PDF button tetap terlihat.
- [ ] Upload area tetap usable.

## Demo Rehearsal Test

- [ ] Demo 3 menit dilatih.
- [ ] Demo 5 menit dilatih.
- [ ] API real test dilakukan.
- [ ] Mock fallback test dilakukan.
- [ ] PDF download test dilakukan.
- [ ] Before/after score test dilakukan.
- [ ] Script opening/closing dihafal.
- [ ] Q&A disiapkan.

## Deployment Smoke Test

- [ ] Frontend deployed.
- [ ] Backend deployed.
- [ ] Env production terpasang.
- [ ] CORS benar.
- [ ] Upload jalan di production.
- [ ] OSV scan jalan di production.
- [ ] Mock fallback jalan di production.
- [ ] PDF download jalan di production.
