# TASK_03 — Scan Page UI

## Goal

Buat halaman scan project.

## Context

Scan page adalah titik awal flow utama demo.

## Dependencies

TASK_02_LANDING_PAGE

## Scope

- Upload area
- Supported files info
- Scan button
- Empty state
- Loading state
- Error state
- Result placeholder

## Out of Scope

- Jangan implement parser dulu
- Jangan scan OSV dulu
- Jangan generate PDF dulu

## CHECK

Sebelum mulai, cek:

- Route scan page
- Upload component existing
- State management existing
- UI components

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Bangun UI dulu dengan mock handler. Pastikan component siap menerima file dari upload component.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] UI jelas
- [ ] Responsive
- [ ] Bisa menerima file dari component
- [ ] State empty/loading/error/result placeholder tersedia

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

Task ID: TASK_03
Task name: Scan Page UI

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
