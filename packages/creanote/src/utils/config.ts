import fs from "fs";
import path from "path";
import type { Config } from "@/types";

export function getConfigPath(): string {
  return path.join(process.cwd(), ".creanote", "config.json");
}

export function loadConfig(): Config {
  const configPath = getConfigPath();

  if (!fs.existsSync(configPath)) {
    console.error(
      `Config file (.creanote/config.json) not found. \nTo initialize, run \`creanote init\` or make sure you're in the correct directory.`
    );
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

export function saveConfig(config: Config): void {
  const configPath = getConfigPath();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
