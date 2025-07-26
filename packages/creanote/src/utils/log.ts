export function color(message: string, logColor: string = "\x1b[0m") {
  console.log(`${logColor}${message}\x1b[0m`);
}

export function section(title: string) {
  console.log();
  color(`📁 ${title}`, "\x1b[36m");
  console.log("─".repeat(title.length + 4));
}

export function success(message: string) {
  color(`✅ ${message}`, "\x1b[32m");
}

export function warning(message: string) {
  color(`⚠️  ${message}`, "\x1b[33m");
}

export function error(message: string) {
  color(`❌ ${message}`, "\x1b[31m");
}

export function info(message: string) {
  color(`ℹ️  ${message}`, "\x1b[34m");
}
