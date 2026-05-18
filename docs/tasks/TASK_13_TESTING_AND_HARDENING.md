# TASK_13 — Testing and Hardening

## Goal

Testing end-to-end dan hardening.

## Context

Task ini memastikan demo aman dari crash saat presentasi.

## Dependencies

TASK_04_FILE_UPLOAD_AND_VALIDATION, TASK_06_OSV_API_INTEGRATION, TASK_10_PDF_REPORT_GENERATOR

## Scope

- Test upload
- Test parser
- Test OSV success/fail
- Test dashboard
- Test PDF
- Test responsive
- Test build

## Out of Scope

- Jangan tambah fitur baru
- Jangan rewrite total
- Jangan skip fallback test

## CHECK

Sebelum mulai, cek:

- Testing checklist
- Error states
- Build/lint config
- Mock data

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Gunakan docs/08_TESTING_CHECKLIST.md sebagai acuan.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Demo flow aman
- [ ] Error handling jelas
- [ ] Build pass
- [ ] Mock fallback pass
- [ ] Tidak ada secret tercommit

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

Task ID: TASK_13
Task name: Testing and Hardening

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
