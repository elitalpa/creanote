import fs from "fs";
import path from "path";
import { getWeekNumber, getTemplateContent } from "../utils";
import { Config } from "@/types";

export function addExcalidraw(
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
    ? `${filename}${extension ? `.${extension}` : ".excalidraw"}`
    : `${year}-${month}-${day}${extension ? `.${extension}` : ".excalidraw"}`;

  const dailyFolder = path.join(
    process.cwd(),
    config.settings.addPath.excalidraw,
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
    config.settings.templatePath.excalidraw
  );

  const templateContent = getTemplateContent(templatePath, "excalidraw");

  fs.writeFileSync(dailyFolder, templateContent);
  console.log(`Excalidraw file added: ${dailyFolder}`);
}
