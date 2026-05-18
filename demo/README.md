# Demo Data — JagaRepo

Folder ini berisi file demo untuk keperluan presentasi dan pengujian JagaRepo.

---

## File yang Tersedia

| File | Keterangan |
|------|------------|
| `vulnerable-package.json` | `package.json` dengan dependency yang memiliki vulnerability diketahui |
| `safe-package.json` | `package.json` dengan dependency yang sudah diperbarui ke versi aman |
| `mock-scan-high-risk.json` | Hasil scan mock untuk skenario high risk (3 package vulnerable) |
| `mock-scan-low-risk.json` | Hasil scan mock untuk skenario low risk (semua aman) |

---

## Cara Menggunakan untuk Demo

### Skenario 1 — Menunjukkan masalah (Before)

1. Buka JagaRepo di browser.
2. Klik **"Scan Project"**.
3. Upload `demo/vulnerable-package.json`.
4. Klik **"Mulai Scan"**.
5. Lihat hasil: Risk Score tinggi, 3 package vulnerable (lodash, axios, minimist).
6. Buka detail masing-masing untuk melihat CVE dan rekomendasi.
7. Klik **"Unduh PDF Report"** untuk menghasilkan laporan.

### Skenario 2 — Menunjukkan solusi (After)

1. Klik **"Scan file lain"** pada dashboard.
2. Upload `demo/safe-package.json`.
3. Klik **"Mulai Scan"**.
4. Lihat hasil: Risk Score 0, semua package aman.
5. Bandingkan dengan skenario sebelumnya.

### Demo Before/After (untuk slide)

Upload `vulnerable-package.json` → tunjukkan score **Critical 82/100**
Upload `safe-package.json` → tunjukkan score **Low 0/100**

Pesan: "Dengan update 3 package, risk score turun dari Critical ke Low."

---

## Detail Vulnerability dalam Demo

### lodash 4.17.20 → 4.17.21

| CVE | Severity | Deskripsi |
|-----|----------|-----------|
| GHSA-jf85-cpcp-j695 | HIGH | Prototype Pollution — attacker dapat memodifikasi `Object.prototype` |
| GHSA-29mw-wpgm-hmr9 | HIGH | ReDoS — ekspresi regex tidak aman menyebabkan CPU spike |

**Fix:** `npm install lodash@4.17.21`

### axios 0.21.1 → 1.7.2

| CVE | Severity | Deskripsi |
|-----|----------|-----------|
| GHSA-wf5p-g6vw-rhxx | HIGH | Cross-Site Request Forgery (CSRF) |
| GHSA-cxjh-pqwp-8mfp | MEDIUM | follow-redirects URL Redirect — header bocor saat redirect |

**Fix:** `npm install axios@1.7.2`

### minimist 1.2.5 → 1.2.8

| CVE | Severity | Deskripsi |
|-----|----------|-----------|
| GHSA-vh95-rmgr-6w4m | MEDIUM | Prototype Pollution — argument parsing tidak aman |

**Fix:** `npm install minimist@1.2.8`

---

## Mock Scan Result

File `mock-scan-high-risk.json` dan `mock-scan-low-risk.json` mengikuti format response dari `POST /api/scan` dan `UploadScanResponse` schema di `web/src/types/scan.ts`.

File ini digunakan sebagai:
- Referensi format data yang dihasilkan backend
- Fallback data jika OSV API tidak dapat dijangkau saat demo
- Data awal untuk pengujian komponen frontend secara offline

### Memuat mock result secara manual (offline demo)

Jika OSV API tidak tersedia dan backend tidak berjalan, frontend dapat di-set ke demo mode:

```env
NEXT_PUBLIC_DEMO_MODE=true
```

Dalam mode ini, frontend akan menggunakan data mock internal yang mirip dengan `mock-scan-high-risk.json`.

---

## Catatan Penting

- **Tidak ada malware nyata** dalam file ini. Semua package yang disebutkan adalah package legitimate yang memiliki vulnerability yang sudah dipublikasikan dan sudah dipatch.
- Vulnerability yang disebutkan adalah **public CVE** dari database OSV (osv.dev).
- Versi yang tercantum dalam `vulnerable-package.json` sengaja menggunakan versi lama yang diketahui vulnerable **untuk keperluan demonstrasi**.
- **Jangan deploy** `vulnerable-package.json` ke production.
- Mock result menggunakan data statis — bukan hasil scan real-time dari OSV API.

---

## Sumber Data Vulnerability

Semua advisory yang direferensikan dapat dilihat di:

- [GHSA-jf85-cpcp-j695](https://github.com/advisories/GHSA-jf85-cpcp-j695) — lodash Prototype Pollution
- [GHSA-29mw-wpgm-hmr9](https://github.com/advisories/GHSA-29mw-wpgm-hmr9) — lodash ReDoS
- [GHSA-wf5p-g6vw-rhxx](https://github.com/advisories/GHSA-wf5p-g6vw-rhxx) — axios CSRF
- [GHSA-cxjh-pqwp-8mfp](https://github.com/advisories/GHSA-cxjh-pqwp-8mfp) — follow-redirects Redirect
- [GHSA-vh95-rmgr-6w4m](https://github.com/advisories/GHSA-vh95-rmgr-6w4m) — minimist Prototype Pollution
