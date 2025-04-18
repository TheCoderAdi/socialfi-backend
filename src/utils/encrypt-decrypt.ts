import crypto from "crypto";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

const SECRET_KEY = Buffer.from(process.env.AES_SECRET_KEY!, "hex");
const IV = Buffer.from(process.env.AES_IV!, "hex");

export const saveAndEncryptFile = async (
  stream: NodeJS.ReadableStream,
  filename: string,
  folder: string = "uploads"
): Promise<string> => {
  const encryptedFilename = `${randomUUID()}-${filename}`;
  const currentPath = process.cwd();
  const outputPath = path.join(currentPath, "src", folder, encryptedFilename);

  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);

  await new Promise<void>((resolve, reject) => {
    const writeStream = fs.createWriteStream(outputPath);
    stream.pipe(cipher).pipe(writeStream);

    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  return outputPath;
};

export const decryptFile = (filePath: string): Buffer => {
  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);
  const encryptedData = fs.readFileSync(filePath);

  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
};
