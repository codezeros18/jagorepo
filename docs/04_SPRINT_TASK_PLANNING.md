# 04 — Sprint Task Planning

Status awal semua task: `⬜ pending`.

## Sprint 0 — Documentation & Repo Audit

| Sprint | Task ID | Nama | Dependencies | Status |
|---|---|---|---|---|
| 0 | S0-T1 | Repo Audit & Gap Analysis | — | ✅ done |
| 0 | S0-T2 | Confirm Tech Stack & Folder Structure | S0-T1 | ✅ done |
| 0 | S0-T3 | Create Demo Production Roadmap | S0-T2 | ✅ done |

## Sprint 1 — Project Foundation

| Sprint | Task ID | Nama | Dependencies | Status |
|---|---|---|---|---|
| 1 | S1-T1 | Project Setup / Scaffolding | S0-T1 | ✅ done |
| 1 | S1-T2 | Frontend App Shell | S1-T1 | ✅ done |
| 1 | S1-T3 | Tailwind Theme & Design System | S1-T2 | ✅ done |
| 1 | S1-T4 | Backend API Skeleton | S1-T1 | ✅ done |
| 1 | S1-T5 | Environment Config | S1-T4 | ✅ done |

## Sprint 2 — Landing & Scan UI

| Sprint | Task ID | Nama | Dependencies | Status |
|---|---|---|---|---|
| 2 | S2-T1 | Landing Page | S1-T2, S1-T3 | ✅ done |
| 2 | S2-T2 | Scan Page Layout | S1-T2, S1-T3 | ✅ done |
| 2 | S2-T3 | Upload Component UI | S2-T2 | ✅ done |
| 2 | S2-T4 | Loading, Empty, Error States | S2-T2 | ✅ done |

## Sprint 3 — Parser & Scan Engine

| Sprint | Task ID | Nama | Dependencies | Status |
|---|---|---|---|---|
| 3 | S3-T1 | File Upload API | S1-T4, S2-T3 | ✅ done |
| 3 | S3-T2 | package.json Parser | S3-T1 | ✅ done |
| 3 | S3-T3 | requirements.txt Parser | S3-T1 | ✅ done |
| 3 | S3-T4 | package-lock.json Basic Support | S3-T2 | ✅ done |
| 3 | S3-T5 | Parser Validation & Error Handling | S3-T2, S3-T3 | ✅ done |

## Sprint 4 — OSV API & Risk Engine

| Sprint | Task ID | Nama | Dependencies | Status |
|---|---|---|---|---|
| 4 | S4-T1 | OSV API Integration | S3-T2, S3-T3 | ✅ done |
| 4 | S4-T2 | Vulnerability Normalization | S4-T1 | ✅ done |
| 4 | S4-T3 | Risk Scoring Engine | S4-T2 | ✅ done |
| 4 | S4-T4 | Severity Mapping | S4-T3 | ✅ done |
| 4 | S4-T5 | Recommendation Generator | S4-T3 | ✅ done |
| 4 | S4-T6 | Indonesian Explanation Templates | S4-T5 | ✅ done |

## Sprint 5 — Result Dashboard

| Sprint | Task ID | Nama | Dependencies | Status |
|---|---|---|---|---|
| 5 | S5-T1 | Result Summary Cards | S4-T3 | ✅ done |
| 5 | S5-T2 | Risk Score Visualization | S5-T1 | ✅ done |
| 5 | S5-T3 | Dependency Findings Table | S4-T2 | ✅ done |
| 5 | S5-T4 | Dependency Detail Panel | S5-T3 | ✅ done |
| 5 | S5-T5 | Recommendation UI | S4-T5, S5-T4 | ✅ done |
| 5 | S5-T6 | Before/After Demo State | S5-T1 | ✅ done |

## Sprint 6 — PDF Report & Demo Data

| Sprint | Task ID | Nama | Dependencies | Status |
|---|---|---|---|---|
| 6 | S6-T1 | PDF Report Template | S5-T1, S5-T3 | ✅ done |
| 6 | S6-T2 | PDF Report Generator API | S6-T1 | ✅ done |
| 6 | S6-T3 | Report Download UI | S6-T2 | ✅ done |
| 6 | S6-T4 | Demo Vulnerable package.json | S4-T1 | ✅ done |
| 6 | S6-T5 | Demo Safe package.json | S4-T1 | ✅ done |
| 6 | S6-T6 | Offline Mock Scan Result | S5-T1 | ✅ done |

## Sprint 7 — Testing, Polish, Deployment

| Sprint | Task ID | Nama | Dependencies | Status |
|---|---|---|---|---|
| 7 | S7-T1 | End-to-End Demo Test | Sprint 1-6 | ⬜ pending |
| 7 | S7-T2 | Responsive UI Polish | S2-T1, S5-T1 | ✅ done |
| 7 | S7-T3 | Error Handling Hardening | S3-T5, S4-T1 | ⬜ pending |
| 7 | S7-T4 | Deployment Config | S1-T5 | ⬜ pending |
| 7 | S7-T5 | Production Build Fixing | S7-T4 | ⬜ pending |
| 7 | S7-T6 | Final Demo Script & Submission Package | S7-T1 | ⬜ pending |


## Status Legend

| Status | Arti |
|---|---|
| ⬜ pending | Belum dikerjakan |
| 🆕 built | Baru dibuat dari nol |
| 🔧 improved | Sudah ada dan ditingkatkan |
| ✅ done | Selesai dan AC pass |
| ⚠️ blocked | Tertahan karena issue/dependency |

## Definition of Done

Task hanya boleh dianggap done jika:

- Scope task selesai.
- Acceptance criteria task pass.
- Tidak ada error build/lint/test yang relevan.
- Tidak ada secret tercommit.
- Tidak ada fitur di luar scope yang mengubah arsitektur tanpa alasan.
- Report task ditulis.
- Status sprint diupdate.

## How to Update Status

1. Buka file ini.
2. Cari task ID yang dikerjakan.
3. Update status dari `⬜ pending` ke:
   - `🆕 built` jika dibangun baru,
   - `🔧 improved` jika improve existing,
   - `✅ done` jika semua acceptance criteria pass,
   - `⚠️ blocked` jika ada blocker.
4. Tambahkan catatan ringkas di report task atau PR description.

## Rule Utama

Task **tidak boleh** dianggap done kalau acceptance criteria belum pass.

Jika sebagian selesai tetapi belum pass, gunakan status `⚠️ blocked` atau biarkan `⬜ pending` dengan catatan report.
