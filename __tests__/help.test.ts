import { execSync } from "child_process";
import { test, expect } from "vitest";

test("should display help with -h or --help", () => {
  const helpOutput = execSync(`npm run start -- -h`, {
    stdio: "pipe",
  }).toString();
  expect(helpOutput).toContain("Usage:");

  const helpOutputLong = execSync(`npm run start -- --help`, {
    stdio: "pipe",
  }).toString();
  expect(helpOutputLong).toContain("Usage:");
});
