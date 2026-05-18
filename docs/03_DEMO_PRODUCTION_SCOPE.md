# 03 — Demo Production Scope

## Tujuan Demo Production

Membuat prototype JagaRepo yang terlihat serius, usable, dan punya alur end-to-end:

```txt
Landing Page
→ Upload dependency file
→ Parse dependency
→ Scan OSV
→ Risk score
→ Explanation Bahasa Indonesia
→ Recommendation fix
→ PDF report
→ Demo before/after
```

Demo tidak perlu menjadi SaaS enterprise. Fokusnya adalah membuktikan bahwa problem nyata, solusi jelas, dan MVP bisa digunakan.

## Demo Success Criteria

- Juri paham problem dalam 30 detik.
- Scan flow bisa selesai tanpa error.
- Dashboard terlihat profesional.
- Report bisa dibuka/download.
- Tidak ada klaim berlebihan.
- Ada fallback jika OSV API gagal.
- Demo bisa dijalankan ulang beberapa kali.
- UI aman dilihat di layar laptop/proyektor.

## Demo Flow

1. Tampilkan landing page JagaRepo.
2. Jelaskan masalah supply chain dependency.
3. User klik “Scan Project”.
4. User upload sample vulnerable `package.json`.
5. Sistem validasi file.
6. Sistem membaca dependency.
7. Sistem scan OSV.
8. Dashboard muncul dengan risk score.
9. Dependency table muncul.
10. User buka dependency detail.
11. Ada explanation Bahasa Indonesia.
12. Ada recommendation fix.
13. User generate PDF report.
14. Optional: tampilkan before/after score dengan safe sample.
15. Closing impact.

## Demo Data yang Harus Tersedia

Wajib:

- `demo/vulnerable-package.json`
- `demo/safe-package.json`
- `demo/mock-scan-high-risk.json`
- `demo/mock-scan-low-risk.json`
- `demo/README.md`

Catatan penting:

- Jangan gunakan malware nyata.
- Gunakan package/version yang aman untuk contoh, atau mock result jika API real tidak stabil.
- Jelaskan bahwa mock fallback dipakai untuk memastikan demo tetap berjalan.

## Fitur Wajib Terlihat saat Demo

- Landing page JagaRepo
- CTA menuju scan page
- Upload file
- Loading state
- Risk score
- Risk category
- Severity breakdown
- Dependency findings table
- Detail panel
- Explanation Bahasa Indonesia
- Recommendation fix
- Export/generate PDF report
- Optional before/after score

## Backup / Offline Demo Jika API Gagal

MVP wajib punya mock fallback:

- Jika OSV API timeout, tampilkan opsi “Gunakan demo result”.
- Jika backend gagal, frontend tetap bisa render mock dashboard.
- Simpan mock result high-risk dan low-risk di repo.
- PDF generator bisa generate dari mock data.
- Jelaskan di demo: “Untuk menjaga demo tetap stabil, kami siapkan fallback mock yang mengikuti format hasil scan asli.”

## Batasan Demo

- Tidak melakukan malware sandboxing.
- Tidak mengeksekusi dependency.
- Tidak mengklaim package sebagai malware pasti.
- Tidak melakukan auto fix.
- Tidak login/team workspace dulu.
- Tidak scan GitHub repo jika belum stabil.
- Tidak membuat report compliance enterprise.

## Demo Readiness Checklist

- [ ] Landing page siap.
- [ ] Scan page siap.
- [ ] Upload `package.json` jalan.
- [ ] Parser jalan.
- [ ] OSV scan jalan atau fallback jalan.
- [ ] Risk score tampil.
- [ ] Dependency table tampil.
- [ ] Explanation Indonesia tampil.
- [ ] Recommendation tampil.
- [ ] PDF report bisa dibuat.
- [ ] Before/after score tersedia.
- [ ] Script demo sudah dilatih.
