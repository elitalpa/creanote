#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "../package.json" assert { type: "json" };
import { init } from "./commands/init";
import { add } from "./commands/add";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("creanote")
    .description("CLI tool for your notes")
    .version(
      `creanote ${packageJson.version}`,
      "-v, --version",
      "Display the version number"
    );

  program
    .command("init")
    .description("Initialize creanote in the current directory")
    .action(init);

  program.command("add <type>").description("Add a new note").action(add);

  program.addHelpText(
    "after",
    `
Example usage:
  $ creanote init       // Initialize creanote
  $ creanote add daily  // Add a daily note
  $ creanote add note   // Add a regular note
  $ creanote --v        // Display version
  $ creanote --h        // Display help
`
  );

  program.parse();
}

main();
