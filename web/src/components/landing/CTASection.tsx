import Link from "next/link";

export function CTASection() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-950 py-24 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Siap cek project kamu?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
          Upload <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm font-mono text-zinc-200">package.json</code> atau{" "}
          <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm font-mono text-zinc-200">requirements.txt</code> dan
          lihat hasilnya dalam hitungan detik. Gratis, tanpa registrasi.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-emerald-500 hover:shadow-lg"
          >
            Mulai Scan Sekarang
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-zinc-500">
          <span>✓ Gratis</span>
          <span>✓ Tanpa registrasi</span>
          <span>✓ Hasil dalam detik</span>
          <span>✓ Penjelasan Bahasa Indonesia</span>
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-xs text-zinc-600">
          JagaRepo adalah platform edukatif. Score adalah indikator awal, bukan jaminan keamanan mutlak.
          Untuk security production, lakukan audit menyeluruh bersama tim keamanan.
        </p>
      </div>
    </section>
  );
}
