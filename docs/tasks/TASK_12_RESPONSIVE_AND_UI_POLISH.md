# TASK_12 — Responsive and UI Polish

## Goal

Polish UI untuk demo production.

## Context

UI polish membuat produk terlihat serius dan siap dipresentasikan.

## Dependencies

TASK_02_LANDING_PAGE, TASK_08_RESULT_DASHBOARD

## Scope

- Responsive mobile/desktop
- Visual hierarchy
- Loading animation
- Empty/error state polish
- CTA polish
- Dashboard polish

## Out of Scope

- Jangan tambah fitur baru besar
- Jangan ubah arsitektur
- Jangan refactor logic scanner kecuali bug UI

## CHECK

Sebelum mulai, cek:

- Landing page
- Scan page
- Dashboard
- Report preview

## DECIDE

Gunakan aturan:

- Jika sudah ada dan berfungsi → **IMPROVE** saja.
- Jika sudah ada tapi broken → **FIX**.
- Jika belum ada → **BUILD** dari spec task.

Catat alasan keputusan di report.

## Implementation Notes

Fokus pada readability, spacing, responsive table, dan screenshot-ready layout.

Tetap ikuti aturan global di `docs/05_TASK_EXECUTION_RULES.md`.

## Acceptance Criteria

- [ ] Tidak overflow
- [ ] Nyaman dilihat di laptop demo
- [ ] Screenshot-ready
- [ ] Mobile masih usable
- [ ] CTA jelas

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

Task ID: TASK_12
Task name: Responsive and UI Polish

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
