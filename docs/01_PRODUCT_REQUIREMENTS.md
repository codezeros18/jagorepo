# 01 — Product Requirements

## Product Overview

JagaRepo adalah platform web ringan berbahasa Indonesia untuk membantu developer pemula, mahasiswa, kampus, dan startup kecil mengecek risiko dependency open-source di project mereka.

Core flow:

```txt
Upload dependency file
→ Parse dependency
→ Scan OSV
→ Hitung risk score
→ Tampilkan explanation Bahasa Indonesia
→ Beri recommendation fix
→ Generate PDF report
```

## User Persona

### Persona 1 — Mahasiswa Developer

- Sedang membuat tugas, lomba, skripsi, atau project startup.
- Sering install package dari tutorial.
- Belum paham dependency security.
- Butuh penjelasan yang gampang.
- Butuh report untuk dosen/juri.

### Persona 2 — Developer Pemula Indonesia

- Bisa coding, tetapi belum security-aware.
- Sering bingung membaca CVE/advisory.
- Butuh penjelasan dari bahasa teknis ke bahasa manusia.
- Butuh rekomendasi fix yang jelas.

### Persona 3 — Startup Kecil

- Tim kecil.
- Deadline cepat.
- Belum punya AppSec engineer.
- Pakai banyak dependency open-source.
- Butuh audit awal yang ringan.
- Butuh bukti ke client/investor bahwa mereka peduli security.

### Persona 4 — Dosen / Mentor / Bootcamp

- Butuh tools edukasi.
- Ingin mahasiswa paham supply chain attack.
- Butuh contoh real-world.
- Butuh report yang bisa dinilai.

## Problem Statement

Developer pemula, mahasiswa, dan startup kecil sering menggunakan dependency open-source tanpa memahami risiko keamanan, sementara tools keamanan yang ada sering terlalu teknis, mahal, noisy, atau tidak memberi penjelasan yang mudah dipahami.

## Product Goals

- Membantu user mengetahui dependency mana yang berisiko.
- Membuat vulnerability data lebih mudah dipahami dalam Bahasa Indonesia.
- Memberi risk score yang visual dan demo-friendly.
- Memberi rekomendasi fix yang actionable.
- Menghasilkan PDF report untuk dosen, juri, mentor, atau stakeholder.
- Menjadi platform edukatif untuk supply chain security.

## MVP Scope

MVP harus menghasilkan demo production end-to-end yang stabil. Fokus pada scan file, bukan enterprise workflow.

### Must-have Features

- Landing page
- Upload `package.json`
- Upload `requirements.txt`
- File validation
- Dependency parser
- OSV API scan
- Risk score
- Risk category: Low / Medium / High / Critical
- Dependency detail table
- Explanation Bahasa Indonesia
- Recommendation fix
- Generate PDF report
- Demo sample vulnerable project

### Should-have Features

- Support `package-lock.json`
- Missing lockfile detection
- Suspicious package heuristic
- Before/after score
- Export report

### Nice-to-have Features

- Login
- Scan history
- Team workspace
- GitHub repo URL scan
- GitHub OAuth
- SBOM export
- GitHub Actions integration

### Out of Scope

- ML malware detector
- Full malware sandbox
- Desktop app
- VS Code extension
- Enterprise policy engine
- Auto pull request fix

## Main User Flow

1. User buka landing page.
2. User klik CTA “Scan Project”.
3. User masuk ke scan page.
4. User upload `package.json` atau `requirements.txt`.
5. Sistem validasi file.
6. Sistem parse dependency.
7. Sistem scan vulnerability via OSV API.
8. Sistem hitung risk score.
9. Sistem tampilkan dashboard.
10. User membaca detail dependency.
11. User melihat explanation dan rekomendasi fix.
12. User generate PDF report.
13. Optional: user upload sample safe file untuk melihat before/after score.

## User Journey Detail

### Empty State

User belum upload file.

Copy:

> Upload `package.json` atau `requirements.txt` untuk mulai scan dependency project kamu.

### Loading State

Sistem sedang scan.

Copy:

> Sedang membaca dependency dan mengecek vulnerability. Ini biasanya hanya butuh beberapa detik.

### Error State

File/API bermasalah.

Copy:

> File belum bisa diproses. Pastikan format file sesuai dan coba lagi.

### Result State

Dashboard menampilkan:

- Overall risk score
- Total dependency
- Vulnerable dependency
- Severity breakdown
- Dependency table
- Detail explanation
- Recommendation
- Export report button

### Before/After State

User melihat perbandingan:

- Before: High risk karena vulnerable dependency.
- After: Low/Medium risk setelah dependency diperbarui.
