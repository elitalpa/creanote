import { ask } from "./ask";
import { chat } from "./chat";
import { add } from "./add";
import { setupAI } from "./setup";
import { loadConfig } from "@/utils";

export async function ai(subcommand: string, options: { question?: string }) {
  const config = loadConfig();

  switch (subcommand) {
    case "ask":
      await ask(config, options.question);
      break;
    case "chat":
      await chat(config);
      break;
    case "add":
      await add(config);
      break;
    case "setup":
      await setupAI();
      break;
    default:
      console.error(`Invalid AI subcommand: ${subcommand}`);
      console.error("Available subcommands: ask, chat, add, setup");
      process.exit(1);
  }
} 