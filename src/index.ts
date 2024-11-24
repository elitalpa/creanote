#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "../package.json" assert { type: "json" };

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("creanote")
    .description("CLI tool for your notes")
    .version(
      `creanote ${packageJson.version}`,
      "-v, --version",
      "display the version number"
    );

  program.addHelpText(
    "after",
    `
Example usage:
  $ creanote --v
  $ creanote --h
`
  );

  program.parse();

  const options = program.opts();
  if (Object.keys(options).length === 0) {
    console.log("");
    console.log(`creanote ${packageJson.version}`);
    console.log("");
    console.error("No command or options provided.");
    console.error("Use `creanote --help` for usage instructions.");
    process.exit(1);
  }
}

main();
