# TASK_14 — Deployment Preparation

## Goal

Siapkan deployment.

## Context

Deployment membuat juri bisa membuka demo lewat link.

## Dependencies

TASK_01_PROJECT_SETUP, TASK_13_TESTING_AND_HARDENING

## Scope

- Vercel frontend config
- Railway backend config
- Env example
- Build script
- CORS config
- Production API URL

## Out of Scope

- Jangan setup enterprise infra
- Jangan tambah monitoring kompleks
- Jangan deploy secret ke repo

## CHECK

Sebelum mulai, cek:

- Vercel config
- Railway config
- Env variables
- Build commands
- CORS settings

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Ikuti docs/09_DEPLOYMENT_GUIDE.md. Jika backend belum siap, gunakan MVP fallback.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] App bisa build
- [ ] Env tidak bocor
- [ ] Deployment guide jelas
- [ ] CORS production benar
- [ ] Production smoke test pass

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

Task ID: TASK_14
Task name: Deployment Preparation

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
