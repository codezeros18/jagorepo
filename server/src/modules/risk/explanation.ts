import type { NormalizedVulnerability, Ecosystem } from "../../types/index.js";
import type { OsvScanEntry } from "../scanner/osv.scanner.js";
import type { SuspiciousSignal } from "./suspicious.heuristic.js";

// ── Severity label helpers ────────────────────────────────────────────────────

export function sevLabel(sev: string): string {
  switch (sev.toUpperCase()) {
    case "CRITICAL": return "Critical";
    case "HIGH":     return "High (tinggi)";
    case "MEDIUM":   return "Medium (sedang)";
    case "LOW":      return "Low (rendah)";
    default:         return "dengan tingkat keparahan tidak diketahui";
  }
}

function sevContextSentence(sev: string, count: number): string {
  const n = count === 1 ? "satu kerentanan" : `${count} kerentanan`;
  switch (sev.toUpperCase()) {
    case "CRITICAL":
      return (
        `Ditemukan ${n} Critical dari database OSV. ` +
        "Kerentanan Critical dapat memungkinkan penyerang mengeksekusi kode secara remote, " +
        "mengakses data sensitif, atau mengambil alih sistem tanpa autentikasi."
      );
    case "HIGH":
      return (
        `Ditemukan ${n} High (tinggi) dari database OSV. ` +
        "Kerentanan High berpotensi menyebabkan kebocoran data, bypass autentikasi, " +
        "atau eksekusi kode tidak sah jika berhasil dieksploitasi."
      );
    case "MEDIUM":
      return (
        `Ditemukan ${n} Medium (sedang) dari database OSV. ` +
        "Kerentanan Medium perlu ditangani — bisa dieksploitasi dalam kondisi tertentu " +
        "dan berisiko eskalasi jika dikombinasikan dengan kerentanan lain."
      );
    case "LOW":
      return (
        `Ditemukan ${n} Low (rendah) dari database OSV. ` +
        "Dampaknya terbatas, namun tetap disarankan untuk memperbarui agar kode tetap bersih."
      );
    default:
      return (
        `Ditemukan ${n} dengan tingkat keparahan tidak diketahui dari database OSV. ` +
        "Periksa advisory secara manual untuk memahami dampaknya."
      );
  }
}

// ── Reason builder ────────────────────────────────────────────────────────────

export function buildReasons(
  entry: OsvScanEntry,
  suspicious: SuspiciousSignal[],
  hasLockfile: boolean
): string[] {
  const reasons: string[] = [];

  if (entry.vulnerabilities.length > 0) {
    // Group by severity, highest first
    const order = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "UNKNOWN"];
    const counts: Record<string, number> = {};
    for (const v of entry.vulnerabilities) {
      const sev = v.severity?.toUpperCase() ?? "UNKNOWN";
      counts[sev] = (counts[sev] ?? 0) + 1;
    }
    for (const sev of order) {
      if (counts[sev]) {
        reasons.push(sevContextSentence(sev, counts[sev]));
      }
    }
  }

  if (entry.skipped) {
    reasons.push(
      "Versi package tidak tercantum secara eksplisit — pemeriksaan OSV tidak dapat dilakukan. " +
      "Tanpa versi yang jelas, tidak bisa dipastikan apakah package ini aman atau tidak."
    );
    if (!hasLockfile) {
      reasons.push(
        "Proyek ini tidak memiliki lockfile (package-lock.json / yarn.lock / requirements.lock). " +
        "Tanpa lockfile, versi dependency tidak terkunci dan bisa berubah sewaktu-waktu saat install."
      );
    }
  }

  // Heuristic signals — always clearly labeled, never claimed as proof of malice
  for (const s of suspicious) {
    reasons.push(`[Signal heuristik] ${s.message}`);
  }

  if (reasons.length === 0) {
    reasons.push(
      "Tidak ada vulnerability yang ditemukan di database OSV untuk versi ini. " +
      "Package ini tampak aman berdasarkan data yang tersedia saat ini."
    );
  }

  return reasons;
}

// ── Update command helpers ────────────────────────────────────────────────────

function updateCommand(packageName: string, ecosystem: Ecosystem | string): string {
  const eco = (ecosystem ?? "npm").toLowerCase();
  if (eco === "pypi") {
    return `pip install --upgrade ${packageName}`;
  }
  // npm / node / default
  return `npm update ${packageName}`;
}

function highestSeverity(vulns: NormalizedVulnerability[]): string {
  const order = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
  for (const sev of order) {
    if (vulns.some((v) => v.severity?.toUpperCase() === sev)) return sev;
  }
  return "UNKNOWN";
}

// ── Recommendation builder ────────────────────────────────────────────────────

export function buildRecommendation(
  entry: OsvScanEntry,
  suspicious: SuspiciousSignal[],
  packageScore: number,
  ecosystem: Ecosystem | string
): string {
  const name = entry.packageName;
  const cmd = updateCommand(name, ecosystem);

  // Suspicious only (no confirmed vulns): verify source first
  if (suspicious.length > 0 && entry.vulnerabilities.length === 0) {
    return (
      `Verifikasi keaslian package "${name}" sebelum digunakan. ` +
      `Buka halaman resminya di ${ecosystem === "pypi" ? "PyPI" : "npm"} dan pastikan nama, ` +
      "pemilik, dan jumlah unduhan sesuai ekspektasi. " +
      "Jika ada keraguan, pertimbangkan untuk menghapus package ini dan mencari alternatif yang terverifikasi."
    );
  }

  // No version → can't verify, add lockfile
  if (entry.skipped) {
    const lockfileHint =
      ecosystem === "pypi"
        ? "Jalankan `pip freeze > requirements.txt` dan gunakan `pip install -r requirements.txt` secara konsisten."
        : "Jalankan `npm install` untuk membuat package-lock.json, lalu commit file tersebut ke repositori.";
    return (
      `Tambahkan versi eksplisit untuk "${name}" di file dependency kamu. ` +
      lockfileHint +
      " Pertimbangkan mengaktifkan Dependabot di GitHub agar dependency selalu diperbarui otomatis."
    );
  }

  // Clean package (score 0, no suspicious)
  if (packageScore === 0 && suspicious.length === 0) {
    return (
      `Package "${name}" tidak memiliki vulnerability yang diketahui pada versi ini. ` +
      "Tetap pantau pembaruan secara berkala — rekomendasi umum adalah selalu upgrade ke minor/patch terbaru."
    );
  }

  const sev = highestSeverity(entry.vulnerabilities);

  if (sev === "CRITICAL") {
    return (
      `Segera perbarui "${name}" ke versi terbaru yang sudah dipatch. ` +
      `Jalankan: \`${cmd}\`, lalu cek CHANGELOG atau GitHub Advisory untuk memastikan versi baru menutupi kerentanan ini. ` +
      "Jika belum ada patch yang tersedia, pertimbangkan untuk menonaktifkan fitur yang bergantung pada package ini sementara menunggu pembaruan."
    );
  }

  if (sev === "HIGH") {
    return (
      `Perbarui "${name}" sesegera mungkin. Jalankan: \`${cmd}\` ` +
      "dan pastikan versi baru sudah mencakup perbaikan keamanan yang relevan. " +
      "Aktifkan Dependabot atau Renovate Bot di repositori kamu agar pembaruan keamanan terdeteksi otomatis."
    );
  }

  if (sev === "MEDIUM") {
    return (
      `Jadwalkan pembaruan "${name}" dalam siklus deployment berikutnya. ` +
      `Jalankan: \`${cmd}\` dan uji fungsionalitas setelah update. ` +
      "Aktifkan Dependabot di GitHub (Settings → Security → Dependabot alerts) untuk pemantauan berkelanjutan."
    );
  }

  // LOW or UNKNOWN severity
  return (
    `Pertimbangkan untuk memperbarui "${name}" ke versi terbaru saat ada kesempatan. ` +
    `Jalankan: \`${cmd}\` untuk mendapatkan patch terbaru. ` +
    "Dampak langsung dari kerentanan ini tergolong rendah, namun pembaruan rutin tetap menjaga kesehatan dependency proyek."
  );
}
