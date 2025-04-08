import fs from "fs";
import path from "path";

/**
 *
 * @param filePath - The path of the file to be deleted.
 * @returns void
 */
export const deleteFile = (filePath: string) => {
  fs.unlink(path.resolve(filePath), (err) => {
    if (err) console.error("Failed to delete file:", err);
  });
};
