import fs from "fs";

export function copyTemplate(templatePath: string, targetPath: string) {
  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found at: ${templatePath}`);
    process.exit(1);
  }

  const templateContent = fs.readFileSync(templatePath, "utf-8");

  fs.writeFileSync(targetPath, templateContent);
}

export function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const week = Math.floor(diff / oneDay / 7);
  return week + 1;
}

export function replaceTemplateVariables(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return data[key.trim()] || `{{${key}}}`;
  });
}
