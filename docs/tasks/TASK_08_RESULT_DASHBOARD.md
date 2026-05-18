# TASK_08 — Result Dashboard

## Goal

Buat dashboard hasil scan.

## Context

Dashboard adalah bagian paling penting untuk demo visual.

## Dependencies

TASK_07_RISK_SCORING_ENGINE

## Scope

- Overall risk score
- Total dependencies
- Vulnerable dependencies
- Severity breakdown
- Dependency findings table
- Detail panel
- Empty/error states

## Out of Scope

- Jangan generate PDF dulu
- Jangan buat login/history
- Jangan ubah scoring formula tanpa alasan

## CHECK

Sebelum mulai, cek:

- Dashboard components
- Scan result type
- Mock result
- Routing results

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Dashboard harus bisa render dari real result dan mock result.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Dashboard terlihat demo-ready
- [ ] Informasi mudah dipahami
- [ ] Responsive
- [ ] Empty/error states aman
- [ ] Dependency detail bisa dibuka

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

Task ID: TASK_08
Task name: Result Dashboard

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
