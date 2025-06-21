import { execSync } from "child_process";
import { test, expect } from "vitest";

test("should display the version with -v or --version", () => {
  const versionOutput = execSync(`npm run start -- -v`).toString();
  expect(versionOutput).toMatch(/creanote \d+\.\d+\.\d+/);

  const versionOutputLong = execSync(`npm run start -- --version`).toString();
  expect(versionOutputLong).toMatch(/creanote \d+\.\d+\.\d+/);
});
