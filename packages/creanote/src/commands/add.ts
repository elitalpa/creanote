import { loadConfig, log, addFromTemplate } from "@/utils";

export function add(
  type: string,
  options: { date?: string; filename?: string }
) {
  const config = loadConfig();

  if (!config) {
    log.error("Invalid config. Run 'creanote init' to reset.");
    process.exit(1);
  }

  // Find template by name
  const template = config.settings.templates.find((t) => t.name === type);

  if (!template) {
    const availableTypes = config.settings.templates
      .map((t) => t.name)
      .join(", ");
    log.error(`Invalid type: ${type}. Available types: ${availableTypes}`);
    process.exit(1);
  }

  addFromTemplate(config, template, options.date, options.filename);
}
