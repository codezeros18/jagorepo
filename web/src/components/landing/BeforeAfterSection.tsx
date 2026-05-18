import Link from "next/link";

// Mirrors the data from demo/mock-scan-high-risk.json and mock-scan-low-risk.json
const BEFORE = {
  fileName: "vulnerable-package.json",
  riskScore: 82,
  category: "Critical",
  totalDeps: 8,
  vulnDeps: 3,
  findings: [
    { name: "lodash",    version: "4.17.20", category: "Critical", vulns: 2 },
    { name: "axios",     version: "0.21.1",  category: "High",     vulns: 2 },
    { name: "minimist",  version: "1.2.5",   category: "Medium",   vulns: 1 },
  ],
};

const AFTER = {
  fileName: "safe-package.json",
  riskScore: 0,
  category: "Low",
  totalDeps: 8,
  vulnDeps: 0,
  findings: [
    { name: "lodash",   version: "4.17.21", category: "Low", vulns: 0 },
    { name: "axios",    version: "1.7.2",   category: "Low", vulns: 0 },
    { name: "minimist", version: "1.2.8",   category: "Low", vulns: 0 },
  ],
};

function categoryColor(cat: string) {
  switch (cat) {
    case "Critical": return { text: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30"     };
    case "High":     return { text: "text-orange-400",  bg: "bg-orange-500/10",  border: "border-orange-500/30"  };
    case "Medium":   return { text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30"   };
    default:         return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" };
  }
}

function ScoreDisplay({ score, category }: { score: number; category: string }) {
  const c = categoryColor(category);
  return (
    <div className={`flex flex-col items-center rounded-2xl border-2 ${c.border} ${c.bg} px-6 py-5`}>
      <p className={`text-5xl font-extrabold tabular-nums ${c.text}`}>{score}</p>
      <p className="mt-0.5 text-sm text-zinc-500">/100</p>
      <span className={`mt-2 rounded-md px-2 py-0.5 text-xs font-semibold ${c.text} ${c.bg} border ${c.border}`}>
        {category}
      </span>
    </div>
  );
}

function FindingRow({ name, version, category, vulns }: typeof BEFORE.findings[0]) {
  const c = categoryColor(category);
  const isSafe = vulns === 0;
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-800/50 px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <code className="text-xs font-semibold text-zinc-200 truncate">{name}</code>
        <code className="hidden sm:block text-xs text-zinc-500">v{version}</code>
      </div>
      {isSafe ? (
        <span className="shrink-0 rounded-md px-2 py-0.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
          Aman
        </span>
      ) : (
        <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${c.text} ${c.bg} border ${c.border}`}>
          {category} · {vulns} CVE
        </span>
      )}
    </div>
  );
}

function ScanCard({
  label,
  accent,
  data,
}: {
  label: string;
  accent: "red" | "emerald";
  data: typeof BEFORE;
}) {
  const headerBg = accent === "red" ? "bg-red-600" : "bg-emerald-600";

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      {/* Card header */}
      <div className={`${headerBg} px-5 py-3`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
          {label}
        </p>
        <code className="text-sm font-semibold text-white">{data.fileName}</code>
      </div>

      <div className="flex flex-col gap-4 p-5">
        {/* Score + stats */}
        <div className="flex items-center gap-5">
          <ScoreDisplay score={data.riskScore} category={data.category} />
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-xs text-zinc-500">Total Dependency</p>
              <p className="font-bold text-white">{data.totalDeps} packages</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Vulnerable</p>
              <p className={`font-bold ${data.vulnDeps > 0 ? "text-red-400" : "text-emerald-400"}`}>
                {data.vulnDeps === 0 ? "Tidak ada" : `${data.vulnDeps} packages`}
              </p>
            </div>
          </div>
        </div>

        {/* Findings preview */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Package yang dicek
          </p>
          {data.findings.map((f) => (
            <FindingRow key={f.name} {...f} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterSection() {
  return (
    <section className="border-t border-zinc-800 bg-zinc-950 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-500">
            Demo Before / After
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Satu scan. Tiga update. Risk turun ke nol.
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Ini contoh nyata perbedaan antara project yang belum diaudit dan
            project yang sudah memperbarui dependency-nya.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-8">
          <ScanCard label="Sebelum — Rentan" accent="red"     data={BEFORE} />
          <ScanCard label="Sesudah — Aman"   accent="emerald" data={AFTER}  />
        </div>

        {/* Arrow separator hint for mobile (hidden on sm+) */}
        <div className="pointer-events-none -mt-4 mb-4 flex justify-center sm:hidden" aria-hidden>
          <svg className="h-8 w-8 rotate-90 text-zinc-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>

        {/* Impact message */}
        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-base font-semibold text-zinc-100">
            Perbedaan: update{" "}
            <code className="font-mono text-emerald-400">lodash</code>,{" "}
            <code className="font-mono text-emerald-400">axios</code>, dan{" "}
            <code className="font-mono text-emerald-400">minimist</code>.
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Risk Score dari{" "}
            <span className="font-semibold text-red-400">82 / Critical</span>{" "}
            turun menjadi{" "}
            <span className="font-semibold text-emerald-400">0 / Low</span>.
          </p>
          <Link
            href="/scan"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            Cek project kamu
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-5 text-center text-xs text-zinc-600">
          Data di atas berdasarkan scan mock menggunakan CVE dari database OSV.
          Hasil scan nyata bergantung pada versi dependency project kamu.
        </p>
      </div>
    </section>
  );
}
