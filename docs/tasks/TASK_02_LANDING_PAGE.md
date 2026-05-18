# TASK_02 — Landing Page

## Goal

Buat landing page JagaRepo.

## Context

Landing page adalah pintu masuk demo. Juri harus paham problem dan solusi dalam 30 detik.

## Dependencies

TASK_01_PROJECT_SETUP

## Scope

- Hero
- Problem
- How it works
- Features
- Why JagaRepo
- CTA

## Out of Scope

- Jangan buat scan logic
- Jangan panggil OSV API
- Jangan buat dashboard detail

## CHECK

Sebelum mulai, cek:

- Homepage route
- Component landing
- Design tokens
- CTA route ke scan page

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Gunakan copywriting: “Cek dependency sebelum jadi celah.” Jelaskan supply chain attack dengan bahasa ringan dan jangan overclaim.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Landing page responsive
- [ ] CTA menuju scan page
- [ ] Juri bisa paham problem cepat
- [ ] Tidak ada klaim security berlebihan

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

Task ID: TASK_02
Task name: Landing Page

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
