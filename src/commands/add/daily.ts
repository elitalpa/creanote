import fs from "fs";
import path from "path";
import { getWeekNumber } from "../utils";
import { replaceTemplateVariables } from "../utils";
import { Config } from "@/types";

export function addDaily(config: Config, date?: string) {
  const today = date ? new Date(date) : new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const week = String(getWeekNumber(today)).padStart(2, "0");

  const fileName = `${year}-${month}-${day}.md`;

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

  let templateContent = "";
  try {
    templateContent = fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    console.error("Error reading the template file:", error);
    return;
  }

  const content = replaceTemplateVariables(templateContent, {
    date: `${year}-${month}-${day}`,
    created_at: today.toISOString(),
    year: year.toString(),
    month: month.toString(),
  });

  fs.writeFileSync(dailyFolder, content);
  console.log(`Daily note added: ${dailyFolder}`);
}
