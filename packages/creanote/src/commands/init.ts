import fs from "fs";
import path from "path";
import { dailyTemplate, noteTemplate } from "./templates";

export function init() {
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
      },
      addPath: {
        daily: "./daily",
        note: "./",
      },
    },
  };

  fs.writeFileSync(
    path.join(initDirectory, "config.json"),
    JSON.stringify(config, null, 2)
  );

  console.log("Initialization complete.");
}
