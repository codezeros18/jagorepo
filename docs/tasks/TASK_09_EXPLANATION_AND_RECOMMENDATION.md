# TASK_09 — Explanation and Recommendation

## Goal

Buat explanation dan rekomendasi Bahasa Indonesia.

## Context

Pembeda utama JagaRepo adalah menerjemahkan risiko teknis menjadi bahasa manusia.

## Dependencies

TASK_07_RISK_SCORING_ENGINE, TASK_08_RESULT_DASHBOARD

## Scope

- Template explanation untuk vulnerability
- Template explanation untuk suspicious signal
- Recommendation update version
- Recommendation remove package
- Recommendation verify package source
- Recommendation add lockfile
- Recommendation enable Dependabot

## Out of Scope

- Jangan pakai AI wajib jika belum perlu
- Jangan overclaim sebagai malware pasti
- Jangan membuat chatbot dulu

## CHECK

Sebelum mulai, cek:

- Explanation generator
- Recommendation generator
- Dashboard detail panel

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Gunakan template deterministic dulu. AI boleh optional di masa depan.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Bahasa manusiawi
- [ ] Actionable
- [ ] Tidak menakut-nakuti berlebihan
- [ ] Known vuln dan suspicious signal dijelaskan berbeda
- [ ] Rekomendasi muncul di UI

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

Task ID: TASK_09
Task name: Explanation and Recommendation

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
