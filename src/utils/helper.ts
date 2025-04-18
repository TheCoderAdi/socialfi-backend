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

/**
 * Generates a random username based on the provided name.
 * @param name - The name to base the username on.
 * @returns A random username.
 */
export const generateUsername = (name: string) => {
  const baseUsername = name.split(" ")[0].toLowerCase();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${baseUsername}${randomSuffix}`;
};
