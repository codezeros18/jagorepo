# TASK_01 — Project Setup

## Goal

Setup project foundation.

## Context

Task ini membangun fondasi agar fitur JagaRepo bisa dikembangkan rapi dan tidak campur aduk.

## Dependencies

TASK_00_REPO_AUDIT

## Scope

- Setup Next.js jika belum ada
- Setup Tailwind jika belum ada
- Setup backend Express/NestJS jika belum ada
- Setup scripts
- Setup env example
- Setup folder structure

## Out of Scope

- Jangan buat fitur scan dulu
- Jangan buat dashboard detail dulu
- Jangan integrasi OSV dulu
- Jangan generate PDF dulu

## CHECK

Sebelum mulai, cek:

- Existing package.json
- Folder app/src
- Tailwind config
- Backend folder
- README
- .env.example

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Jika repo sudah punya Next.js/backend, improve struktur dan scripts saja. Jika kosong, scaffold minimal.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Project bisa jalan local
- [ ] Tailwind aktif
- [ ] Backend skeleton tersedia atau keputusan API route tercatat
- [ ] Scripts dasar tersedia
- [ ] .env.example tersedia

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

Task ID: TASK_01
Task name: Project Setup

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
