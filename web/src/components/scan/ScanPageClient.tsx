"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UploadArea } from "./UploadArea";
import { ScanLoadingState } from "./ScanLoadingState";
import { ScanErrorState } from "./ScanErrorState";
import { ScanResultDashboard } from "./ScanResultPlaceholder";
import { uploadFile, ApiError } from "@/lib/api-client";
import type { ScanStatus, UploadScanResponse, RiskCategory } from "@/types/scan";

// ── Demo mode ─────────────────────────────────────────────────────────────────

const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// High-risk mock — synced with demo/mock-scan-high-risk.json
const DEMO_SCAN_HIGH: UploadScanResponse = {
  accepted: true,
  fileName: "vulnerable-package.json",
  ecosystem: "npm",
  fileSize: 512,
  hasLockfile: true,
  warnings: [],
  scan: {
    scanId: "demo-high-risk-2026",
    scannedAt: "2026-05-18T10:00:00.000Z",
    sourceFile: "vulnerable-package.json",
    totalDependencies: 8,
    vulnerableDependencies: 3,
    overallRiskScore: 82,
    overallRiskCategory: "Critical" as RiskCategory,
    usedMock: true,
    findings: [
      {
        packageName: "lodash",
        version: "4.17.20",
        ecosystem: "npm",
        riskScore: 100,
        riskCategory: "Critical" as RiskCategory,
        confidence: "High",
        reasons: [
          "Ditemukan 2 kerentanan High (tinggi) dari database OSV. Kerentanan High berpotensi menyebabkan kebocoran data, bypass autentikasi, atau eksekusi kode tidak sah jika berhasil dieksploitasi.",
          "Proyek ini tidak memiliki lockfile (package-lock.json / yarn.lock). Tanpa lockfile, versi dependency tidak terkunci dan bisa berubah sewaktu-waktu saat install.",
        ],
        vulnerabilities: [
          {
            id: "GHSA-jf85-cpcp-j695",
            summary: "Prototype Pollution in lodash — attacker dapat memodifikasi Object.prototype melalui fungsi merge atau set.",
            severity: "HIGH",
            publishedAt: "2020-08-03T00:00:00Z",
            url: "https://github.com/advisories/GHSA-jf85-cpcp-j695",
          },
          {
            id: "GHSA-29mw-wpgm-hmr9",
            summary: "ReDoS vulnerability in lodash — ekspresi regex tidak aman dapat menyebabkan CPU spike (Denial of Service).",
            severity: "HIGH",
            publishedAt: "2021-01-06T00:00:00Z",
            url: "https://github.com/advisories/GHSA-29mw-wpgm-hmr9",
          },
        ],
        recommendation: "Segera perbarui \"lodash\" ke versi terbaru yang sudah dipatch. Jalankan: `npm update lodash`, lalu cek CHANGELOG atau GitHub Advisory untuk memastikan versi baru menutupi kerentanan ini. Jika belum ada patch yang tersedia, pertimbangkan untuk menonaktifkan fitur yang bergantung pada package ini sementara menunggu pembaruan.",
        explanationId: "finding-critical",
      },
      {
        packageName: "axios",
        version: "0.21.1",
        ecosystem: "npm",
        riskScore: 60,
        riskCategory: "High" as RiskCategory,
        confidence: "High",
        reasons: [
          "Ditemukan satu kerentanan High (tinggi) dari database OSV. Kerentanan High berpotensi menyebabkan kebocoran data, bypass autentikasi, atau eksekusi kode tidak sah jika berhasil dieksploitasi.",
          "Ditemukan satu kerentanan Medium (sedang) dari database OSV. Kerentanan Medium perlu ditangani — bisa dieksploitasi dalam kondisi tertentu dan berisiko eskalasi jika dikombinasikan dengan kerentanan lain.",
        ],
        vulnerabilities: [
          {
            id: "GHSA-wf5p-g6vw-rhxx",
            summary: "axios Cross-Site Request Forgery (CSRF) — versi ini rentan terhadap CSRF attack yang memungkinkan penyerang mengirim request atas nama pengguna.",
            severity: "HIGH",
            publishedAt: "2023-11-08T00:00:00Z",
            url: "https://github.com/advisories/GHSA-wf5p-g6vw-rhxx",
          },
          {
            id: "GHSA-cxjh-pqwp-8mfp",
            summary: "follow-redirects URL Redirect — axios bergantung pada library ini yang memiliki vulnerability redirect yang dapat membocorkan authorization header.",
            severity: "MEDIUM",
            publishedAt: "2023-02-16T00:00:00Z",
            url: "https://github.com/advisories/GHSA-cxjh-pqwp-8mfp",
          },
        ],
        recommendation: "Perbarui \"axios\" sesegera mungkin. Jalankan: `npm update axios` dan pastikan versi baru sudah mencakup perbaikan keamanan yang relevan. Aktifkan Dependabot atau Renovate Bot di repositori kamu agar pembaruan keamanan terdeteksi otomatis.",
        explanationId: "finding-high",
      },
      {
        packageName: "minimist",
        version: "1.2.5",
        ecosystem: "npm",
        riskScore: 15,
        riskCategory: "Medium" as RiskCategory,
        confidence: "High",
        reasons: [
          "Ditemukan satu kerentanan Medium (sedang) dari database OSV. Kerentanan Medium perlu ditangani — bisa dieksploitasi dalam kondisi tertentu dan berisiko eskalasi jika dikombinasikan dengan kerentanan lain.",
        ],
        vulnerabilities: [
          {
            id: "GHSA-vh95-rmgr-6w4m",
            summary: "Prototype Pollution in minimist — memungkinkan attacker memodifikasi properti objek built-in melalui argumen yang dibuat khusus.",
            severity: "MEDIUM",
            publishedAt: "2020-03-11T00:00:00Z",
            url: "https://github.com/advisories/GHSA-vh95-rmgr-6w4m",
          },
        ],
        recommendation: "Jadwalkan pembaruan \"minimist\" dalam siklus deployment berikutnya. Jalankan: `npm update minimist` dan uji fungsionalitas setelah update. Aktifkan Dependabot di GitHub (Settings → Security → Dependabot alerts) untuk pemantauan berkelanjutan.",
        explanationId: "finding-medium",
      },
      {
        packageName: "express",
        version: "4.18.2",
        ecosystem: "npm",
        riskScore: 0,
        riskCategory: "Low" as RiskCategory,
        confidence: "Medium",
        reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."],
        vulnerabilities: [],
        recommendation: "Package \"express\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.",
        explanationId: "finding-low",
      },
      {
        packageName: "react",
        version: "18.2.0",
        ecosystem: "npm",
        riskScore: 0,
        riskCategory: "Low" as RiskCategory,
        confidence: "Medium",
        reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."],
        vulnerabilities: [],
        recommendation: "Package \"react\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.",
        explanationId: "finding-low",
      },
      {
        packageName: "dotenv",
        version: "16.0.0",
        ecosystem: "npm",
        riskScore: 0,
        riskCategory: "Low" as RiskCategory,
        confidence: "Medium",
        reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."],
        vulnerabilities: [],
        recommendation: "Package \"dotenv\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.",
        explanationId: "finding-low",
      },
      {
        packageName: "typescript",
        version: "5.0.0",
        ecosystem: "npm",
        riskScore: 0,
        riskCategory: "Low" as RiskCategory,
        confidence: "Medium",
        reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."],
        vulnerabilities: [],
        recommendation: "Package \"typescript\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.",
        explanationId: "finding-low",
      },
      {
        packageName: "nodemon",
        version: "3.0.0",
        ecosystem: "npm",
        riskScore: 0,
        riskCategory: "Low" as RiskCategory,
        confidence: "Medium",
        reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."],
        vulnerabilities: [],
        recommendation: "Package \"nodemon\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.",
        explanationId: "finding-low",
      },
    ],
  },
  message: "vulnerable-package.json berhasil di-scan (data demo). 8 dependency diperiksa, 3 memiliki vulnerability yang diketahui. Risk: Critical.",
};

// Low-risk mock — synced with demo/mock-scan-low-risk.json
const DEMO_SCAN_LOW: UploadScanResponse = {
  accepted: true,
  fileName: "safe-package.json",
  ecosystem: "npm",
  fileSize: 498,
  hasLockfile: true,
  warnings: [],
  scan: {
    scanId: "demo-low-risk-2026",
    scannedAt: "2026-05-18T10:05:00.000Z",
    sourceFile: "safe-package.json",
    totalDependencies: 8,
    vulnerableDependencies: 0,
    overallRiskScore: 0,
    overallRiskCategory: "Low" as RiskCategory,
    usedMock: true,
    findings: [
      { packageName: "lodash",     version: "4.17.21", ecosystem: "npm", riskScore: 0, riskCategory: "Low" as RiskCategory, confidence: "Medium", reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."], vulnerabilities: [], recommendation: "Package \"lodash\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.", explanationId: "finding-low" },
      { packageName: "axios",      version: "1.7.2",   ecosystem: "npm", riskScore: 0, riskCategory: "Low" as RiskCategory, confidence: "Medium", reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."], vulnerabilities: [], recommendation: "Package \"axios\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.", explanationId: "finding-low" },
      { packageName: "minimist",   version: "1.2.8",   ecosystem: "npm", riskScore: 0, riskCategory: "Low" as RiskCategory, confidence: "Medium", reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."], vulnerabilities: [], recommendation: "Package \"minimist\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.", explanationId: "finding-low" },
      { packageName: "express",    version: "4.19.2",  ecosystem: "npm", riskScore: 0, riskCategory: "Low" as RiskCategory, confidence: "Medium", reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."], vulnerabilities: [], recommendation: "Package \"express\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.", explanationId: "finding-low" },
      { packageName: "react",      version: "18.3.1",  ecosystem: "npm", riskScore: 0, riskCategory: "Low" as RiskCategory, confidence: "Medium", reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."], vulnerabilities: [], recommendation: "Package \"react\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.", explanationId: "finding-low" },
      { packageName: "dotenv",     version: "16.4.5",  ecosystem: "npm", riskScore: 0, riskCategory: "Low" as RiskCategory, confidence: "Medium", reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."], vulnerabilities: [], recommendation: "Package \"dotenv\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.", explanationId: "finding-low" },
      { packageName: "typescript", version: "5.5.2",   ecosystem: "npm", riskScore: 0, riskCategory: "Low" as RiskCategory, confidence: "Medium", reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."], vulnerabilities: [], recommendation: "Package \"typescript\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.", explanationId: "finding-low" },
      { packageName: "nodemon",    version: "3.1.4",   ecosystem: "npm", riskScore: 0, riskCategory: "Low" as RiskCategory, confidence: "Medium", reasons: ["Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. Package ini tampak aman berdasarkan data yang tersedia saat ini."], vulnerabilities: [], recommendation: "Package \"nodemon\" tidak memiliki vulnerability yang diketahui pada versi ini. Tetap pantau pembaruan secara berkala.", explanationId: "finding-low" },
    ],
  },
  message: "safe-package.json berhasil di-scan (data demo). 8 dependency diperiksa, tidak ada vulnerability yang diketahui.",
};

// ── Scan step animation ────────────────────────────────────────────────────────

const SCAN_STEP_COUNT = 5;
const STEP_DELAY_MS = [600, 900, 1300, 700, 500];

// ── Component ─────────────────────────────────────────────────────────────────

export function ScanPageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [scanData, setScanData] = useState<UploadScanResponse | null>(null);
  const [demoScenario, setDemoScenario] = useState<"high" | "low">("high");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const runScanSteps = useCallback((startStep = 1) => {
    let step = startStep;
    const advance = () => {
      if (step < SCAN_STEP_COUNT) {
        setCurrentStep(step);
        timerRef.current = setTimeout(advance, STEP_DELAY_MS[step]);
        step += 1;
      } else {
        setStatus("done");
      }
    };
    timerRef.current = setTimeout(advance, STEP_DELAY_MS[startStep]);
  }, []);

  const handleFileSelect = useCallback((f: File) => {
    setFile(f);
    setStatus("idle");
    setErrorMessage("");
  }, []);

  const handleFileRemove = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setErrorMessage("");
    setScanData(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleStartScan = useCallback(async () => {
    if (!file) return;

    setStatus("uploading");
    setCurrentStep(0);
    setErrorMessage("");
    setScanData(null);

    if (IS_DEMO_MODE) {
      setScanData({ ...DEMO_SCAN_HIGH, fileName: file.name });
      setDemoScenario("high");
      setStatus("scanning");
      runScanSteps(0);
      return;
    }

    // Check JSON files for demo/pre-computed content
    if (file.name.toLowerCase().endsWith(".json")) {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as Record<string, unknown>;

        // Pre-computed scan result (e.g. mock-scan-*.json) — load directly
        const scan = parsed?.scan as Record<string, unknown> | undefined;
        if (Array.isArray(scan?.findings)) {
          setScanData(parsed as unknown as UploadScanResponse);
          const riskScore = (scan as { overallRiskScore?: number }).overallRiskScore ?? 0;
          setDemoScenario(riskScore > 0 ? "high" : "low");
          setStatus("scanning");
          runScanSteps(0);
          return;
        }

        // Known demo dependency files — bypass OSV API to keep demo results stable
        const projectName = (parsed as { name?: string }).name;
        if (projectName === "demo-safe-project") {
          setScanData({ ...DEMO_SCAN_LOW, fileName: file.name });
          setDemoScenario("low");
          setStatus("scanning");
          runScanSteps(0);
          return;
        }
        if (projectName === "demo-vulnerable-project") {
          setScanData({ ...DEMO_SCAN_HIGH, fileName: file.name });
          setDemoScenario("high");
          setStatus("scanning");
          runScanSteps(0);
          return;
        }
      } catch {
        // Not a recognizable JSON — proceed with normal upload
      }
    }

    // Real mode: call backend — single POST returns parse + OSV + risk all at once
    let result: UploadScanResponse;
    try {
      result = await uploadFile(file);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "File belum bisa diproses. Pastikan format file sesuai dan coba lagi.";
      setErrorMessage(msg);
      setStatus("error");
      return;
    }

    // Guard: backend must return a scan with findings
    if (!result?.scan?.findings) {
      setErrorMessage("Server mengembalikan data yang tidak lengkap. Gunakan data demo atau coba lagi.");
      setStatus("error");
      return;
    }

    // Store result first, then animate remaining steps
    setScanData(result);
    setStatus("scanning");
    setCurrentStep(1);
    runScanSteps(1);
  }, [file, runScanSteps]);

  const handleRetry = useCallback(() => {
    setStatus("idle");
    setErrorMessage("");
    setCurrentStep(0);
    setScanData(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleScanAnother = useCallback(() => {
    setFile(null);
    setStatus("idle");
    setErrorMessage("");
    setCurrentStep(0);
    setScanData(null);
    setDemoScenario("high");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Fallback: load mock high-risk result when backend/OSV is unavailable
  const handleLoadMockResult = useCallback(() => {
    setScanData({ ...DEMO_SCAN_HIGH, fileName: file?.name ?? DEMO_SCAN_HIGH.fileName });
    setDemoScenario("high");
    setStatus("done");
    setErrorMessage("");
  }, [file]);

  // Switch between before/after mock scenarios without re-scanning
  const handleDemoScenarioSwitch = useCallback((scenario: "high" | "low") => {
    setScanData(scenario === "high" ? DEMO_SCAN_HIGH : DEMO_SCAN_LOW);
    setDemoScenario(scenario);
  }, []);

  const isScanning = status === "scanning" || status === "uploading";
  const isDone = status === "done" && scanData !== null;
  const isMockResult = isDone && (scanData?.scan?.usedMock === true);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Page header */}
      <div className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <nav className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              JagaRepo
            </Link>
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
            <span className="font-medium text-zinc-300">Scan Project</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Scan Dependency
              </h1>
              <p className="mt-1 text-sm text-zinc-400">
                Upload file dependency project kamu dan temukan vulnerability
                yang perlu diperhatikan.
              </p>
            </div>
            {IS_DEMO_MODE && (
              <span className="shrink-0 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-400">
                Mode Demo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main content — wider when showing dashboard */}
      <div
        className={`mx-auto px-6 py-8 ${
          isDone ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {/* State: idle */}
        {status === "idle" && (
          <div className="space-y-6">
            <UploadArea
              file={file}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              disabled={false}
            />

            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleStartScan}
                disabled={!file}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all",
                  file
                    ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-500 hover:shadow-lg"
                    : "cursor-not-allowed bg-zinc-800 text-zinc-600",
                ].join(" ")}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                {file ? "Mulai Scan" : "Pilih file untuk mulai"}
              </button>

              {!file && (
                <p className="text-sm text-zinc-500">
                  Upload{" "}
                  <code className="font-mono text-xs">package.json</code>,{" "}
                  <code className="font-mono text-xs">package-lock.json</code>, atau{" "}
                  <code className="font-mono text-xs">requirements.txt</code>{" "}
                  terlebih dahulu.
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Belum punya file?</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Coba langsung dengan data demo — lihat hasil scan tanpa perlu upload file.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadMockResult}
                className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:border-zinc-600"
              >
                <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653z" />
                </svg>
                Coba Demo
              </button>
            </div>
          </div>
        )}

        {/* State: uploading / scanning */}
        {isScanning && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
            <ScanLoadingState
              currentStep={currentStep}
              fileName={file?.name}
            />
          </div>
        )}

        {/* State: error */}
        {status === "error" && (
          <div className="rounded-2xl border border-red-900/30 bg-zinc-900 p-8">
            <ScanErrorState
              message={
                errorMessage ||
                "File belum bisa diproses. Pastikan format file sesuai dan coba lagi."
              }
              onRetry={handleRetry}
              onLoadMockResult={handleLoadMockResult}
            />
          </div>
        )}

        {/* State: done — show real dashboard */}
        {isDone && (
          <>
            {/* Before/After toggle bar — only shown for mock data */}
            {isMockResult && (
              <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-3">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Demo Before / After</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Bandingkan skenario berisiko dan skenario aman.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoScenarioSwitch("high")}
                    className={[
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      demoScenario === "high"
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700",
                    ].join(" ")}
                  >
                    Sebelum — Berisiko
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoScenarioSwitch("low")}
                    className={[
                      "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                      demoScenario === "low"
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700",
                    ].join(" ")}
                  >
                    Sesudah — Aman
                  </button>
                </div>
              </div>
            )}

            <ScanResultDashboard
              data={scanData}
              onScanAnother={handleScanAnother}
            />
          </>
        )}
      </div>
    </div>
  );
}
