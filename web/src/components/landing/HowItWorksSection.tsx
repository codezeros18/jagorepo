import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Upload file dependency",
    description:
      "Upload package.json, package-lock.json, atau requirements.txt langsung dari project kamu. Tidak perlu install apapun.",
    detail: "package.json · package-lock.json · requirements.txt",
  },
  {
    number: "02",
    title: "Sistem parse dependency",
    description:
      "JagaRepo membaca semua dependencies, devDependencies, dan versinya. Ekosistem npm dan PyPI didukung.",
    detail: "npm · PyPI",
  },
  {
    number: "03",
    title: "Scan via OSV API",
    description:
      "Setiap dependency dicek terhadap database OSV (Open Source Vulnerabilities) — sumber data vulnerability open-source yang dikelola oleh Google.",
    detail: "Powered by OSV · osv.dev",
  },
  {
    number: "04",
    title: "Hitung risk score",
    description:
      "Sistem menghitung risk score 0–100 berdasarkan severity vulnerability yang ditemukan dan sinyal risiko lainnya.",
    detail: "Low · Medium · High · Critical",
  },
  {
    number: "05",
    title: "Baca penjelasan dan ambil tindakan",
    description:
      "Setiap temuan dijelaskan dalam Bahasa Indonesia dengan rekomendasi fix yang jelas. Generate PDF report untuk dibawa ke dosen, juri, atau tim.",
    detail: "Penjelasan BI · Rekomendasi · PDF Report",
  },
];

export function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="border-t border-zinc-800 bg-zinc-950 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
            Cara Kerja
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Dari file ke report dalam hitungan detik.
          </h2>
          <p className="mt-5 text-lg text-zinc-400">
            Tidak perlu setup, tidak perlu install tools. Upload, scan, dan baca hasilnya.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 space-y-0">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex gap-8 pb-12 last:pb-0">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-6 top-14 h-full w-px bg-zinc-800"
                />
              )}

              {/* Step number */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 font-mono text-sm font-bold text-emerald-400">
                {step.number}
              </div>

              {/* Content */}
              <div className="pt-2.5">
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.description}</p>
                <p className="mt-2 text-xs font-medium text-zinc-600">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA inline */}
        <div className="mt-14 text-center">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            Coba Sekarang — Gratis
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
