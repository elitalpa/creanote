import { execSync } from "child_process";
import { test, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import path from "path";
import { getWeekNumber } from "../src/commands/utils";

function waitForFile(filePath: string, retries = 5, delay = 1000) {
  return new Promise<boolean>((resolve) => {
    let attempts = 0;
    const interval = setInterval(() => {
      if (fs.existsSync(filePath)) {
        clearInterval(interval);
        resolve(true);
      }
      if (attempts >= retries) {
        clearInterval(interval);
        resolve(false);
      }
      attempts++;
    }, delay);
  });
}

beforeAll(() => {
  const configPath = path.join(process.cwd(), ".creanote", "config.json");
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    fs.writeFileSync(
      configPath,
      '{"notesPath": "./notes", "dailyPath": "./daily", "settings": {"templatePath": "./templates", "addPath": "./add"}}'
    );
  }
});

test("should initialize .creanote folder and config file", () => {
  let initOutput = execSync(`npm run start -- init`, {
    stdio: "pipe",
  }).toString();

  if (initOutput.includes("Already initialized")) {
    console.log("Already initialized. Skipping initialization.");
  } else {
    expect(initOutput).toContain("Initialization complete.");
  }

  const configFilePath = path.join(process.cwd(), ".creanote", "config.json");
  expect(fs.existsSync(configFilePath)).toBeTruthy();

  const config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  expect(config).toHaveProperty("settings");
  expect(config.settings).toHaveProperty("templatePath");
  expect(config.settings).toHaveProperty("addPath");

  fs.rmSync(path.join(process.cwd(), ".creanote"), {
    recursive: true,
    force: true,
  });
});

test("should add a daily note", async () => {
  let initOutput = execSync(`npm run start -- init`, {
    stdio: "pipe",
  }).toString();

  if (initOutput.includes("Already initialized")) {
    console.log("Already initialized. Skipping initialization.");
  } else {
    expect(initOutput).toContain("Initialization complete.");
  }

  const addDailyOutput = execSync(`npm run start -- add daily`, {
    stdio: "pipe",
  }).toString();

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dailyNotePath = path.join(
    process.cwd(),
    "daily",
    `${year}`,
    `${year}-${month}`,
    `week-${getWeekNumber(date)}`,
    `${year}-${month}-${day}.md`
  );

  const fileExists = await waitForFile(dailyNotePath);
  expect(fileExists).toBeTruthy();

  fs.rmSync(path.dirname(dailyNotePath), { recursive: true, force: true });
});

afterAll(() => {
  fs.rmSync(path.join(process.cwd(), ".creanote"), {
    recursive: true,
    force: true,
  });
});
