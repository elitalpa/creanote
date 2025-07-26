import fs from "fs";
import path from "path";
import {
  dailyTemplate,
  noteTemplate,
  excalidrawTemplate,
} from "@/commands/templates";
import { setupSyncFromInit } from "@/commands/sync";
import { setupAI } from "@/commands/ai/setup";
import { question, closeReadline } from "@/utils";

export async function init() {
  const initDirectory = path.join(process.cwd(), ".creanote");

  if (fs.existsSync(initDirectory)) {
    console.log("Already initialized");
    process.exit(0);
  }

  fs.mkdirSync(path.join(initDirectory, "templates"), { recursive: true });

  fs.writeFileSync(
    path.join(initDirectory, "templates", "daily.md"),
    dailyTemplate
  );
  fs.writeFileSync(
    path.join(initDirectory, "templates", "note.md"),
    noteTemplate
  );
  fs.writeFileSync(
    path.join(initDirectory, "templates", "excalidraw.excalidraw"),
    excalidrawTemplate
  );

  const config = {
    info: {
      name: "creanote",
      author: "elitalpa",
      url: "https://github.com/elitalpa/creanote#readme",
      license: "MIT",
    },
    settings: {
      templatePath: {
        daily: ".creanote/templates/daily.md",
        note: ".creanote/templates/note.md",
        excalidraw: ".creanote/templates/excalidraw.excalidraw",
      },
      addPath: {
        daily: "./daily",
        note: "./",
        excalidraw: "./daily",
      },
    },
  };

  fs.writeFileSync(
    path.join(initDirectory, "config.json"),
    JSON.stringify(config, null, 2)
  );

  console.log("Initialization complete.");

  // Ask about sync setup
  console.log();
  const setupSync = await question(
    "Would you like to set up sync for your notes? (y/n): "
  );
  if (setupSync.toLowerCase() === "y") {
    await setupSyncFromInit();
  }

  // Ask about AI setup
  console.log();
  const setupAIOption = await question(
    "Would you like to set up AI ? (y/n): "
  );
  if (setupAIOption.toLowerCase() === "y") {
    await setupAI();
  }

  closeReadline();
}
