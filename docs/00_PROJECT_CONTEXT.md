# 00 — Project Context

## Nama Project

**JagaRepo**

## Tagline

**Cek dependency sebelum jadi celah.**

## Masalah Utama

Supply chain attack pada dependency open-source.

Developer modern banyak memakai dependency seperti npm packages, PyPI packages, GitHub Actions, Docker image, dan starter template. Dependency mempercepat development, tetapi juga membawa risiko: jika package yang dipercaya vulnerable atau disusupi, project yang memakainya bisa ikut terdampak.

## Target User

- Mahasiswa developer
- Developer pemula Indonesia
- Startup kecil
- Dosen / mentor / bootcamp instructor

## Core Value

JagaRepo harus terasa:

- Berbahasa Indonesia
- Edukatif
- Ringan
- Mudah dipahami
- Bisa generate report
- Tidak overclaim
- Bukan enterprise security scanner

## Demo Narrative

Aplikasi modern terlihat aman dari luar. Tetapi di baliknya, ada banyak dependency pihak ketiga. Satu dependency vulnerable bisa menjadi celah. JagaRepo membantu user scan dependency, memahami risiko, mendapat rekomendasi fix, dan membuat security report.

## What

JagaRepo adalah web app ringan untuk mengecek risiko dependency open-source pada project developer.

Input awal:

- `package.json`
- `package-lock.json`
- `requirements.txt`

Output utama:

- Risk score
- Risk category
- Dependency findings
- Explanation Bahasa Indonesia
- Recommendation fix
- PDF security report

## Why

Supply chain attack semakin relevan karena developer makin bergantung pada open-source. Developer pemula, mahasiswa, dan startup kecil sering belum punya security engineer atau workflow audit dependency. JagaRepo membuat security check lebih mudah dipahami dan lebih dekat dengan real workflow developer Indonesia.

## How

1. User upload dependency file.
2. Sistem parse dependency.
3. Sistem scan vulnerability via OSV API.
4. Sistem menambahkan risk signal sederhana seperti missing lockfile atau suspicious heuristic.
5. Sistem menghitung risk score.
6. Sistem menjelaskan hasil dalam Bahasa Indonesia.
7. Sistem memberi rekomendasi fix.
8. Sistem generate PDF report.

## Positioning

JagaRepo **bukan** pengganti Snyk, Dependabot, Socket, OSV-Scanner, atau tools enterprise lain.

JagaRepo diposisikan sebagai:

> Platform edukatif, ringan, dan lokal untuk membantu developer Indonesia memahami supply chain security.

## Non-goals

Jangan membangun atau mengklaim hal berikut pada MVP:

- Tidak membuat ML malware detector.
- Tidak membuat full sandbox malware analysis.
- Tidak membuat VS Code extension.
- Tidak membuat enterprise compliance platform.
- Tidak membuat auto pull request fix.
- Tidak mengklaim bisa mendeteksi semua malicious package.
- Tidak mengklaim package sebagai malware pasti jika hanya berdasarkan heuristic.
- Tidak membuat fitur login/team jika mengganggu end-to-end demo utama.
- Tidak membuat sistem berat yang sulit dipakai di laptop biasa.

## Tone Produk

Gunakan bahasa yang manusiawi:

- “Package ini punya vulnerability yang diketahui.”
- “Versi ini sebaiknya diperbarui.”
- “Signal ini mencurigakan, tapi bukan bukti malware.”
- “Periksa sumber package sebelum digunakan.”

Hindari bahasa yang terlalu menakut-nakuti:

- “Package ini pasti malware.”
- “Project kamu pasti diretas.”
- “JagaRepo menjamin aplikasi aman 100%.”
