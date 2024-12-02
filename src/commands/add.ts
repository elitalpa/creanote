import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { addDaily } from "./add/daily";
import { addNote } from "./add/note";

export function add(type: string, options: { date?: string }) {
  const configPath = join(process.cwd(), ".creanote", "config.json");

  if (!existsSync(configPath)) {
    console.error(
      `Config file (.creanote/config.json) not found. \nTo initialize, run \`creanote init\` or make sure you're in the correct directory.`
    );
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(configPath, "utf-8"));

  switch (type) {
    case "daily":
      addDaily(config, options.date);
      break;
    case "note":
      addNote(config);
      break;
    default:
      console.error(`Invalid type: ${type}`);
      process.exit(1);
  }
}
