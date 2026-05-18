# 06 — Acceptance Criteria

Dokumen ini berisi acceptance criteria global untuk JagaRepo.

## Product Acceptance Criteria

- [ ] User bisa memahami fungsi JagaRepo dari landing page dalam 30 detik.
- [ ] User bisa upload dependency file.
- [ ] User bisa melihat risk score.
- [ ] User bisa membaca explanation Bahasa Indonesia.
- [ ] User bisa melihat rekomendasi fix.
- [ ] User bisa export/generate report.
- [ ] User tidak diberi klaim security berlebihan.
- [ ] Demo bisa berjalan end-to-end.

## Frontend Acceptance Criteria

- [ ] Landing page responsive.
- [ ] CTA menuju scan page.
- [ ] Scan page punya upload area.
- [ ] Empty state jelas.
- [ ] Loading state jelas.
- [ ] Error state jelas.
- [ ] Result dashboard mudah dibaca.
- [ ] UI tidak overflow di desktop/laptop demo.
- [ ] Copywriting utama berbahasa Indonesia.
- [ ] Tidak ada UI yang mengklaim deteksi malware 100%.

## Backend Acceptance Criteria

- [ ] API menerima file upload.
- [ ] API menolak file invalid.
- [ ] API tidak crash saat file kosong.
- [ ] Error response konsisten.
- [ ] Tidak ada hardcoded secret.
- [ ] OSV API timeout ditangani.
- [ ] Mock fallback tersedia untuk demo.
- [ ] Build/start command berjalan.

## Parser Acceptance Criteria

- [ ] Bisa parse `package.json` valid.
- [ ] Bisa parse `dependencies`.
- [ ] Bisa parse `devDependencies`.
- [ ] Bisa handle `package.json` tanpa dependencies.
- [ ] Bisa handle invalid JSON.
- [ ] Bisa parse `requirements.txt` dengan version.
- [ ] Bisa parse `requirements.txt` tanpa version.
- [ ] Bisa handle comment/blank line di `requirements.txt`.
- [ ] Tidak crash jika dependency version kosong.
- [ ] Bisa detect ecosystem npm / PyPI.

## OSV Integration Acceptance Criteria

- [ ] Bisa query package npm.
- [ ] Bisa query package PyPI.
- [ ] Bisa handle package tanpa vulnerability.
- [ ] Bisa handle package dengan vulnerability.
- [ ] Bisa handle API timeout.
- [ ] Bisa handle API error.
- [ ] Response vulnerability dinormalisasi.
- [ ] Tidak ada API key/secret hardcoded.
- [ ] Demo tetap aman jika OSV gagal.

## Risk Engine Acceptance Criteria

- [ ] Score berada di range 0–100.
- [ ] Kategori Low / Medium / High / Critical konsisten.
- [ ] Known vulnerability severity memengaruhi score.
- [ ] Missing lockfile signal memengaruhi score.
- [ ] Suspicious heuristic dipisahkan dari known vulnerability.
- [ ] Confidence level tersedia.
- [ ] Score tidak melebihi 100.
- [ ] Score tidak menjadi NaN/undefined.
- [ ] Formula awal terdokumentasi.

## Dashboard Acceptance Criteria

- [ ] Overall risk score tampil jelas.
- [ ] Total dependencies tampil.
- [ ] Vulnerable dependencies tampil.
- [ ] Severity breakdown tampil.
- [ ] Dependency findings table tampil.
- [ ] Dependency detail panel tampil.
- [ ] Recommendation tampil.
- [ ] Empty/error state tampil dengan benar.
- [ ] Dashboard terlihat demo-ready.

## PDF Report Acceptance Criteria

- [ ] PDF bisa dibuat/download.
- [ ] Report berisi project name.
- [ ] Report berisi scan date.
- [ ] Report berisi risk score dan category.
- [ ] Report berisi total dependencies.
- [ ] Report berisi findings table.
- [ ] Report berisi explanation.
- [ ] Report berisi recommendation.
- [ ] Report berisi disclaimer.
- [ ] Tidak crash jika data kosong.

## Demo Acceptance Criteria

- [ ] Landing page jalan.
- [ ] Scan page jalan.
- [ ] Upload sample vulnerable `package.json` jalan.
- [ ] OSV scan jalan atau mock fallback jalan.
- [ ] Risk score tampil.
- [ ] Dependency table tampil.
- [ ] Explanation Bahasa Indonesia tampil.
- [ ] Recommendation fix tampil.
- [ ] PDF report bisa dibuat.
- [ ] Before/after score tersedia.
- [ ] Demo bisa selesai dalam 3–5 menit.
- [ ] Tidak ada klaim berlebihan.
