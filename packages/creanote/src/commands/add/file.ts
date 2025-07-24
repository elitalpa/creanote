import fs from "fs";
import path from "path";
import { Config } from "@/types";

export function addFile(
  config: Config,
  date?: string,
  filename?: string,
  extension?: string
) {
  const today = date ? new Date(date) : new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const noteFolder = path.join(process.cwd(), config.settings.addPath.note);
  const noteFile = path.join(
    noteFolder,
    filename
      ? `${filename}${extension ? `.${extension}` : ""}`
      : `${dateStr}${extension ? `.${extension}` : ""}`
  );

  if (!fs.existsSync(noteFolder)) {
    fs.mkdirSync(noteFolder, { recursive: true });
  }

  if (fs.existsSync(noteFile)) {
    console.log(`The file (${noteFile}) already exists. File was not created.`);
    return;
  }

  const content = "";

  fs.writeFileSync(noteFile, content);
  console.log(`Note added: ${noteFile}`);
}
