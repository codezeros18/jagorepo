# TASK_10 — PDF Report Generator

## Goal

Generate PDF security report.

## Context

PDF report membuat demo terasa production-ready dan berguna untuk dosen/juri/stakeholder.

## Dependencies

TASK_08_RESULT_DASHBOARD, TASK_09_EXPLANATION_AND_RECOMMENDATION

## Scope

- Project name
- Scan date
- Risk score
- Risk category
- Total dependencies
- Findings table
- Explanation
- Recommendation
- Disclaimer

## Out of Scope

- Jangan buat report enterprise compliance
- Jangan require login
- Jangan simpan report ke cloud jika belum perlu

## CHECK

Sebelum mulai, cek:

- Report template
- PDF generation library
- Download endpoint/UI
- Mock data

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

PDF generator boleh server-side. Jika sulit, buat printable report page dulu lalu export.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] PDF bisa dibuat/download
- [ ] Layout rapi
- [ ] Cocok untuk dosen/juri/stakeholder
- [ ] Tidak crash jika data kosong
- [ ] Disclaimer tersedia

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

Task ID: TASK_10
Task name: PDF Report Generator

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
