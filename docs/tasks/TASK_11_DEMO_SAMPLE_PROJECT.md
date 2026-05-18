# TASK_11 — Demo Sample Project

## Goal

Siapkan demo data.

## Context

Demo data membuat flow tetap stabil walau API gagal.

## Dependencies

TASK_06_OSV_API_INTEGRATION

## Scope

- Buat sample vulnerable package.json
- Buat sample safe package.json
- Buat mock scan result high risk
- Buat mock scan result low risk
- Buat README demo data

## Out of Scope

- Jangan menggunakan malware nyata
- Jangan membuat script berbahaya
- Jangan menambahkan dependency real yang mencurigakan untuk dieksekusi

## CHECK

Sebelum mulai, cek:

- demo/ folder
- Mock result schema
- Dashboard compatibility

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Gunakan file sample sebagai input demo. Mock result harus mengikuti format scan result asli.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Demo tetap jalan walau API gagal
- [ ] Bisa menunjukkan before/after score
- [ ] Tidak menggunakan malware nyata
- [ ] README demo data jelas

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

Task ID: TASK_11
Task name: Demo Sample Project

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
