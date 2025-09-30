import { confirm, input } from "@inquirer/prompts";
import {
  loadConfig,
  log,
  hasSyncConfigured,
  initializeGitRepo,
  configureGitUser,
  pullFromRemote,
  getGitStatus,
  displayGitStatus,
  formatStatusSummary,
  commitAndPush,
  generateCommitMessage,
} from "@/utils";

export async function sync() {
  try {
    const config = loadConfig();
    if (!config) {
      log.error("Invalid config. Run 'creanote init' to reset.");
      return;
    }

    if (!hasSyncConfigured(config)) {
      log.error("Sync is not configured. Run 'creanote init' to set up sync.");
      return;
    }

    log.section("Starting sync");

    // Initialize git repository if not already initialized
    await initializeGitRepo(config);

    // Configure git user locally
    await configureGitUser(config);

    // Ask if user wants to pull from remote
    const shouldPull = await confirm({
      message: "Sync from remote (git pull)?",
      default: true,
    });

    if (shouldPull) {
      try {
        await pullFromRemote(config);
      } catch (error) {
        log.warning(
          `Pull failed: ${error instanceof Error ? error.message : String(error)}`
        );
        log.info("Continuing with local sync...");
      }
    }

    // Get and display local changes
    const status = await getGitStatus(config);

    // Check if there are any changes to sync (including untracked files)
    const hasChanges =
      status.created.length > 0 ||
      status.not_added.length > 0 ||
      status.modified.length > 0 ||
      status.deleted.length > 0 ||
      status.renamed.length > 0;

    if (!hasChanges) {
      log.info("No local changes to sync");
      return;
    }

    // Display changes
    displayGitStatus(status);

    // Ask if user wants to sync all changes
    const shouldSync = await confirm({
      message: "Sync all these changes to remote?",
      default: true,
    });

    if (!shouldSync) {
      log.info("Sync cancelled");
      return;
    }

    // Ask if user wants custom commit message
    const useCustomMessage = await confirm({
      message: "Use custom commit message?",
      default: false,
    });

    let commitMessage: string;

    if (useCustomMessage) {
      commitMessage = await input({
        message: "Enter commit message:",
        validate: (input) =>
          input.trim().length > 0 ? true : "Commit message cannot be empty",
      });
    } else {
      commitMessage = generateCommitMessage(status);
      log.info(`Using generated message: "${commitMessage}"`);
    }

    // Commit and push changes
    await commitAndPush(config, commitMessage);

    log.blank();
    log.success("Sync completed successfully!");
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      log.blank();
      log.info("Sync cancelled");
    } else {
      log.error(
        `Sync failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
