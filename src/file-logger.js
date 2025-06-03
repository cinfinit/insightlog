
const { isNode } = require("./env");
let fs, path;
try {
  fs = require("fs");
  path = require("path");
} catch (err) {
  // This block will be skipped in Node,
  // but would prevent crash if accidentally required in browser
}

function logToFile(logObject) {
  if (!isNode) return;

  const logDir = path.resolve(__dirname, "..", "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  // Write to insightLog.json for JSON logs (change from .log to .json)
  const logFile = path.join(logDir, "insightLog.json");

  // Convert log object to JSON string (one line per log)
  const logLine = JSON.stringify(logObject);

  fs.appendFileSync(logFile, logLine + "\n", "utf8");
}

module.exports = { logToFile };
