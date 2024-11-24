import { execSync } from "child_process";
import { test, expect } from "vitest";

test("should show an error when no options are passed", () => {
  try {
    execSync(`npm run start`, { stdio: "pipe" });
  } catch (error: any) {
    const errorOutput = error.stderr.toString();
    expect(errorOutput).toContain("No command or options provided.");
    expect(errorOutput).toContain(
      "Use `creanote --help` for usage instructions."
    );
  }
});
