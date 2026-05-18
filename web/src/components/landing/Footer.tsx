export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-xs font-bold text-white">
              JR
            </span>
            <span className="text-sm font-semibold text-white">JagaRepo</span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-zinc-500">
            Cek dependency sebelum jadi celah.
          </p>

          {/* Disclaimer */}
          <p className="text-xs text-zinc-600">
            Platform edukatif. Bukan pengganti tools enterprise.
          </p>
        </div>

        <div className="mt-6 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600">
          Powered by{" "}
          <a
            href="https://osv.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
          >
            OSV API
          </a>{" "}
          · Data vulnerability dari Google Open Source Security Team.
          <br />
          <span className="mt-1 block">
            Score adalah indikator awal. Selalu lakukan verifikasi manual sebelum mengambil keputusan keamanan.
          </span>
        </div>
      </div>
    </footer>
  );
}
