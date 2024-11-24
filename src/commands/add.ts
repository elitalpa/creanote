import { readFileSync } from "fs";
import { join } from "path";
import { addDaily } from "./add/daily";
import { addNote } from "./add/note";

export function add(type: string) {
  const configPath = join(process.cwd(), ".creanote", "config.json");
  const config = JSON.parse(readFileSync(configPath, "utf-8"));

  switch (type) {
    case "daily":
      addDaily(config);
      break;
    case "note":
      addNote(config);
      break;
    default:
      console.error(`Invalid type: ${type}`);
      process.exit(1);
  }
}
