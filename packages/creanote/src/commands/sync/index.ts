import { question, closeReadline } from "@/utils";
import { log } from "@/utils";
import { loadConfig, saveConfig } from "@/utils";
import {
  gitInit,
  gitRemoteAdd,
  gitPull,
  gitStatus,
  gitPush,
  gitCommit,
  gitAdd,
  isGitInitialized,
  parseGitStatus,
  generateCommitMessage,
} from "./git";
import { setupSync } from "./setup";

async function performSync(): Promise<void> {
  log.section("Syncing Notes");

  const config = loadConfig();

  if (!config.settings.sync) {
    log.warning("Sync is not set up yet.");
    const setupNow = await question(
      "Would you like to set up sync now? (y/n): "
    );
    if (setupNow.toLowerCase() !== "n") {
      const setupResult = await setupSync();
      if (!setupResult) {
        // Setup was cancelled, exit sync completely
        return;
      }
    } else {
      log.info("Sync setup skipped. Run 'creanote sync' again when ready.");
      return;
    }
  }

  ///////////////////////
  // START SYNC PROCESS
  ///////////////////////

  if (!(await isGitInitialized())) {
    log.info("Git repository not initialized. Initializing...");
    await gitInit();
  }

  // Pull latest changes if remote is configured
  if (config.settings.sync?.remote.url) {
    log.info("Pulling latest changes from remote...");
    await gitPull();
  }

  // Check status
  const status = await gitStatus();
  if (!status.trim()) {
    log.info("No changes to sync.");
    await gitPush();
    return;
  }

  // Show changes
  console.log(await gitStatus());

  console.log();
  log.info("Changes detected:");
  const { added, modified, deleted } = parseGitStatus(status);

  if (added > 0)
    log.color(`  📄 ${added} new file${added > 1 ? "s" : ""}`, "\x1b[32m");
  if (modified > 0)
    log.color(
      `  ✏️  ${modified} file${modified > 1 ? "s" : ""} modified`,
      "\x1b[33m"
    );
  if (deleted > 0)
    log.color(
      `  🗑️  ${deleted} file${deleted > 1 ? "s" : ""} deleted`,
      "\x1b[31m"
    );

  // Ask for confirmation
  console.log();
  const proceed = await question(
    "Would you like to sync these changes? (y/n): "
  );
  if (proceed.toLowerCase() === "n") {
    log.info("Sync cancelled.");
    return;
  }

  // Add files
  await gitAdd();

  ///////////////////////
  // COMMIT PROCESS
  ///////////////////////

  // Generate commit message
  const defaultMessage = generateCommitMessage(added, modified, deleted);
  console.log();
  log.info(`Suggested commit message: "${defaultMessage}"`);
  const customMessage = await question(
    "Press Enter to use the suggested message, or type a custom message: "
  );

  const commitMessage = customMessage.trim() || defaultMessage;

  // Commit
  log.info("Creating commit...");
  await gitCommit(commitMessage);

  ///////////////////////
  // PUSH PROCESS
  ///////////////////////

  // Push if remote is configured
  if (config.settings.sync?.remote.url) {
    log.info("Pushing to remote...");
    await gitPush();
  } else {
    console.log();
    log.info("No remote repository configured.");
    const addRemote = await question(
      "Would you like to add a remote repository now? (y/n): "
    );
    if (addRemote.toLowerCase() === "y") {
      const remoteUrl = await question("Enter the remote repository URL: ");
      await gitRemoteAdd(remoteUrl);

      // Initialize sync settings if they don't exist
      if (!config.settings.sync) {
        config.settings.sync = {
          user: { name: "", email: "" },
          remote: { url: "" },
        };
      }

      // Update config
      config.settings.sync.remote.url = remoteUrl;
      saveConfig(config);

      log.info("Pushing to remote...");
      await gitPush();
    } else {
      log.info("Changes are saved locally. You can add a remote later.");
    }
  }

  log.success("Sync completed successfully!");
}

export async function sync(): Promise<void> {
  try {
    await performSync();
  } catch (error) {
    log.error(
      `Sync failed: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  } finally {
    closeReadline();
  }
}

export async function setupSyncFromInit(): Promise<void> {
  try {
    await setupSync();
  } catch (error) {
    log.error(
      `Sync setup failed: ${error instanceof Error ? error.message : String(error)}`
    );
    process.exit(1);
  } finally {
    closeReadline();
  }
}
