import path from "path";
import fs from "fs";
import { decryptFile } from "../utils/encrypt-decrypt";
import { TryCatch } from "../utils/error";

const getImage = TryCatch(async (req, res) => {
  const currentPath = process.cwd();
  const encryptedFilePath = path.join(currentPath, "src/uploads", req.params.filename);

  if (!fs.existsSync(encryptedFilePath)) {
    return res.status(404).json({ message: "Image not found" });
  }

  const decryptedBuffer = decryptFile(encryptedFilePath);

  const ext = path.extname(req.params.filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  res.set("Content-Type", mimeTypes[ext] || "application/octet-stream");
  res.set("Content-Disposition", `inline; filename="${path.basename(req.params.filename)}"`);
  res.set("Cache-Control", "no-cache");

  res.send(decryptedBuffer);
});

export { getImage };
