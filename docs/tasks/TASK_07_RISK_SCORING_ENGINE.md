# TASK_07 — Risk Scoring Engine

## Goal

Membuat risk score.

## Context

Risk score membuat hasil scan mudah dipahami juri/user awam.

## Dependencies

TASK_06_OSV_API_INTEGRATION

## Scope

- Score 0–100
- Category Low / Medium / High / Critical
- Known vulnerability severity
- Missing lockfile signal
- Suspicious package heuristic basic
- Confidence level

## Out of Scope

- Jangan klaim heuristic sebagai malware pasti
- Jangan buat ML detector
- Jangan buat compliance engine

## CHECK

Sebelum mulai, cek:

- Risk engine folder
- Normalized vulnerability
- Project signals
- Scoring tests

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Formula awal: Critical +40, High +30, Medium +15, Low +5, Missing lockfile +10, Suspicious signal +15, Deprecated/no metadata +5 sampai +10.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Score konsisten
- [ ] Score tidak lebih dari 100
- [ ] Known vulnerability dibedakan dari suspicious heuristic
- [ ] Confidence level tersedia
- [ ] Kategori sesuai range

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

Task ID: TASK_07
Task name: Risk Scoring Engine

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
