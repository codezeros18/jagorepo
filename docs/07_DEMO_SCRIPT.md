# 07 — Demo Script

## Opening Hook

> “Aplikasi modern terlihat seperti kode kita sendiri, padahal sebagian besar dibangun dari package orang lain.”

## Demo Narrative 3 Menit

1. **Tampilkan landing page**
   - “Ini JagaRepo, platform ringan untuk cek risiko dependency open-source.”

2. **Jelaskan problem**
   - “Developer sering pakai package dari npm atau PyPI agar development lebih cepat. Tapi kalau package tersebut vulnerable atau mencurigakan, project kita ikut berisiko.”

3. **Upload vulnerable package**
   - “Sekarang saya upload contoh `package.json` dari project demo.”

4. **Loading scan**
   - “Sistem membaca dependency, mengecek vulnerability, lalu menghitung risk score.”

5. **Dashboard hasil**
   - “Di sini terlihat overall risk score, jumlah dependency, severity, dan dependency yang perlu diperhatikan.”

6. **Buka dependency detail**
   - “JagaRepo tidak hanya memberi alert teknis, tapi menjelaskan risiko dalam Bahasa Indonesia dan memberi rekomendasi fix.”

7. **Generate PDF report**
   - “Report ini bisa dipakai untuk dosen, juri, mentor, atau stakeholder non-security.”

8. **Closing**
   - “JagaRepo bukan cuma menemukan celah, tapi menerjemahkan risiko teknis menjadi keputusan yang bisa dipahami.”

## Demo Narrative 5 Menit

Gunakan alur 3 menit, lalu tambahkan:

9. **Before/after score**
   - Upload sample safe project atau klik mock safe result.
   - Tampilkan score membaik setelah dependency diperbarui.

10. **Value positioning**
   - “Kami tidak menggantikan Snyk atau Dependabot. Kami fokus membuat supply chain security lebih mudah dipahami oleh developer Indonesia.”

11. **Future plan**
   - “Ke depan bisa ditambah GitHub repo scan, scan history, SBOM export, dan education plan untuk kelas/kampus.”

## Closing Statement

> “Keamanan tidak harus menunggu perusahaan besar. Dengan JagaRepo, developer pemula bisa mulai memahami risiko supply chain sejak awal.”

## Kalimat yang Harus Diingat Juri

> “JagaRepo bukan cuma menemukan celah, tapi menerjemahkan risiko teknis menjadi keputusan yang bisa dipahami.”

## UI Checklist Saat Demo

- [ ] Landing page terbuka.
- [ ] CTA terlihat jelas.
- [ ] Scan page terlihat bersih.
- [ ] Upload area terlihat.
- [ ] File name muncul setelah upload.
- [ ] Loading state muncul.
- [ ] Risk score terlihat besar.
- [ ] Severity breakdown terlihat.
- [ ] Dependency findings table terlihat.
- [ ] Detail panel bisa dibuka.
- [ ] Explanation Bahasa Indonesia terlihat.
- [ ] Recommendation terlihat.
- [ ] PDF report bisa dibuat/download.
- [ ] Before/after score tersedia.

## Demo Backup Plan

Jika OSV API gagal:

1. Aktifkan `DEMO_MODE=true`.
2. Gunakan `mock-scan-high-risk.json`.
3. Jelaskan:
   > “Untuk menjaga demo stabil, fallback ini mengikuti format hasil scan asli.”
4. Tetap tampilkan dashboard dan PDF report.

Jika backend gagal:

1. Gunakan static/mock result di frontend.
2. Fokus demo ke UX, risk explanation, dan report.
3. Jangan menyembunyikan fallback jika ditanya; jelaskan sebagai demo resilience.

Jika PDF gagal:

1. Tampilkan report preview page.
2. Jelaskan PDF generator masih bisa dipasang server-side.
3. Prioritaskan flow scan dan dashboard.

## Q&A Preparation

### Q: Ini cuma wrapper OSV API?

A: OSV dipakai sebagai salah satu sumber data vulnerability. Value utama JagaRepo ada pada risk scoring gabungan, explanation Bahasa Indonesia, recommendation fix, PDF report, before/after score, dan UX edukatif untuk developer pemula.

### Q: Apakah JagaRepo bisa mendeteksi semua malicious package?

A: Tidak. MVP tidak mengklaim deteksi semua malware. JagaRepo membedakan known vulnerability dari suspicious heuristic dan menampilkan confidence level.

### Q: Kenapa tidak langsung pakai Snyk atau Dependabot?

A: Tools tersebut bagus. JagaRepo tidak menggantikan mereka. JagaRepo fokus pada edukasi, Bahasa Indonesia, report-friendly workflow, dan konteks mahasiswa/startup kecil.

### Q: Kenapa tidak pakai ML?

A: ML malicious package detection butuh dataset besar dan validasi kuat. Untuk MVP, OSV API + rule-based scoring lebih realistis dan lebih aman dari false claim.

### Q: Siapa target awalnya?

A: Mahasiswa developer, developer pemula, bootcamp, dosen, dan startup kecil yang butuh audit awal ringan.
