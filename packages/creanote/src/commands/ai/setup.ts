import { log, question, loadConfig, saveConfig, closeReadline } from "@/utils";
import fs from "fs";
import path from "path";

export async function setupAI(): Promise<boolean> {
  const config = loadConfig();

  log.section("Setting up AI");
  log.info(
    "The AI system allows you to ask questions, chat with an AI model, and create AI-generated notes."
  );
  log.info(
    "You'll need an API key from an OpenAI-compatible service (OpenAI, Anthropic, local models, etc.)."
  );
  console.log();

  // Check if user has an API key
  log.info("Before we continue, do you have an API key from an AI service?");
  log.info("Examples: OpenAI API key, Anthropic API key, or local model endpoint");
  console.log();

  const hasApiKey = await question(
    "Do you have an API key or local model setup? (y/n): "
  );

  if (hasApiKey.toLowerCase() !== "y") {
    console.log();
    log.info(
      "You'll need an API key to use the AI features."
    );
    log.info("Here are some popular options:");
    console.log();
    log.color(
      "  • OpenAI (openai.com) - GPT-4, GPT-3.5-turbo",
      "\x1b[36m"
    );
    log.color(
      "  • Anthropic (anthropic.com) - Claude models",
      "\x1b[36m"
    );
    log.color(
      "  • Local models - Ollama, LM Studio, etc.",
      "\x1b[36m"
    );
    console.log();
    log.info("Steps to get an API key:");
    log.color("  1. Go to one of the services above", "\x1b[34m");
    log.color("  2. Create an account and get an API key", "\x1b[34m");
    log.color("  3. Note down your API key", "\x1b[34m");
    console.log();

    const createAccount = await question(
      "Would you like to get an API key now? (y/n): "
    );
    if (createAccount.toLowerCase() !== "y") {
      log.info(
        "You can come back and set up AI later using 'creanote ai setup'."
      );
      return false;
    } else {
      log.info(
        "Great! Please get your API key and then come back to continue."
      );
      log.info("You can run 'creanote ai setup' again when you're ready.");
      return false;
    }
  }

  ///////////////////////
  // AI CONFIG PROCESS
  ///////////////////////

  console.log();
  log.info("Please provide your AI configuration:");
  console.log();

  // Get model name
  const modelName = await question("Enter model name (e.g., gpt-4, claude-3, llama2): ");

  // Get provider type
  console.log();
  log.info("Provider type:");
  log.color("  • openaiCompatibleApi - For OpenAI, Anthropic, and similar services", "\x1b[34m");
  log.color("  • local - For local models via Ollama, LM Studio, etc.", "\x1b[34m");
  console.log();
  
  const providerType = await question("Enter provider type (openaiCompatibleApi/local): ");

  // Get API URL
  let apiUrl = "";
  if (providerType === "openaiCompatibleApi") {
    apiUrl = await question("Enter API URL (e.g., https://api.openai.com/v1, https://api.anthropic.com): ");
  } else if (providerType === "local") {
    apiUrl = await question("Enter local model URL (e.g., http://localhost:11434/v1): ");
  }

  // Get API key path
  console.log();
  log.info("API Key configuration:");
  log.info("You can store your API key in a .env file or provide the path to a file containing it.");
  console.log();
  
  const apiKeyPath = await question("Enter API key path (default: .env): ") || ".env";

  // Create file if it doesn't exist
  if (apiKeyPath && !fs.existsSync(apiKeyPath)) {
    const apiKey = await question("Enter your API key: ");
    fs.writeFileSync(apiKeyPath, `API_KEY=${apiKey}\n`);
    log.success(`Created ${apiKeyPath} file with your API key`);
  }

  // Configure prompts
  console.log();
  log.info("Configuring AI prompts:");
  console.log();

  const askSystemPrompt = await question("Enter system prompt for 'ask' command (default: You are a helpful assistant.): ") || "You are a helpful assistant.";
  const askUserPrompt = await question("Enter user prompt template for 'ask' command (default: {question}): ") || "{question}";

  const chatSystemPrompt = await question("Enter system prompt for 'chat' command (default: You are a helpful assistant for chatting.): ") || "You are a helpful assistant for chatting.";
  const chatUserPrompt = await question("Enter user prompt template for 'chat' command (default: {message}): ") || "{message}";

  const addSystemPrompt = await question("Enter system prompt for 'add' command (default: You are a helpful assistant that creates notes.): ") || "You are a helpful assistant that creates notes.";
  const addUserPrompt = await question("Enter user prompt template for 'add' command (default: Create a note about: {topic}): ") || "Create a note about: {topic}";

  // Initialize AI settings
  config.settings.ai = {
    llm: {
      modelName,
      provider: {
        type: providerType,
        apiKeyPath,
        apiUrl,
      },
      prompt: {
        ask: {
          system: askSystemPrompt,
          user: askUserPrompt,
        },
        chat: {
          system: chatSystemPrompt,
          user: chatUserPrompt,
        },
        add: {
          system: addSystemPrompt,
          user: addUserPrompt,
        },
      },
    },
  };

  saveConfig(config);

  log.success("AI setup complete!");
  log.info("You can now use:");
  log.color("  • creanote ai ask \"your question\"", "\x1b[34m");
  log.color("  • creanote ai chat", "\x1b[34m");
  log.color("  • creanote ai add", "\x1b[34m");

  closeReadline();
  return true;
} 