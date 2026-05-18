import multer from "multer";
import { MAX_FILE_SIZE_BYTES } from "../../lib/validation.js";

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const lower = file.originalname.toLowerCase();
    if (lower.endsWith(".json") || lower.endsWith(".txt")) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `File "${file.originalname}" tidak didukung. Gunakan package.json, package-lock.json, atau requirements.txt.`
        )
      );
    }
  },
});
