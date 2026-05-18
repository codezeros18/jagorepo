const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

import type { UploadScanResponse } from "@/types/scan";
export type { UploadScanResponse };

export type ApiErrorResponse = {
  error: string;
  code?: string;
};

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function parseError(res: Response): Promise<ApiError> {
  let body: ApiErrorResponse = { error: "Terjadi kesalahan yang tidak diketahui." };
  try {
    body = await res.json();
  } catch {
    // response body bukan JSON
  }
  return new ApiError(body.error, body.code ?? "UNKNOWN", res.status);
}

// ─── Upload & validate file ───────────────────────────────────────────────────

/**
 * Upload file ke backend untuk divalidasi.
 * Backend melakukan deep validation (nama, ukuran, konten).
 * Throws ApiError jika file ditolak.
 */
export async function uploadFile(file: File): Promise<UploadScanResponse> {
  const formData = new FormData();
  formData.append("file", file, file.name);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/scan`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiError(
      "Tidak bisa terhubung ke server. Pastikan server berjalan atau gunakan mode demo.",
      "NETWORK_ERROR",
      0
    );
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  return res.json() as Promise<UploadScanResponse>;
}

// ─── Get scan result ──────────────────────────────────────────────────────────

export async function getScanResult(scanId: string) {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/scan/${scanId}`);
  } catch {
    throw new ApiError("Tidak bisa terhubung ke server.", "NETWORK_ERROR", 0);
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  return res.json();
}

// ─── Generate PDF report ──────────────────────────────────────────────────────

export async function generateReport(data: UploadScanResponse): Promise<Blob> {
  let res: Response;
  try {
    // Uses Next.js API route — works on Vercel without a separate Express server
    res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    throw new ApiError("Tidak bisa terhubung ke server.", "NETWORK_ERROR", 0);
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  return res.blob();
}

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
