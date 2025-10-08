#!/usr/bin/env node

import { Command } from "commander";
import packageJson from "../package.json" assert { type: "json" };
import { init } from "./commands/init";
import { add } from "./commands/add";
import { askAI, chatWithAI, addWithAI } from "./commands/ai";
import { sync } from "./commands/sync";
import { loadConfig, configExists, log, checkForUpdates } from "@/utils";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("creanote")
    .description("CLI tool for your notes")
    .version(
      `creanote ${packageJson.version}\n\n${await checkForUpdates()}`,
      "-v, --version",
      "Display the version number"
    );

  program
    .command("init")
    .description("Initialize creanote in the current directory")
    .action(init);

  program
    .command("add <type>")
    .description("Add a new note")
    .option("--date <date>", "Specify a date for the daily note")
    .option("--filename <filename>", "Specify a custom filename")
    .option("--extension <extension>", "Override the file extension")
    .action((type, options) => {
      // Check config before running add command
      if (!configExists()) {
        log.error("Config not found. Run 'creanote init' first.");
        process.exit(1);
      }

      const config = loadConfig();
      if (!config) {
        log.error("Invalid config. Run 'creanote init' to reset.");
        process.exit(1);
      }

      add(type, options);
    });

  const aiCommand = program.command("ai").description("AI-powered features");

  aiCommand
    .command("ask <question>")
    .description("Ask AI a question")
    .action(async (question) => {
      if (!configExists()) {
        log.error("Config not found. Run 'creanote init' first.");
        process.exit(1);
      }

      await askAI(question);
    });

  aiCommand
    .command("chat")
    .description("Start an interactive chat with AI")
    .action(async () => {
      if (!configExists()) {
        log.error("Config not found. Run 'creanote init' first.");
        process.exit(1);
      }

      await chatWithAI();
    });

  aiCommand
    .command("add <template> <topic>")
    .description("Create a note with AI-generated content")
    .option("--date <date>", "Specify a date for the note")
    .option(
      "--filename <filename>",
      "Specify a custom filename (without extension)"
    )
    .option("--extension <extension>", "Override the file extension")
    .action(async (template, topic, options) => {
      if (!configExists()) {
        log.error("Config not found. Run 'creanote init' first.");
        process.exit(1);
      }

      await addWithAI(template, topic, options);
    });

  program
    .command("sync")
    .description("Sync notes with remote repository")
    .action(async () => {
      if (!configExists()) {
        log.error("Config not found. Run 'creanote init' first.");
        process.exit(1);
      }

      await sync();
    });

  program.addHelpText(
    "after",
    `
Example usage:
  $ creanote init                    // Initialize creanote

  $ creanote add <type>              // Add a note from templates
  $ creanote add daily               // Add a daily note
  $ creanote add daily --date "2 dec 2024"  // Add a daily note for a specific date
  $ creanote add note                // Add a regular note
  $ creanote add note --filename "my-custom-note.md"  // Add a note with custom filename
  $ creanote add excalidraw          // Add an excalidraw file

  $ creanote ai ask "What is a note?"  // Ask AI a question
  $ creanote ai chat                   // Start interactive chat with AI
  $ creanote ai add note "Project planning for mobile app"  // Create AI-generated note

  $ creanote sync                      // Sync notes with remote repository

  $ creanote -v                      // Display version
  $ creanote -h                      // Display help
`
  );

  program.parse();
}

main();
