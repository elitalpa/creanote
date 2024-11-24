import fs from "fs";
import path from "path";

export function init() {
  const initDirectory = path.join(process.cwd(), ".creanote");

  if (fs.existsSync(initDirectory)) {
    console.log("Already initialized");
    process.exit(0);
  }

  const templatesDir = path.join(process.cwd(), "src", "templates");

  if (!fs.existsSync(templatesDir)) {
    console.log(
      "Templates directory does not exist. Ensure the 'src/templates' folder exists."
    );
    process.exit(1);
  }

  fs.mkdirSync(path.join(initDirectory, "templates"), { recursive: true });

  const dailyTemplatePath = path.join(templatesDir, "default", "daily.md");
  const noteTemplatePath = path.join(templatesDir, "default", "note.md");

  if (fs.existsSync(dailyTemplatePath)) {
    fs.copyFileSync(
      dailyTemplatePath,
      path.join(initDirectory, "templates", "daily.md")
    );
  } else {
    console.log("daily.md not found in templates/default.");
    process.exit(1);
  }

  if (fs.existsSync(noteTemplatePath)) {
    fs.copyFileSync(
      noteTemplatePath,
      path.join(initDirectory, "templates", "note.md")
    );
  } else {
    console.log("note.md not found in templates/default.");
    process.exit(1);
  }

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
