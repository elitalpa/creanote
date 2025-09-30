// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
} as const;

function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

export const log = {
  // Basic colored output
  color: {
    red: (text: string) => console.log(colorize(text, "red")),
    green: (text: string) => console.log(colorize(text, "green")),
    yellow: (text: string) => console.log(colorize(text, "yellow")),
    blue: (text: string) => console.log(colorize(text, "blue")),
    magenta: (text: string) => console.log(colorize(text, "magenta")),
    cyan: (text: string) => console.log(colorize(text, "cyan")),
    white: (text: string) => console.log(colorize(text, "white")),
    gray: (text: string) => console.log(colorize(text, "gray")),
  },

  // Semantic logging with prefixes
  info: (message: string) => {
    console.log(`${colorize("i", "blue")} ${message}`);
  },

  success: (message: string) => {
    console.log(`${colorize("✓", "green")} ${message}`);
  },

  warning: (message: string) => {
    console.log(`${colorize("!", "yellow")} ${message}`);
  },

  error: (message: string) => {
    console.log(`${colorize("✗", "red")} ${message}`);
  },

  section: (title: string) => {
    console.log(`\n${colorize("▶", "cyan")} ${colorize(title, "bright")}`);
  },

  // Utility functions
  blank: () => console.log(""),

  step: (message: string) => {
    console.log(`  ${colorize("•", "gray")} ${message}`);
  },

  prompt: (message: string) => {
    process.stdout.write(`${colorize("?", "magenta")} ${message} `);
  },
};
