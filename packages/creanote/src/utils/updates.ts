import packageJson from "../../package.json" assert { type: "json" };

export async function checkForUpdates(): Promise<string> {
  try {
    const response = await fetch(`https://registry.npmjs.org/creanote/latest`);
    const data = await response.json();
    const latestVersion = data.version;

    if (latestVersion !== packageJson.version) {
      return `new version available: ${latestVersion}\nif using npm, run "npm i -g creanote@latest" to update`;
    } else {
      return "current version is up to date";
    }
  } catch (error) {
    return "couldn't check for updates";
  }
}
