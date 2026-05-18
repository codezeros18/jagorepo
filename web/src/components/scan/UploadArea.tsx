"use client";

import { useCallback, useRef, useState } from "react";

const ACCEPTED_FILES = [
  { name: "package.json", ecosystem: "npm", color: "text-red-400 bg-red-500/15" },
  { name: "package-lock.json", ecosystem: "npm", color: "text-orange-400 bg-orange-500/15" },
  { name: "requirements.txt", ecosystem: "PyPI", color: "text-blue-400 bg-blue-500/15" },
];

const MAX_SIZE_MB = 5;

function isAcceptedFile(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith(".json") || lower.endsWith(".txt");
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Props = {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  disabled?: boolean;
};

export function UploadArea({ file, onFileSelect, onFileRemove, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const validate = useCallback((f: File): string | null => {
    if (!isAcceptedFile(f.name)) {
      return `File "${f.name}" tidak didukung. Upload file .json atau .txt yang berisi dependency.`;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Ukuran file terlalu besar. Maksimum ${MAX_SIZE_MB} MB.`;
    }
    if (f.size === 0) {
      return "File kosong. Pastikan file berisi dependency yang valid.";
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const err = validate(f);
      if (err) {
        setClientError(err);
        return;
      }
      setClientError(null);
      onFileSelect(f);
    },
    [validate, onFileSelect]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback(() => setIsDragging(false), []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [disabled, handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) handleFile(selected);
      e.target.value = "";
    },
    [handleFile]
  );

  const fileInfo = ACCEPTED_FILES.find((f) => f.name === file?.name);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !disabled && !file && inputRef.current?.click()}
        className={[
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all",
          disabled
            ? "cursor-not-allowed opacity-50 border-zinc-700 bg-zinc-900"
            : file
            ? "cursor-default border-emerald-700 bg-emerald-500/5"
            : isDragging
            ? "cursor-copy border-emerald-500 bg-emerald-500/10 scale-[1.01]"
            : "cursor-pointer border-zinc-700 bg-zinc-900 hover:border-emerald-600 hover:bg-emerald-500/5",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".json,.txt"
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
        />

        {file ? (
          /* ── File selected ── */
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
              <svg className="h-7 w-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-white">{file.name}</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                {formatBytes(file.size)}
                {fileInfo && (
                  <span className={`ml-2 rounded px-1.5 py-0.5 text-xs font-medium ${fileInfo.color}`}>
                    {fileInfo.ecosystem}
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileRemove();
                setClientError(null);
              }}
              className="mt-1 text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300"
            >
              Ganti file
            </button>
          </div>
        ) : (
          /* ── Empty drop zone ── */
          <div className="flex flex-col items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${isDragging ? "bg-emerald-500/20" : "bg-zinc-800"}`}>
              <svg className={`h-7 w-7 transition-colors ${isDragging ? "text-emerald-400" : "text-zinc-500"}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                {isDragging ? "Lepaskan file di sini" : "Drag & drop file kamu"}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                atau{" "}
                <span className="font-medium text-emerald-400 underline underline-offset-2">
                  klik untuk pilih file
                </span>
              </p>
            </div>
            <p className="text-xs text-zinc-500">Maksimum {MAX_SIZE_MB} MB</p>
          </div>
        )}
      </div>

      {/* Client-side validation error */}
      {clientError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-900/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {clientError}
        </div>
      )}

      {/* Supported formats */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Format yang didukung
        </p>
        <div className="flex flex-wrap gap-2">
          {ACCEPTED_FILES.map((f) => (
            <div key={f.name} className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5">
              <span className={`rounded px-1.5 py-0.5 text-xs font-semibold ${f.color}`}>
                {f.ecosystem}
              </span>
              <code className="text-xs font-mono text-zinc-300">{f.name}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
