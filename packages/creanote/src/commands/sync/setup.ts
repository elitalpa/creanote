import { log, question, loadConfig, saveConfig } from "@/utils";
import { gitInit, gitConfig, gitRemoteAdd, isGitInitialized } from "./git";

export async function setupSync(): Promise<boolean> {
  const config = loadConfig();

  log.section("Setting up Sync");
  log.info(
    "The sync system uses Git to create a history of your changes and push to a remote repository."
  );
  log.info(
    "This allows you to backup your notes and access them from multiple devices."
  );
  console.log();

  // Check if user has a Git hosting account
  log.info("Before we continue, do you have a Git hosting account?");
  log.info("Examples: GitHub, GitLab, Codeberg, etc.");
  console.log();

  const hasAccount = await question(
    "Do you have a Git hosting account? (y/n): "
  );

  if (hasAccount.toLowerCase() !== "y") {
    console.log();
    log.info(
      "You'll need a Git hosting account to sync your notes to the cloud."
    );
    log.info("Here are some popular options:");
    console.log();
    log.color(
      "  • GitHub (github.com) - Most popular, free for public repos",
      "\x1b[36m"
    );
    log.color(
      "  • GitLab (gitlab.com) - Free for public and private repos",
      "\x1b[36m"
    );
    log.color(
      "  • Codeberg (codeberg.org) - Open source focused, free",
      "\x1b[36m"
    );
    console.log();
    log.info("Steps to create an account:");
    log.color("  1. Go to one of the websites above", "\x1b[34m");
    log.color("  2. Click 'Sign up' or 'Create account'", "\x1b[34m");
    log.color("  3. Follow the registration process", "\x1b[34m");
    log.color("  4. Create a new repository for your notes", "\x1b[34m");
    console.log();

    const createAccount = await question(
      "Would you like to create an account now? (y/n): "
    );
    if (createAccount.toLowerCase() !== "y") {
      log.info(
        "You can still set up local sync (without cloud backup) or come back later."
      );
      const continueLocal = await question(
        "Continue with local sync only? (y/n): "
      );
      if (continueLocal.toLowerCase() !== "y") {
        log.info(
          "Sync setup cancelled. You can run 'creanote sync' again when ready."
        );
        return false;
      }
    } else {
      log.info(
        "Great! Please create your account and then come back to continue."
      );
      log.info(
        "Remember to note down your username and email from your account."
      );
      log.info("You can run 'creanote sync' again when you're ready.");
      return false;
    }
  } else {
    console.log();
  }

  ///////////////////////
  // GIT CONFIG PROCESS
  ///////////////////////

  // Get user information
  console.log();
  log.info("Please provide your Git user information:");
  log.info(
    "It's recommended to use the same name and email as your Git hosting account."
  );
  console.log();

  const userName = await question("Enter your name: ");
  const userEmail = await question("Enter your email: ");

  if (!(await isGitInitialized())) {
    log.info("Initializing Git repository...");
    await gitInit();
  } else {
    log.info("Git repository already initialized");
  }

  // Configure git
  await gitConfig("user.name", userName);
  await gitConfig("user.email", userEmail);
  log.success("Git user configuration set");

  // Initialize sync settings if they don't exist
  // if (!config.settings.sync) {
  //   config.settings.sync = {
  //     user: { name: "", email: "" },
  //     remote: { url: "" }
  //   };
  // }

  // config.settings.sync = {
  //   ...config.settings.sync,
  //   user: {
  //     ...config.settings.sync?.user,
  //     name: userName,
  //     email: userEmail
  //   }
  // };
  config.settings.sync = {
    user: { name: userName, email: userEmail },
    remote: { url: config.settings.sync?.remote.url || "" },
  };
  saveConfig(config);

  ///////////////////////
  // REMOTE URL PROCESS
  ///////////////////////

  // Ask about remote URL
  console.log();
  log.info("You can add a remote repository URL now or later.");
  log.info("Examples: https://github.com/username/notes.git");
  log.info("          https://gitlab.com/username/notes.git");
  log.info("          https://codeberg.org/username/notes.git");
  console.log();

  const addRemoteNow = await question(
    "Would you like to add a remote URL now? (y/n): "
  );

  let remoteUrl = "";
  if (addRemoteNow.toLowerCase() === "y") {
    console.log();
    log.info("Before adding a remote URL, make sure you have:");
    log.color(
      "  • Created a repository on your Git hosting service",
      "\x1b[34m"
    );
    log.color("  • Copied the repository URL", "\x1b[34m");
    console.log();

    const hasRepo = await question(
      "Have you created a repository for your notes? (y/n): "
    );
    if (hasRepo.toLowerCase() !== "y") {
      log.info("Please create a repository first:");
      log.color(
        "  1. Go to your Git hosting service (GitHub, GitLab, etc.)",
        "\x1b[34m"
      );
      log.color(
        "  2. Click 'New repository' or 'Create repository'",
        "\x1b[34m"
      );
      log.color(
        "  3. Name it something like 'notes' or 'my-notes'",
        "\x1b[34m"
      );
      log.color("  4. Make it public or private (your choice)", "\x1b[34m");
      log.color("  5. Copy the repository URL", "\x1b[34m");
      console.log();
      log.info("You can add the remote URL later using the sync command.");
    } else {
      remoteUrl = await question("Enter the remote repository URL: ");
      await gitRemoteAdd(remoteUrl);
      // Update config
      config.settings.sync.remote.url = remoteUrl;
      saveConfig(config);
    }
  }

  log.success("Sync setup complete!");
  if (remoteUrl) {
    log.info("Your notes will be synced with the remote repository.");
  } else {
    log.info("You can add a remote URL later using the sync command.");
  }

  return true;
}
