# TASK_05 — Dependency Parser

## Goal

Parse dependency dari file.

## Context

Parser adalah core engine sebelum scan vulnerability.

## Dependencies

TASK_04_FILE_UPLOAD_AND_VALIDATION

## Scope

- Parse dependencies dan devDependencies dari package.json
- Parse package-lock basic jika tersedia
- Parse requirements.txt
- Normalize package name/version
- Detect ecosystem npm / PyPI

## Out of Scope

- Jangan query OSV API dulu
- Jangan buat UI dashboard penuh
- Jangan generate PDF

## CHECK

Sebelum mulai, cek:

- Parser folder
- Types dependency
- Upload output
- Test fixtures

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Parser harus mengembalikan normalized dependency list. Jangan crash jika version kosong.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Bisa handle valid file
- [ ] Bisa handle invalid file
- [ ] Tidak crash jika version kosong
- [ ] Ecosystem npm/PyPI terdeteksi
- [ ] Output format konsisten

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

Task ID: TASK_05
Task name: Dependency Parser

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
