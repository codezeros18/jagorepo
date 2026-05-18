# 05 — Task Execution Rules

Dokumen ini adalah aturan wajib untuk Claude Code, Codex, atau coding agent lain saat mengerjakan JagaRepo.

## Execution Rule

Gunakan pola:

```txt
CHECK → DECIDE → EXECUTE → VERIFY → REPORT
```

Agent tidak boleh asal rebuild.

## Sebelum Mengerjakan Task

Wajib:

- Baca `docs/00_PROJECT_CONTEXT.md`
- Baca `docs/04_SPRINT_TASK_PLANNING.md`
- Baca file task spesifik di `docs/tasks/`
- Cek file/folder/fungsi yang sudah ada
- Pahami dependency task
- Jangan rebuild jika fitur sudah ada dan berfungsi

## Selama Mengerjakan

Agent wajib:

- Kerjakan hanya scope task.
- Jangan menambah fitur di luar task.
- Jangan membuat dependency berat tanpa alasan.
- Jangan ubah arsitektur utama tanpa mencatat alasan.
- Jangan menyimpan secret di repo.
- Jangan membuat klaim security berlebihan di UI.
- Jangan membuat ML malware detector.
- Jangan membuat sandbox malware.
- Jangan membuat enterprise feature sebelum MVP selesai.
- Gunakan Bahasa Indonesia untuk user-facing copy.
- Pisahkan “known vulnerability” dan “suspicious signal”.
- Tampilkan confidence level jika membuat heuristic.

## Setelah Mengerjakan

Wajib:

- Jalankan test/build/lint jika tersedia.
- Jalankan acceptance criteria task.
- Update status task.
- Tulis report singkat berisi:
  - Files changed
  - What was built/fixed/improved
  - How to test
  - Blockers
  - Next suggested task

## Agent Task Execution Template

```md
# Agent Task Execution Report

Task ID:
Task name:

## CHECK
- Files checked:
- Existing implementation found:
- Current status:

## DECIDE
- Decision: IMPROVE / FIX / BUILD
- Reason:

## EXECUTE
- Changes made:

## VERIFY
- Acceptance criteria result:
- Commands run:
- Test result:

## REPORT
- Status:
- Files changed:
- Notes:
- Next task:
```

## Decision Rules

### Jika sudah ada dan berfungsi

- Jangan rebuild.
- Improve sesuai scope.
- Pastikan tidak merusak existing flow.
- Status: `🔧 improved` atau `✅ done` jika AC pass.

### Jika sudah ada tapi broken

- Fix minimal sesuai scope.
- Jangan rewrite total kecuali benar-benar diperlukan.
- Jelaskan alasan fix.
- Status: `🔧 improved` atau `✅ done` jika AC pass.

### Jika belum ada

- Build dari spec task.
- Ikuti architecture docs.
- Hindari overengineering.
- Status: `🆕 built` atau `✅ done` jika AC pass.

## Security Copywriting Rules

Boleh:

- “Package ini punya vulnerability yang diketahui.”
- “Versi ini sebaiknya diperbarui.”
- “Signal ini mencurigakan dan perlu dicek manual.”
- “Score adalah indikator awal, bukan jaminan mutlak.”

Tidak boleh:

- “Package ini pasti malware” jika hanya heuristic.
- “JagaRepo menjamin aplikasi aman 100%.”
- “Semua malicious package pasti terdeteksi.”
- “Project kamu pasti diretas.”

## Dependency Rules

Sebelum menambah package baru:

- Cek apakah kebutuhan bisa diselesaikan tanpa dependency.
- Pilih package yang populer dan maintained.
- Hindari package tidak jelas untuk core security flow.
- Catat alasan penambahan dependency.

## Git / Repo Hygiene

- Jangan commit `.env`.
- Jangan commit secret, token, credential.
- Jangan commit build artifact besar.
- Update `.env.example` jika ada env baru.
- Jaga folder docs tetap sinkron dengan implementasi.
