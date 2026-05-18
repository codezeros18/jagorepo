type Step = {
  label: string;
  detail: string;
};

const SCAN_STEPS: Step[] = [
  { label: "Membaca file dependency", detail: "Memvalidasi format dan isi file..." },
  { label: "Parsing dependency", detail: "Mengekstrak nama paket dan versi..." },
  { label: "Mengecek vulnerability", detail: "Mengirim query ke OSV API..." },
  { label: "Menghitung risk score", detail: "Menghitung skor berdasarkan severity temuan..." },
  { label: "Menyiapkan penjelasan", detail: "Menyusun rekomendasi dalam Bahasa Indonesia..." },
];

type Props = {
  currentStep?: number;
  fileName?: string;
};

export function ScanLoadingState({ currentStep, fileName }: Props) {
  return (
    <div className="flex flex-col items-center py-12">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
        <svg className="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </div>

      <h2 className="mt-6 text-xl font-semibold text-white">
        Sedang memindai dependency...
      </h2>
      {fileName && (
        <p className="mt-1 text-sm text-zinc-400">
          File: <code className="rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-zinc-300">{fileName}</code>
        </p>
      )}
      <p className="mt-1 text-sm text-zinc-500">
        Ini biasanya hanya butuh beberapa detik.
      </p>

      <div className="mt-8 w-full max-w-sm space-y-3">
        {SCAN_STEPS.map((step, i) => {
          const done = currentStep !== undefined && i < currentStep;
          const active = currentStep !== undefined && i === currentStep;
          return (
            <div key={step.label} className="flex items-start gap-3">
              <div className={[
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs",
                done ? "bg-emerald-500 text-white"
                  : active ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-500",
              ].join(" ")}>
                {done ? (
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : active ? (
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <div>
                <p className={`text-sm font-medium ${active ? "text-white" : done ? "text-emerald-400" : "text-zinc-500"}`}>
                  {step.label}
                </p>
                {active && (
                  <p className="text-xs text-zinc-500 animate-pulse">{step.detail}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
