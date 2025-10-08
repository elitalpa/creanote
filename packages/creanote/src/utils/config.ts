import fs from "fs";
import path from "path";
import { Config, LegacyConfig, Template } from "@/types";
import { log } from "./log";
import { ensureGitignore } from "./gitignore";
import { excalidrawTemplate } from "../data/templates";
import packageJson from "../../package.json" assert { type: "json" };

export function getConfigPath(): string {
  return path.join(process.cwd(), ".creanote", "config.json");
}

export function configExists(): boolean {
  return fs.existsSync(getConfigPath());
}

export function isValidConfig(config: any): config is Config {
  try {
    // Check basic structure
    if (!config || typeof config !== "object") return false;

    // Check info section
    if (!config.info || typeof config.info !== "object") return false;
    if (
      !config.info.name ||
      !config.info.author ||
      !config.info.url ||
      !config.info.license
    )
      return false;

    // Check settings section
    if (!config.settings || typeof config.settings !== "object") return false;
    if (
      !config.settings.basePath ||
      typeof config.settings.basePath !== "string"
    )
      return false;

    // Check templates array
    if (!Array.isArray(config.settings.templates)) return false;
    for (const template of config.settings.templates) {
      if (
        !template.name ||
        !template.description ||
        !template.path ||
        !template.ext ||
        !template.target
      ) {
        return false;
      }
    }

    // AI and sync are optional, but if present, should have correct structure
    if (config.settings.ai) {
      if (
        !config.settings.ai.llm ||
        !config.settings.ai.llm.model ||
        !config.settings.ai.llm.provider
      ) {
        return false;
      }
    }

    if (config.settings.sync) {
      if (!config.settings.sync.user || !config.settings.sync.remote) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

export function isLegacyConfig(config: any): config is LegacyConfig {
  try {
    return config?.settings?.templatePath && config?.settings?.addPath;
  } catch {
    return false;
  }
}

export function migrateLegacyConfig(legacyConfig: LegacyConfig): Config {
  log.info("Migrating from legacy config format...");

  const templates: Template[] = [
    {
      name: "daily",
      description: "Daily note",
      path: legacyConfig.settings.templatePath.daily,
      ext: "md",
      target: `${legacyConfig.settings.addPath.daily}/{{year}}/{{year}}-{{month}}/week-{{week}}/{{year}}-{{month}}-{{day}}.{{ext}}`,
    },
    {
      name: "note",
      description: "Regular note",
      path: legacyConfig.settings.templatePath.note,
      ext: "md",
      target: `${legacyConfig.settings.addPath.note}/{{year}}-{{month}}-{{day}}.{{ext}}`,
    },
    {
      name: "excalidraw",
      description: "Excalidraw drawing",
      path: ".creanote/templates/excalidraw.excalidraw",
      ext: "excalidraw",
      target: "draw/{{year}}-{{month}}-{{day}}.{{ext}}",
    },
  ];

  // Create excalidraw template file if it doesn't exist
  const creanoteDir = path.join(process.cwd(), ".creanote");
  const excalidrawTemplatePath = path.join(
    creanoteDir,
    "templates",
    "excalidraw.excalidraw"
  );
  if (!fs.existsSync(excalidrawTemplatePath)) {
    const templatesDir = path.dirname(excalidrawTemplatePath);
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }

    fs.writeFileSync(excalidrawTemplatePath, excalidrawTemplate);
    log.success("Created excalidraw template file");
  }

  // Create .gitignore file if it doesn't exist
  ensureGitignore();

  const newConfig: Config = {
    info: legacyConfig.info,
    settings: {
      basePath: "./",
      templates,
    },
  };

  return newConfig;
}

export function addVersionIfMissing(config: Config): Config {
  if (!config.info.version) {
    log.info("Adding version to config...");
    config.info.version = packageJson.version;
  }
  return config;
}

export function loadConfig(): Config | null {
  const configPath = getConfigPath();

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const configContent = fs.readFileSync(configPath, "utf-8");
    let config = JSON.parse(configContent);

    if (isLegacyConfig(config)) {
      config = migrateLegacyConfig(config);
      saveConfig(config);
      log.success("Config migrated to new format");
    }

    if (isValidConfig(config)) {
      // Add version if missing
      const originalVersion = config.info.version;
      config = addVersionIfMissing(config);

      // Save config if version was added
      if (!originalVersion && config.info.version) {
        saveConfig(config);
        log.success("Version added to config");
      }

      return config;
    }

    log.error("Invalid config format found");
    return null;
  } catch (error) {
    log.error(`Failed to load config: ${error}`);
    return null;
  }
}

export function saveConfig(config: Config): void {
  const configPath = getConfigPath();
  const configDir = path.dirname(configPath);

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function createDefaultConfig(): Config {
  return {
    info: {
      name: "creanote",
      version: packageJson.version,
      author: "elitalpa",
      url: "https://github.com/elitalpa/creanote#readme",
      license: "MIT",
    },
    settings: {
      basePath: "./",
      templates: [
        {
          name: "daily",
          description: "Daily note",
          path: ".creanote/templates/daily.md",
          ext: "md",
          target:
            "daily/{{year}}/{{year}}-{{month}}/week-{{week}}/{{year}}-{{month}}-{{day}}.{{ext}}",
        },
        {
          name: "note",
          description: "Regular note",
          path: ".creanote/templates/note.md",
          ext: "md",
          target: "{{year}}-{{month}}-{{day}}.{{ext}}",
        },
        {
          name: "excalidraw",
          description: "Excalidraw drawing",
          path: ".creanote/templates/excalidraw.excalidraw",
          ext: "excalidraw",
          target: "draw/{{year}}-{{month}}-{{day}}.{{ext}}",
        },
      ],
    },
  };
}
