1# JagaRepo Documentation

Folder ini berisi dokumentasi kerja untuk Claude Code, Codex, atau agent coding lain yang akan mengeksekusi project JagaRepo secara bertahap.

Dokumentasi ini dibuat agar agent tidak asal rebuild, tidak keluar scope, dan bisa mengikuti sprint task planning dengan acceptance criteria yang jelas.

## Cara Membaca Dokumentasi

Sebelum mengerjakan task apa pun, baca urutan berikut:

1. [`00_PROJECT_CONTEXT.md`](00_PROJECT_CONTEXT.md)  
   Memahami arah produk, positioning, what/why/how, dan non-goals.

2. [`04_SPRINT_TASK_PLANNING.md`](04_SPRINT_TASK_PLANNING.md)  
   Melihat urutan sprint, dependency antar task, dan status progress.

3. [`05_TASK_EXECUTION_RULES.md`](05_TASK_EXECUTION_RULES.md)  
   Memahami aturan CHECK → DECIDE → VERIFY → REPORT.

4. File task spesifik di [`tasks/`](tasks/)  
   Misalnya kalau mengerjakan landing page, baca `tasks/TASK_02_LANDING_PAGE.md`.

5. [`06_ACCEPTANCE_CRITERIA.md`](06_ACCEPTANCE_CRITERIA.md)  
   Dipakai untuk validasi global.

## Aturan Wajib Agent

Agent wajib:

- Membaca `00_PROJECT_CONTEXT.md`, `04_SPRINT_TASK_PLANNING.md`, dan task file sebelum eksekusi.
- Cek dulu apakah fitur/file sudah ada.
- Jika sudah ada dan berfungsi, improve saja.
- Jika sudah ada tapi broken, fix.
- Jika belum ada, build sesuai spec.
- Tidak menambah fitur di luar scope task.
- Tidak membuat klaim security berlebihan.
- Tidak membuat ML malware detector.
- Tidak menyimpan secret di repo.
- Menjalankan verification command jika tersedia.
- Mengupdate report task setelah selesai.

## Navigasi Dokumen Utama

| File | Tujuan |
|---|---|
| [`00_PROJECT_CONTEXT.md`](00_PROJECT_CONTEXT.md) | Konteks produk dan non-goals |
| [`01_PRODUCT_REQUIREMENTS.md`](01_PRODUCT_REQUIREMENTS.md) | PRD dan scope MVP |
| [`02_TECHNICAL_ARCHITECTURE.md`](02_TECHNICAL_ARCHITECTURE.md) | Arsitektur teknis |
| [`03_DEMO_PRODUCTION_SCOPE.md`](03_DEMO_PRODUCTION_SCOPE.md) | Scope demo production |
| [`04_SPRINT_TASK_PLANNING.md`](04_SPRINT_TASK_PLANNING.md) | Sprint planning dan status |
| [`05_TASK_EXECUTION_RULES.md`](05_TASK_EXECUTION_RULES.md) | Aturan eksekusi agent |
| [`06_ACCEPTANCE_CRITERIA.md`](06_ACCEPTANCE_CRITERIA.md) | Acceptance criteria global |
| [`07_DEMO_SCRIPT.md`](07_DEMO_SCRIPT.md) | Script demo dan Q&A |
| [`08_TESTING_CHECKLIST.md`](08_TESTING_CHECKLIST.md) | Checklist testing |
| [`09_DEPLOYMENT_GUIDE.md`](09_DEPLOYMENT_GUIDE.md) | Panduan deployment |
| [`10_FINAL_SUBMISSION_CHECKLIST.md`](10_FINAL_SUBMISSION_CHECKLIST.md) | Checklist final submission |

## Navigasi Task

| Task | File |
|---|---|
| TASK 00 | [`tasks/TASK_00_REPO_AUDIT.md`](tasks/TASK_00_REPO_AUDIT.md) |
| TASK 01 | [`tasks/TASK_01_PROJECT_SETUP.md`](tasks/TASK_01_PROJECT_SETUP.md) |
| TASK 02 | [`tasks/TASK_02_LANDING_PAGE.md`](tasks/TASK_02_LANDING_PAGE.md) |
| TASK 03 | [`tasks/TASK_03_SCAN_PAGE_UI.md`](tasks/TASK_03_SCAN_PAGE_UI.md) |
| TASK 04 | [`tasks/TASK_04_FILE_UPLOAD_AND_VALIDATION.md`](tasks/TASK_04_FILE_UPLOAD_AND_VALIDATION.md) |
| TASK 05 | [`tasks/TASK_05_DEPENDENCY_PARSER.md`](tasks/TASK_05_DEPENDENCY_PARSER.md) |
| TASK 06 | [`tasks/TASK_06_OSV_API_INTEGRATION.md`](tasks/TASK_06_OSV_API_INTEGRATION.md) |
| TASK 07 | [`tasks/TASK_07_RISK_SCORING_ENGINE.md`](tasks/TASK_07_RISK_SCORING_ENGINE.md) |
| TASK 08 | [`tasks/TASK_08_RESULT_DASHBOARD.md`](tasks/TASK_08_RESULT_DASHBOARD.md) |
| TASK 09 | [`tasks/TASK_09_EXPLANATION_AND_RECOMMENDATION.md`](tasks/TASK_09_EXPLANATION_AND_RECOMMENDATION.md) |
| TASK 10 | [`tasks/TASK_10_PDF_REPORT_GENERATOR.md`](tasks/TASK_10_PDF_REPORT_GENERATOR.md) |
| TASK 11 | [`tasks/TASK_11_DEMO_SAMPLE_PROJECT.md`](tasks/TASK_11_DEMO_SAMPLE_PROJECT.md) |
| TASK 12 | [`tasks/TASK_12_RESPONSIVE_AND_UI_POLISH.md`](tasks/TASK_12_RESPONSIVE_AND_UI_POLISH.md) |
| TASK 13 | [`tasks/TASK_13_TESTING_AND_HARDENING.md`](tasks/TASK_13_TESTING_AND_HARDENING.md) |
| TASK 14 | [`tasks/TASK_14_DEPLOYMENT_PREPARATION.md`](tasks/TASK_14_DEPLOYMENT_PREPARATION.md) |
| TASK 15 | [`tasks/TASK_15_FINAL_DEMO_PACKAGE.md`](tasks/TASK_15_FINAL_DEMO_PACKAGE.md) |

## Prinsip Utama

Demo production JagaRepo harus punya alur:

```txt
Landing Page
→ Upload dependency file
→ Parse dependency
→ Scan OSV
→ Risk score
→ Explanation Bahasa Indonesia
→ Recommendation fix
→ PDF report
→ Demo before/after
```
