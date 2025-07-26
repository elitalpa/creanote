import readline from "readline";

let rl: readline.Interface | null = null;

export function getReadline(): readline.Interface {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }
  return rl;
}

export function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    getReadline().question(prompt, resolve);
  });
}

export function closeReadline(): void {
  if (rl) {
    rl.close();
    rl = null;
  }
}
