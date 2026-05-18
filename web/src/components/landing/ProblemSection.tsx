const scenarios = [
  {
    label: "Kebiasaan umum",
    title: "Install dulu, cek nanti",
    description:
      "Kamu install package dari tutorial, Stack Overflow, atau README. Cepat dan mudah. Tapi apakah versinya masih aman? Apakah sudah ada patch untuk vulnerability yang diketahui?",
  },
  {
    label: "Supply chain risk",
    title: "Satu package, banyak dependency",
    description:
      "Package yang kamu install ikut membawa puluhan dependency lain. Vulnerability bisa datang bukan dari package utama, tapi dari dependency tersembunyinya.",
  },
  {
    label: "Contoh nyata",
    title: "Baru tahu setelah ada insiden",
    description:
      "SolarWinds, event-stream, ua-parser-js — semua dimulai dari dependency yang dipercaya. Developer baru tahu ada masalah setelah terlambat.",
  },
];

export function ProblemSection() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-950 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
            Masalah
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Aplikasi modern jarang dibuat dari nol.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            Developer modern bergantung pada ratusan package open-source. Masing-masing membawa
            risiko yang berbeda — dan sering tidak terlihat sampai ada masalah.
          </p>
        </div>

        {/* Scenario cards */}
        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {scenarios.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7"
            >
              <span className="inline-block rounded-md border border-zinc-700 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                {s.label}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.description}</p>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-7 text-center">
          <p className="text-base font-medium leading-relaxed text-zinc-300">
            &ldquo;Cukup satu dependency yang vulnerable untuk membuka celah di seluruh project.
            Developer pemula dan mahasiswa paling rentan karena jarang punya waktu atau tools
            untuk cek ini.&rdquo;
          </p>
          <p className="mt-4 text-sm text-zinc-500">— Alasan JagaRepo dibuat</p>
        </div>
      </div>
    </section>
  );
}
