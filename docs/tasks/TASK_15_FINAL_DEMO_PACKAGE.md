# TASK_15 — Final Demo Package

## Goal

Final package untuk demo/submission.

## Context

Task ini merapikan repo agar reviewer/juri bisa memahami project tanpa bertanya banyak.

## Dependencies

TASK_13_TESTING_AND_HARDENING, TASK_14_DEPLOYMENT_PREPARATION

## Scope

- Root README update
- Demo script final
- Submission checklist
- Screenshots placeholder
- Link deployment placeholder
- Known limitations
- Future improvement

## Out of Scope

- Jangan tambah fitur baru
- Jangan ubah core flow
- Jangan menghapus docs penting

## CHECK

Sebelum mulai, cek:

- Root README
- docs/07_DEMO_SCRIPT.md
- docs/10_FINAL_SUBMISSION_CHECKLIST.md
- Screenshots folder

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Pastikan repo bisa diikuti orang lain dari README.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Repo rapi
- [ ] Demo bisa diikuti orang lain
- [ ] Juri bisa memahami project dari README
- [ ] Known limitations jujur
- [ ] Link deployment placeholder/real tersedia

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

Task ID: TASK_15
Task name: Final Demo Package

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
