# TASK_00 — Repo Audit

## Goal

Audit repo yang ada sebelum coding.

## Context

Task ini mencegah agent asal rebuild. Agent harus memahami kondisi repo dulu sebelum setup atau implementasi fitur.

## Dependencies

—

## Scope

- Cek struktur folder
- Cek package manager
- Cek framework
- Cek apakah frontend/backend sudah ada
- Cek file env
- Cek docs
- Buat gap report

## Out of Scope

- Jangan install dependency baru
- Jangan setup ulang project
- Jangan membuat fitur aplikasi

## CHECK

Sebelum mulai, cek:

- Root folder
- package.json / pnpm-lock / yarn.lock / package-lock
- src/ atau app/
- server/ atau api/
- docs/
- README.md
- .env / .env.example

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Buat gap report berisi daftar file/folder penting, rekomendasi struktur, risiko repo, dan next task.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Daftar file/folder penting tercatat
- [ ] Package manager teridentifikasi
- [ ] Framework teridentifikasi
- [ ] Existing frontend/backend tercatat
- [ ] Docs existing tercatat
- [ ] Next task direkomendasikan

## Verification Commands

Jalankan command yang relevan dengan kondisi repo:

```bash
npm run lint
npm run build
npm run dev
npm test
```

Jika command belum tersedia, catat sebagai blocker atau tambahkan script dasar pada task setup.

## Report Template

```md
# Agent Task Execution Report

Task ID: TASK_00
Task name: Repo Audit

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
