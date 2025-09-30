import fs from "fs";
import path from "path";
import { Config, Template } from "@/types";
import { log } from "./log";
import { getWeekNumber } from "./date";

export function copyTemplate(templatePath: string, targetPath: string) {
  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found at: ${templatePath}`);
    process.exit(1);
  }

  const templateContent = fs.readFileSync(templatePath, "utf-8");

  fs.writeFileSync(targetPath, templateContent);
}

export function replaceTemplateVariables(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return data[key.trim()] || `{{${key}}}`;
  });
}

export function addFromTemplate(
  config: Config,
  template: Template,
  date?: string,
  filename?: string
) {
  const targetDate = date ? new Date(date) : new Date();
  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");
  const week = String(getWeekNumber(targetDate)).padStart(2, "0");

  // Replace template variables in target path
  let targetPath = replaceTemplateVariables(template.target, {
    year: year.toString(),
    month: month,
    day: day,
    week: week,
    ext: template.ext,
  });

  // Use custom filename if provided
  if (filename) {
    const pathParts = targetPath.split("/");
    pathParts[pathParts.length - 1] = filename;
    targetPath = pathParts.join("/");
  }

  // Build full file path
  const fullPath = path.join(
    process.cwd(),
    config.settings.basePath,
    targetPath
  );
  const folderPath = path.dirname(fullPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Check if file already exists
  if (fs.existsSync(fullPath)) {
    const relativePath = path.relative(process.cwd(), fullPath);
    log.warning(`File "${relativePath}" already exists. Note was not created.`);
    return;
  }

  // Read template content
  const templatePath = path.resolve(
    process.cwd(),
    config.settings.basePath,
    template.path
  );

  let templateContent = "";
  try {
    templateContent = fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    log.error(`Error reading template file: ${error}`);
    return;
  }

  // Replace template variables in content
  const content = replaceTemplateVariables(templateContent, {
    date: `${year}-${month}-${day}`,
    created_at: targetDate.toISOString(),
    year: year.toString(),
    month: month,
    day: day,
    week: week,
  });

  // Write file
  fs.writeFileSync(fullPath, content);

  // Show relative path from current working directory
  const relativePath = path.relative(process.cwd(), fullPath);
  log.success(`${template.description} added: ${relativePath}`);
}
