const comparisons = [
  {
    label: "Target pengguna",
    jagarepo: "Mahasiswa, developer pemula, startup kecil",
    others: "Enterprise, tim AppSec berpengalaman",
  },
  {
    label: "Bahasa",
    jagarepo: "Bahasa Indonesia — ramah bagi pemula lokal",
    others: "Bahasa Inggris, output teknis",
  },
  {
    label: "Setup",
    jagarepo: "Buka browser, upload, selesai",
    others: "Install CLI, konfigurasi, integrasi CI/CD",
  },
  {
    label: "Penjelasan",
    jagarepo: "Edukatif, dijelaskan dengan bahasa manusia",
    others: "Data teknis CVE, CVSS score mentah",
  },
  {
    label: "Biaya",
    jagarepo: "Gratis untuk demo dan belajar",
    others: "Berbayar (ada tier gratis terbatas)",
  },
];

const highlights = [
  {
    title: "Dibuat untuk developer Indonesia",
    description:
      "Penjelasan dalam Bahasa Indonesia, tone yang manusiawi, dan desain yang tidak overwhelming untuk pemula.",
  },
  {
    title: "Berfokus pada edukasi",
    description:
      "JagaRepo membantu kamu memahami kenapa suatu dependency berisiko, bukan hanya memberi label merah.",
  },
  {
    title: "Ringan dan cepat",
    description:
      "Tidak butuh akun, tidak butuh konfigurasi, tidak butuh laptop dengan RAM besar. Upload dan baca hasilnya.",
  },
  {
    title: "Jujur soal keterbatasan",
    description:
      "JagaRepo adalah langkah awal yang baik — bukan jaminan keamanan mutlak. Kami tidak overclaim.",
  },
];

export function WhyJagaRepoSection() {
  return (
    <section id="kenapa" className="border-t border-zinc-800 bg-zinc-950 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
            Kenapa JagaRepo
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Bukan pengganti Snyk atau Dependabot.
          </h2>
          <p className="mt-5 text-lg text-zinc-400">
            JagaRepo tidak bersaing dengan tools enterprise. JagaRepo mengisi celah yang
            belum dilayani: developer Indonesia yang butuh pemahaman keamanan, bukan dashboard
            yang kompleks.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mt-16 overflow-hidden rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th className="px-6 py-4 text-left font-semibold text-zinc-400">Aspek</th>
                <th className="px-6 py-4 text-left font-semibold text-emerald-400">
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-xs font-bold text-white">JR</span>
                    JagaRepo
                  </span>
                </th>
                <th className="px-6 py-4 text-left font-semibold text-zinc-500">
                  Tools Enterprise
                  <span className="ml-2 text-xs font-normal text-zinc-600">(Snyk, Dependabot, Socket)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-zinc-800 last:border-0 ${i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900/50"}`}
                >
                  <td className="px-6 py-4 font-medium text-zinc-400">{row.label}</td>
                  <td className="px-6 py-4 text-emerald-400">
                    <span className="flex items-center gap-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </span>
                      {row.jagarepo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">{row.others}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-center text-xs text-zinc-600">
          * JagaRepo adalah platform edukatif. Untuk keamanan production enterprise, tetap gunakan tools yang sesuai.
        </p>

        {/* Highlight cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="mb-3 h-1.5 w-8 rounded-full bg-emerald-500" />
              <h3 className="text-sm font-semibold text-white">{h.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{h.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
