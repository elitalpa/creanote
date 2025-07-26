import { addDaily } from "./daily";
import { addNote } from "./note";
import { addExcalidraw } from "./excalidraw";
import { addFile } from "./file";
import { loadConfig } from "@/utils";

export function add(
  type: string,
  options: { date?: string; filename?: string; extension?: string }
) {
  const config = loadConfig();

  switch (type) {
    case "daily":
      addDaily(config, options.date, options.filename, options.extension);
      break;
    case "note":
      addNote(config, options.date, options.filename, options.extension);
      break;
    case "excalidraw":
      addExcalidraw(config, options.date, options.filename, options.extension);
      break;
    case "file":
      addFile(config, options.date, options.filename, options.extension);
      break;
    default:
      console.error(`Invalid type: ${type}`);
      process.exit(1);
  }
}
