import fs from "fs";
import path from "path";
import { getWeekNumber, replaceTemplateVariables, getTemplateContent } from "../utils";
import { Config } from "@/types";

export function addDaily(
  config: Config,
  date?: string,
  filename?: string,
  extension?: string
) {
  const today = date ? new Date(date) : new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const week = String(getWeekNumber(today)).padStart(2, "0");

  const fileName = filename
    ? `${filename}${extension ? `.${extension}` : ".md"}`
    : `${year}-${month}-${day}${extension ? `.${extension}` : ".md"}`;

  const dailyFolder = path.join(
    process.cwd(),
    config.settings.addPath.daily,
    `${year}`,
    `${year}-${month}`,
    `week-${week}`,
    fileName
  );

  const folderPath = path.dirname(dailyFolder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (fs.existsSync(dailyFolder)) {
    console.log(
      `The file "${dailyFolder}" already exists. Note was not created.`
    );
    return;
  }

  const templatePath = path.resolve(
    process.cwd(),
    config.settings.templatePath.daily
  );

  const templateContent = getTemplateContent(templatePath, "daily");

  const content = replaceTemplateVariables(templateContent, {
    date: `${year}-${month}-${day}`,
    created_at: today.toISOString(),
    year: year.toString(),
    month: month.toString(),
  });

  fs.writeFileSync(dailyFolder, content);
  console.log(`Daily note added: ${dailyFolder}`);
}
