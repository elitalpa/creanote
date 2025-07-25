import fs from "fs";
import { getISOWeek } from "date-fns";
import path from "path";

import { dailyTemplate, noteTemplate, excalidrawTemplate } from "./templates";

export function copyTemplate(templatePath: string, targetPath: string) {
  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found at: ${templatePath}`);
    process.exit(1);
  }

  const templateContent = fs.readFileSync(templatePath, "utf-8");

  fs.writeFileSync(targetPath, templateContent);
}

export function getWeekNumber(date: Date): number {
  return getISOWeek(date);
}
// export function getWeekNumber(date: Date): number {
//   const weekday = {
//     sunday: 0,
//     monday: 1,
//     tuesday: 2,
//     wednesday: 3,
//     thursday: 4,
//     friday: 5,
//     saturday: 6,
//   };

//   // get current week thursday
//   const day = (date.getDay() + 6) % 7;
//   const thursday = new Date(date);
//   thursday.setDate(date.getDate() - day + (7 - weekday.thursday));

//   // get first thursday of the year
//   const firstThursday = new Date(thursday.getFullYear(), 0, 1);
//   if (firstThursday.getDay() !== weekday.thursday) {
//     firstThursday.setMonth(
//       0,
//       1 + ((weekday.thursday + 7 - firstThursday.getDay()) % 7)
//     );
//   }

//   // calculate the number of weeks between
//   const diff = Number(thursday) - Number(firstThursday);
//   const oneDay = 1000 * 60 * 60 * 24;
//   const oneWeek = oneDay * 7;

//   const weekNum = 1 + Math.floor(diff / oneWeek);

//   return weekNum;
// }

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
