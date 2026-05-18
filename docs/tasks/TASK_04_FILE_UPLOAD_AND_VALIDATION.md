# TASK_04 — File Upload and Validation

## Goal

Implement upload dan validasi file.

## Context

Validasi file penting agar parser dan scanner tidak crash.

## Dependencies

TASK_03_SCAN_PAGE_UI

## Scope

- Support package.json
- Support package-lock.json
- Support requirements.txt
- Reject file kosong
- Reject file type tidak sesuai
- Size limit masuk akal
- Error message Bahasa Indonesia

## Out of Scope

- Jangan scan OSV dulu
- Jangan hitung risk score
- Jangan generate report

## CHECK

Sebelum mulai, cek:

- Upload component
- Backend upload endpoint jika ada
- Validation util
- Error UI

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Validasi boleh client-side dan server-side. Error message harus manusiawi.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] File valid diterima
- [ ] File kosong ditolak
- [ ] File type invalid ditolak
- [ ] Size limit berjalan
- [ ] Error Bahasa Indonesia muncul

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

Task ID: TASK_04
Task name: File Upload and Validation

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
