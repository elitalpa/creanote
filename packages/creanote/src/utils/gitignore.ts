import fs from "fs";
import path from "path";
import { log } from "./log";

const GITIGNORE_CONTENT = `.env
.env*
!.env.example
`;

export function ensureGitignore(): void {
  const creanoteDir = path.join(process.cwd(), ".creanote");
  const gitignorePath = path.join(creanoteDir, ".gitignore");

  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, GITIGNORE_CONTENT);
    log.success("Created .gitignore file");
  }
}

export function ensureEnvInGitignore(): void {
  const creanoteDir = path.join(process.cwd(), ".creanote");
  const gitignorePath = path.join(creanoteDir, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    if (!gitignoreContent.includes(".env")) {
      const updatedContent =
        gitignoreContent +
        `
${GITIGNORE_CONTENT}`;
      fs.writeFileSync(gitignorePath, updatedContent);
      log.success("Updated .gitignore to include .env files");
    }
  } else {
    fs.writeFileSync(gitignorePath, GITIGNORE_CONTENT);
    log.success("Created .gitignore with .env entries");
  }
}
