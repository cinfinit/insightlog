
const { isBrowser } = require("./env");

const colors = {
  info: { node: "\x1b[36m", browser: "color: cyan" },
  warn: { node: "\x1b[33m", browser: "color: orange" },
  error: { node: "\x1b[31m", browser: "color: red" },
  success: { node: "\x1b[32m", browser: "color: green" },
  reset: "\x1b[0m",
};

function formatLog(level, context, args, repeatCount = 0) {
  const timestamp = new Date().toISOString();
  const location = `[${context.file}:${context.line} ${context.functionName}]`;
  const repeated = repeatCount > 1 ? ` (x${repeatCount})` : "";
  const msg = `${timestamp} ${location}${repeated} → ${args
    .map(String)
    .join(" ")}`;

  if (isBrowser) {
    const style = colors[level]?.browser || "color: gray";
    return {
      msg: `%c[${level.toUpperCase()}] ${msg}`,
      style,
      args,
    };
  } else {
    const color = colors[level]?.node || "";
    return `${color}[${level.toUpperCase()}]${colors.reset} ${msg}`;
  }
}

module.exports = { formatLog };
