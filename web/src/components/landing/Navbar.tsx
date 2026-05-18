import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
            JR
          </span>
          <span className="text-base font-semibold text-white">JagaRepo</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-400 sm:flex">
          <a href="#cara-kerja" className="transition-colors hover:text-white">
            Cara Kerja
          </a>
          <a href="#fitur" className="transition-colors hover:text-white">
            Fitur
          </a>
          <a href="#kenapa" className="transition-colors hover:text-white">
            Kenapa JagaRepo
          </a>
        </nav>

        {/* CTA */}
        <Link
          href="/scan"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
        >
          Mulai Scan
        </Link>
      </div>
    </header>
  );
}
