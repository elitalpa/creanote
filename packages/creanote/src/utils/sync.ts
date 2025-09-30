import simpleGit, { SimpleGit, StatusResult } from "simple-git";
import { Config } from "@/types";
import { log } from "./log";

export function hasSyncConfigured(config: Config): boolean {
  return !!(
    config.settings.sync?.user?.name &&
    config.settings.sync?.user?.email &&
    config.settings.sync?.remote?.url
  );
}

export function createGitClient(config: Config): SimpleGit | null {
  if (!hasSyncConfigured(config)) {
    return null;
  }

  const git = simpleGit(process.cwd());
  return git;
}

export async function configureGitUser(config: Config): Promise<void> {
  if (!hasSyncConfigured(config)) {
    throw new Error("Sync is not configured");
  }

  const git = createGitClient(config)!;
  const syncConfig = config.settings.sync!;

  try {
    await git.addConfig("user.name", syncConfig.user.name);
    await git.addConfig("user.email", syncConfig.user.email);
    log.success(
      `Git user configured: ${syncConfig.user.name} <${syncConfig.user.email}>`
    );
  } catch (error) {
    throw new Error(`Failed to configure git user: ${error}`);
  }
}

export async function initializeGitRepo(config: Config): Promise<void> {
  const git = createGitClient(config);
  if (!git) {
    throw new Error("Sync is not configured");
  }

  try {
    // Check if git is already initialized
    const isRepo = await git.checkIsRepo();
    if (!isRepo) {
      // Initialize git repository
      await git.init();
      log.success("Initialized git repository");
    } else {
      log.info("Git repository already initialized");
    }
  } catch (error) {
    throw new Error(`Failed to initialize git repository: ${error}`);
  }
}

export async function pullFromRemote(config: Config): Promise<boolean> {
  const git = createGitClient(config);
  if (!git) {
    throw new Error("Sync is not configured");
  }

  const syncConfig = config.settings.sync!;

  try {
    log.info("Pulling changes from remote...");

    // Pull directly from the URL without setting up remote
    const result = await git.pull(
      syncConfig.remote.url,
      syncConfig.remote.branch
    );

    if (result.summary.changes > 0) {
      log.success(`Pulled ${result.summary.changes} changes from remote`);
      return true;
    } else {
      log.info("Already up to date with remote");
      return false;
    }
  } catch (error) {
    // Handle common cases for new repositories
    const errorMessage = String(error);
    if (
      errorMessage.includes("couldn't find remote ref") ||
      errorMessage.includes("does not exist") ||
      errorMessage.includes("Could not read from remote repository") ||
      errorMessage.includes("repository not found") ||
      errorMessage.includes("remote repository is empty")
    ) {
      log.info(
        "Remote repository is empty or branch doesn't exist yet, skipping pull"
      );
      return false;
    }
    throw new Error(`Failed to pull from remote: ${error}`);
  }
}

export async function getGitStatus(config: Config): Promise<StatusResult> {
  const git = createGitClient(config);
  if (!git) {
    throw new Error("Sync is not configured");
  }

  try {
    return await git.status();
  } catch (error) {
    throw new Error(`Failed to get git status: ${error}`);
  }
}

export function formatStatusSummary(status: StatusResult): string {
  const parts = [];

  // Count all types of changes including untracked files
  const totalNew = status.created.length + status.not_added.length;
  const totalModified = status.modified.length;
  const totalDeleted = status.deleted.length;
  const totalRenamed = status.renamed.length;

  if (totalNew > 0) {
    parts.push(`${totalNew} new`);
  }

  if (totalModified > 0) {
    parts.push(`${totalModified} modified`);
  }

  if (totalDeleted > 0) {
    parts.push(`${totalDeleted} deleted`);
  }

  if (totalRenamed > 0) {
    parts.push(`${totalRenamed} renamed`);
  }

  return parts.length > 0 ? parts.join(", ") : "no changes";
}

export function displayGitStatus(status: StatusResult): void {
  log.blank();
  log.section("Local Changes");

  // Show all new files (created + untracked)
  const allNewFiles = [...status.created, ...status.not_added];
  if (allNewFiles.length > 0) {
    log.info("New files:");
    allNewFiles.forEach((file) => log.step(`+ ${file}`));
  }

  if (status.modified.length > 0) {
    log.info("Modified files:");
    status.modified.forEach((file) => log.step(`~ ${file}`));
  }

  if (status.deleted.length > 0) {
    log.info("Deleted files:");
    status.deleted.forEach((file) => log.step(`- ${file}`));
  }

  if (status.renamed.length > 0) {
    log.info("Renamed files:");
    status.renamed.forEach((file) => log.step(`→ ${file.from} → ${file.to}`));
  }

  const summary = formatStatusSummary(status);
  log.blank();
  log.info(`Summary: ${summary}`);
}

export async function commitAndPush(
  config: Config,
  message: string
): Promise<void> {
  const git = createGitClient(config);
  if (!git) {
    throw new Error("Sync is not configured");
  }

  const syncConfig = config.settings.sync!;

  try {
    // Add all changes
    await git.add(".");
    log.success("Staged all changes");

    // Commit
    await git.commit(message);
    log.success(`Committed changes: "${message}"`);

    // Push directly to the URL without setting up remote
    log.info("Pushing to remote...");
    await git.push(syncConfig.remote.url, syncConfig.remote.branch);
    log.success("Successfully pushed to remote");
  } catch (error) {
    throw new Error(`Failed to commit and push: ${error}`);
  }
}

export function generateCommitMessage(status: StatusResult): string {
  const summary = formatStatusSummary(status);

  return `Saving notes: ${summary}`;
}
