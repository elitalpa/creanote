import fs from "fs";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import { log } from "@/utils";

export function getGit(): SimpleGit {
  return simpleGit(process.cwd());
}

export async function isGitInitialized(): Promise<boolean> {
  try {
    const gitDir = path.join(process.cwd(), ".git");
    return fs.existsSync(gitDir);
  } catch {
    return false;
  }
}

export async function gitInit(): Promise<void> {
  try {
    const git = getGit();
    await git.init();
    // Set default branch to main
    await git.checkoutLocalBranch("main");
    log.success("Git repository initialized (default branch: main)");
  } catch (error) {
    throw new Error("Failed to initialize git repository");
  }
}

export async function gitConfig(name: string, value: string): Promise<void> {
  try {
    const git = getGit();
    await git.addConfig(name, value);
  } catch (error) {
    throw new Error(`Failed to set git config ${name}`);
  }
}

export async function gitAdd(): Promise<void> {
  try {
    log.info("Adding files to git...");
    const git = getGit();
    await git.add(".");
    log.success("All files added to git");
  } catch (error) {
    throw new Error("Failed to add files to git");
  }
}

export async function gitCommit(message: string): Promise<void> {
  try {
    const git = getGit();
    await git.commit(message);
    log.success("Changes committed successfully");
  } catch (error) {
    throw new Error("Failed to commit changes");
  }
}

export async function gitPull(): Promise<void> {
  try {
    const git = getGit();
    const currentBranch = await git.branch();
    await git.pull("origin", currentBranch.current);
    log.success("Pulled latest changes from remote");
  } catch (error) {
    log.warning(
      "Failed to pull from remote (this is normal if remote doesn't exist yet)"
    );
  }
}

export async function gitPush(): Promise<void> {
  try {
    log.info("Pushing changes to remote...");
    const git = getGit();
    const currentBranch = await git.branch();
    await git.push("origin", currentBranch.current);
    log.success("Pushed changes to remote");
  } catch (error) {
    throw new Error(`Failed to push to remote: \n${error}`);
  }
}

export async function gitStatus(): Promise<string> {
  try {
    const git = getGit();
    const status = await git.status();
    const changes: string[] = [];

    // Add new files (staged and unstaged)
    status.created.forEach((file) => changes.push(`A  ${file}`));
    status.not_added.forEach((file) => changes.push(`A  ${file}`));

    // Add modified files (staged and unstaged)
    status.modified.forEach((file) => changes.push(`M  ${file}`));
    status.staged.forEach((file) => changes.push(`M  ${file}`));

    // Add deleted files
    status.deleted.forEach((file) => changes.push(`D  ${file}`));

    return changes.join("\n");
  } catch (error) {
    throw new Error("Failed to get git status");
  }
}

export async function gitRemoteAdd(url: string): Promise<void> {
  try {
    const git = getGit();
    await git.addRemote("origin", url);
    log.success("Remote repository added");
  } catch (error) {
    throw new Error(`Failed to add remote repository\n${error}`);
  }
}

export function parseGitStatus(status: string): {
  added: number;
  modified: number;
  deleted: number;
} {
  const lines = status
    .trim()
    .split("\n")
    .filter((line: string) => line.length > 0);
  let added = 0,
    modified = 0,
    deleted = 0;

  lines.forEach((line: string) => {
    const statusCode = line.substring(0, 2);
    if (statusCode.includes("A")) added++;
    if (statusCode.includes("M")) modified++;
    if (statusCode.includes("D")) deleted++;
  });

  return { added, modified, deleted };
}

export function generateCommitMessage(
  added: number,
  modified: number,
  deleted: number
): string {
  const parts = [];
  if (added > 0) parts.push(`${added} new file${added > 1 ? "s" : ""}`);
  if (modified > 0)
    parts.push(`${modified} file${modified > 1 ? "s" : ""} modified`);
  if (deleted > 0)
    parts.push(`${deleted} file${deleted > 1 ? "s" : ""} deleted`);

  return `Sync: ${parts.join(", ")}`;
}
