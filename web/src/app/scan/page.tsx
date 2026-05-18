import type { Metadata } from "next";
import { ScanPageClient } from "@/components/scan/ScanPageClient";

export const metadata: Metadata = {
  title: "Scan Dependency — JagaRepo",
  description:
    "Upload package.json atau requirements.txt dan temukan vulnerability dependency di project kamu.",
};

export default function ScanPage() {
  return <ScanPageClient />;
}
