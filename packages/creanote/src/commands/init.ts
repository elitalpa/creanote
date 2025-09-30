import fs from "fs";
import path from "path";
import { input, confirm, select } from "@inquirer/prompts";
import simpleGit from "simple-git";
import {
  dailyTemplate,
  noteTemplate,
  excalidrawTemplate,
} from "../data/templates";
import {
  createDefaultConfig,
  saveConfig,
  loadConfig,
  configExists,
  log,
  ensureGitignore,
  ensureEnvInGitignore,
} from "@/utils";
import { Config } from "@/types";

export async function init() {
  try {
    log.section("Starting initialization");

    // Check if already initialized
    if (configExists()) {
      const existingConfig = loadConfig();
      if (!existingConfig) {
        log.error("Invalid config found. Please reinitialize.");
        return;
      }

      // Check what features are missing
      const hasSync = !!existingConfig.settings.sync;
      const hasAI = !!existingConfig.settings.ai;

      if (!hasSync || !hasAI) {
        const missingFeatures = [];
        if (!hasSync) missingFeatures.push("sync");
        if (!hasAI) missingFeatures.push("AI");

        log.info(
          `Creanote is already initialized, but ${missingFeatures.join(" and ")} ${missingFeatures.length === 1 ? "is" : "are"} not set up.`
        );

        const setupMissing = await confirm({
          message: `Would you like to set up the missing ${missingFeatures.join(" and ")} feature${missingFeatures.length === 1 ? "" : "s"}?`,
          default: true,
        });

        if (setupMissing) {
          let config = existingConfig;

          // Setup sync if missing
          if (!hasSync) {
            const setupSync = await confirm({
              message: "Set up sync for your notes?",
              default: true,
            });

            if (setupSync) {
              config = await setupSyncConfiguration(config);
            }
          }

          // Setup AI if missing
          if (!hasAI) {
            const setupAI = await confirm({
              message: "Set up AI for your notes?",
              default: true,
            });

            if (setupAI) {
              config = await setupAIConfiguration(config);
            }
          }

          // Save updated config
          saveConfig(config);
          log.success("Configuration updated successfully");
          return;
        }
      } else {
        log.info("Creanote is already fully initialized with all features.");
      }

      // If user doesn't want to set up missing features or everything is already set up
      const reinitialize = await confirm({
        message: "Do you want to reinitialize instead?",
        default: false,
      });

      if (!reinitialize) {
        log.info("Initialization cancelled");
        return;
      }

      // Show warning and double-check
      log.warning(
        "Reinitializing will delete your current config and reset all settings"
      );
      const confirmReinitialize = await confirm({
        message:
          "Are you sure you want to continue? This action cannot be undone.",
        default: false,
      });

      if (!confirmReinitialize) {
        log.info("Initialization cancelled");
        return;
      }
    }

    log.info("You can press Enter to use default values");
    log.blank();

    // Start with default config
    let config = createDefaultConfig();

    // Setup base path
    const basePath = await input({
      message: "Base path of your notes? (default: ./)",
      default: "./",
    });
    config.settings.basePath = basePath;

    // Setup sync
    const setupSync = await confirm({
      message: "Would you like to set up sync for your notes?",
      default: false,
    });

    if (setupSync) {
      config = await setupSyncConfiguration(config);
    }

    // Setup AI
    const setupAI = await confirm({
      message: "Would you like to set up AI for your notes?",
      default: false,
    });

    if (setupAI) {
      config = await setupAIConfiguration(config);
    }

    // Create directories and templates
    await createTemplateFiles();

    // Save config
    saveConfig(config);

    log.blank();
    log.success("Initialization complete");
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      log.blank();
      log.info("Initialization cancelled");
      process.exit(0);
    } else {
      log.error(
        `Initialization failed: ${error instanceof Error ? error.message : String(error)}`
      );
      process.exit(1);
    }
  }
}

async function setupSyncConfiguration(config: Config): Promise<Config> {
  log.blank();
  log.step(
    "The sync system uses git to keep a version history of your notes and back them up to a remote."
  );
  log.step("Please make sure you have installed git");

  const hasGitAccount = await confirm({
    message:
      "Do you have a git hosting account? (GitHub, GitLab, Codeberg, etc...)",
    default: true,
  });

  if (!hasGitAccount) {
    const provider = await select({
      message: "Choose among the following or search for an alternative:",
      choices: [
        { name: "GitHub (most popular)", value: "github" },
        { name: "GitLab (popular and open source)", value: "gitlab" },
        { name: "Codeberg (more lightweight and minimal)", value: "codeberg" },
      ],
    });

    const accountCreated = await confirm({
      message: "Have you created your account?",
      default: false,
    });

    if (!accountCreated) {
      log.step("Ok, let's continue and you can do it later");
      return config;
    }
  }

  // Get git user info
  log.blank();
  log.step("Please provide your Git user information:");
  log.step(
    "It's recommended to use the same name and email that you set up on your Git hosting account."
  );

  const userName = await input({
    message: "Enter your name:",
    validate: (input) => (input.length > 0 ? true : "Name is required"),
  });

  const userEmail = await input({
    message: "Enter your email:",
    validate: (input) =>
      input.includes("@") ? true : "Valid email is required",
  });

  // Configure git
  try {
    const git = simpleGit();
    await git.addConfig("user.name", userName);
    await git.addConfig("user.email", userEmail);
    log.success("Git configuration updated");
  } catch (error) {
    log.warning(`Could not configure git: ${error}`);
  }

  // Repository setup
  const hasRepository = await confirm({
    message: "Have you created a repository on your git hosting provider?",
    default: false,
  });

  if (!hasRepository) {
    log.step("You can create a repository now.");
    const createdNow = await confirm({
      message: "Created a repository now?",
      default: true,
    });

    if (!createdNow) {
      log.step("Skipping repository setup");
      return config;
    }
  }

  const remoteUrl = await input({
    message: "Enter the remote URL:",
    validate: (input) => (input.length > 0 ? true : "Remote URL is required"),
  });

  const branch = await input({
    message: "Enter the branch name:",
    default: "main",
  });

  // Add sync configuration
  config.settings.sync = {
    user: {
      name: userName,
      email: userEmail,
    },
    remote: {
      url: remoteUrl,
      branch: branch,
    },
  };

  return config;
}

async function setupAIConfiguration(config: Config): Promise<Config> {
  log.blank();
  log.step("The AI feature uses OpenAI compatible APIs.");
  log.step(
    "You can either get API keys from an OpenAI API service (openai, openrouter, claude, etc.)"
  );
  log.step(
    "or run your own local API (LM Studio for example) and use open source AI models"
  );

  const readyToSetup = await confirm({
    message: "Are you ready to setup AI?",
    default: true,
  });

  if (!readyToSetup) {
    log.step("Skipping AI setup");
    return config;
  }

  const baseURL = await input({
    message: "Enter the base URL of the API:",
    default: "http://localhost:1234/v1",
    validate: (input) => (input.length > 0 ? true : "Base URL is required"),
  });

  const apiKey = await input({
    message:
      "Enter your API key (if you have one, might not have one when running a local API):",
    default: "",
  });

  const modelName = await input({
    message: "Enter the model name:",
    default: "google/gemma-3-4b",
  });

  // Add AI configuration
  config.settings.ai = {
    llm: {
      model: {
        name: modelName,
      },
      provider: {
        type: "openaiapi",
        baseURL: baseURL,
        ...(apiKey && {
          apiKey: {
            path: ".creanote/.env",
            variable: "OPENAI_API_KEY",
          },
        }),
      },
      prompt: {
        ask: {
          system: "You are a helpful assistant.",
          user: "{{ask}}",
        },
        chat: {
          system: "You are a helpful assistant for chatting.",
          user: "{{chat}}",
        },
        add: {
          system:
            "You are a helpful assistant that creates notes. Only output the note content in modern markdown with a main heading # title and subheadings ##, nothing else.",
          user: "Create a note about: {{add}}",
        },
      },
    },
  };

  // Create .env file if API key provided
  if (apiKey) {
    const envPath = path.join(process.cwd(), ".creanote", ".env");
    fs.writeFileSync(envPath, `OPENAI_API_KEY=${apiKey}\n`);

    // Ensure .gitignore has .env entries
    ensureEnvInGitignore();

    log.success("API key saved to .creanote/.env");
  }

  return config;
}

async function createTemplateFiles(): Promise<void> {
  const templatesDir = path.join(process.cwd(), ".creanote", "templates");

  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  // Create template files
  fs.writeFileSync(path.join(templatesDir, "daily.md"), dailyTemplate);
  fs.writeFileSync(path.join(templatesDir, "note.md"), noteTemplate);
  fs.writeFileSync(
    path.join(templatesDir, "excalidraw.excalidraw"),
    excalidrawTemplate
  );

  // Create .gitignore file
  ensureGitignore();

  log.success("Template files created");
}
