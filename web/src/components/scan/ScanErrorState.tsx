type Props = {
  message: string;
  onRetry: () => void;
  onLoadMockResult?: () => void;
};

export function ScanErrorState({ message, onRetry, onLoadMockResult }: Props) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      {/* Error icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-white">Scan gagal</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-zinc-400">{message}</p>

      {/* Common causes */}
      <div className="mt-6 w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-left">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Kemungkinan penyebab
        </p>
        <ul className="space-y-1.5 text-xs text-zinc-400">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-600">·</span>
            Format file tidak sesuai atau JSON tidak valid
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-600">·</span>
            File kosong atau tidak berisi dependency
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-600">·</span>
            Koneksi ke server terputus saat proses berlangsung
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-zinc-600">·</span>
            OSV API tidak merespons (coba lagi dalam beberapa menit)
          </li>
        </ul>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Coba lagi
        </button>

        {onLoadMockResult && (
          <button
            type="button"
            onClick={onLoadMockResult}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:border-zinc-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
            </svg>
            Gunakan data demo
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-zinc-500">
        Jika masalah berlanjut, aktifkan <code className="font-mono text-xs text-zinc-400">NEXT_PUBLIC_DEMO_MODE=true</code> untuk mode demo penuh.
      </p>
    </div>
  );
}
