import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 pb-20 pt-24 sm:pb-28 sm:pt-32">
      {/* Subtle radial glow behind headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Chip / badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Platform Keamanan Dependency Open Source
        </div>

        {/* Headline — Linear scale */}
        <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Cek dependency<br />
          sebelum jadi{" "}
          <span className="text-emerald-400">celah.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-zinc-400">
          Upload{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm font-mono text-zinc-200">package.json</code>{" "}
          atau{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm font-mono text-zinc-200">requirements.txt</code>.
          Temukan vulnerability, pahami risiko, dan dapatkan rekomendasi fix dalam{" "}
          <span className="text-white font-medium">Bahasa Indonesia</span>.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-emerald-400"
          >
            Mulai Scan Sekarang
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <a
            href="#cara-kerja"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-8 py-3.5 text-base font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            Lihat Cara Kerja
          </a>
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Gratis
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Tanpa registrasi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Data OSV API
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            npm &amp; PyPI
          </span>
        </div>
      </div>

      {/* Mock terminal */}
      <div className="mx-auto mt-20 max-w-2xl px-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40">
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="ml-3 text-xs font-mono text-zinc-500">jagarepo — scan result</span>
          </div>
          {/* Content */}
          <div className="space-y-3 p-5 font-mono text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">File:</span>
              <span className="text-emerald-400">vulnerable-package.json</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Total dependency:</span>
              <span className="text-zinc-200">8 packages</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Vulnerable:</span>
              <span className="text-red-400">3 packages</span>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Risk Score:</span>
              <span className="text-2xl font-bold text-red-400">82 / 100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Kategori:</span>
              <span className="rounded bg-red-500/20 px-2 py-0.5 text-red-400">CRITICAL</span>
            </div>
            <div className="h-px bg-zinc-800" />
            <div className="text-xs text-zinc-500">
              ▶ lodash@4.17.20 — 2 CVE High. Perbarui ke 4.17.21.
            </div>
            <div className="text-xs text-zinc-500">
              ▶ axios@0.21.1 — CSRF vulnerability. Perbarui ke 1.7.2.
            </div>
            <div className="text-xs text-zinc-500">
              ▶ minimist@1.2.5 — Prototype Pollution. Perbarui ke 1.2.8.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
