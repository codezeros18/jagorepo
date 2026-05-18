# TASK_06 — OSV API Integration

## Goal

Integrasi OSV API.

## Context

OSV menjadi sumber data vulnerability utama MVP.

## Dependencies

TASK_05_DEPENDENCY_PARSER

## Scope

- Query OSV untuk npm
- Query OSV untuk PyPI
- Batch query jika memungkinkan
- Timeout handling
- Error handling
- Mock fallback untuk demo

## Out of Scope

- Jangan membuat risk formula kompleks
- Jangan generate PDF
- Jangan membuat metadata scanner berat

## CHECK

Sebelum mulai, cek:

- OSV client
- Scanner service
- ParsedDependency type
- Mock data

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Buat wrapper OSV client agar mudah diganti. Timeout harus ditangani.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Package valid bisa dicek
- [ ] Jika API gagal UI tetap aman
- [ ] Tidak ada hardcoded secret
- [ ] Mock fallback tersedia
- [ ] Response vulnerability dinormalisasi

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

Task ID: TASK_06
Task name: OSV API Integration

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
