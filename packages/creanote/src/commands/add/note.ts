import fs from "fs";
import path from "path";
import { replaceTemplateVariables } from "../utils";
import { Config } from "@/types";

export function addNote(config: Config) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const dateStr = `${year}-${month}-${day}`;

  const noteFolder = path.join(process.cwd(), config.settings.addPath.note);
  const noteFile = path.join(noteFolder, `${dateStr}.md`);

  if (!fs.existsSync(noteFolder)) {
    fs.mkdirSync(noteFolder, { recursive: true });
  }

  if (fs.existsSync(noteFile)) {
    console.log(
      `The note for today (${noteFile}) already exists. Note was not created.`
    );
    return;
  }

  const templatePath = path.resolve(
    process.cwd(),
    config.settings.templatePath.note
  );

  let templateContent = "";
  try {
    templateContent = fs.readFileSync(templatePath, "utf-8");
  } catch (error) {
    console.error("Error reading the template file:", error);
    return;
  }

  const content = replaceTemplateVariables(templateContent, {
    date: dateStr,
    created_at: today.toISOString(),
    year: year.toString(),
    month: month.toString(),
  });

  fs.writeFileSync(noteFile, content);
  console.log(`Note added: ${noteFile}`);
}
