import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { scanRouter } from "./modules/upload/scan.router.js";
import { reportRouter } from "./modules/report/report.router.js";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3000";

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10mb" }));

// Health check — dipakai Railway dan deployment check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "jagarepo-api", version: "0.1.0" });
});

app.use("/api/scan", scanRouter);
app.use("/api/report", reportRouter);

// 404 handler untuk route yang tidak dikenali
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan.", code: "NOT_FOUND" });
});

// Global error handler — termasuk error dari middleware yang lolos
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[JagaRepo Error]", err.message);
  res.status(500).json({
    error: "Terjadi kesalahan pada server. Coba lagi.",
    code: "SERVER_ERROR",
  });
});

export default app;
