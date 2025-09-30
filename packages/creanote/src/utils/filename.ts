import fs from "fs";
import path from "path";

export function sanitizeFilename(text: string): string {
  // Remove or replace invalid filename characters
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length
}

export function generateUniqueFilename(
  basePath: string,
  topic: string,
  extension: string
): string {
  const sanitized = sanitizeFilename(topic);
  const baseFilename = `${sanitized}.${extension}`;
  const fullBasePath = path.join(basePath, baseFilename);

  // If file doesn't exist, use the base filename
  if (!fs.existsSync(fullBasePath)) {
    return baseFilename;
  }

  // If file exists, find the next available number
  let counter = 1;
  let uniqueFilename: string;
  let fullPath: string;

  do {
    uniqueFilename = `${sanitized}-${counter}.${extension}`;
    fullPath = path.join(basePath, uniqueFilename);
    counter++;
  } while (fs.existsSync(fullPath));

  return uniqueFilename;
}
