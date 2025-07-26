import fs from "fs";
import path from "path";

import {
  dailyTemplate,
  noteTemplate,
  excalidrawTemplate,
} from "@/commands/templates";

export function copyTemplate(templatePath: string, targetPath: string) {
  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found at: ${templatePath}`);
    process.exit(1);
  }

  const templateContent = fs.readFileSync(templatePath, "utf-8");

  fs.writeFileSync(targetPath, templateContent);
}

export function getTemplateContent(
  templatePath: string,
  templateType: string
): string {
  try {
    return fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    // If template file is missing, use default template and create the file
    console.warn(
      "\x1b[33mWarning: Template file not found, creating and using default template.\x1b[0m"
    );

    // find corresponding default template
    let defaultTemplate = "";
    switch (templateType) {
      case "daily":
        defaultTemplate = dailyTemplate;
        break;
      case "note":
        defaultTemplate = noteTemplate;
        break;
      case "excalidraw":
        defaultTemplate = excalidrawTemplate;
        break;
      default:
        defaultTemplate = "";
    }
    // Ensure parent directory exists
    const dir = path.dirname(templatePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(templatePath, defaultTemplate);
    return defaultTemplate;
  }
}

export function replaceTemplateVariables(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return data[key.trim()] || `{{${key}}}`;
  });
}
