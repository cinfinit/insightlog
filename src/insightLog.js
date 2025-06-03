const { isBrowser } = require("./env");

const { getContext } = require("./context");
const { formatLog } = require("./formatter");
const { trackAndGetRepeatCount } = require("./memory-cache");


let logToFile = () => {}; // default noop

if (!isBrowser) {
  logToFile = require("./file-logger").logToFile;
}
function log(level = "info", ...args) {
  const context = getContext();
  const count = trackAndGetRepeatCount(level, context, args);
  const timestamp = new Date().toISOString();

  const logObject = {
    timestamp,
    level,
    args,
    context,
    repeatCount: count,
  };

  // Format it just for display
  const formatted = formatLog(level, context, args, count);

  if (isBrowser) {
    console.log(formatted.msg, formatted.style, ...formatted.args);
    // logToFile(logObject);
    fetch("http://localhost:1337/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logObject),
    });
  } else {
    if (level === "warn") console.warn(formatted);
    else if (level === "error") console.error(formatted);
    else console.log(formatted);
    logToFile(logObject); // ✅ write structured log to file
  }
}

log.info = (...args) => log("info", ...args);
log.warn = (...args) => log("warn", ...args);
log.error = (...args) => log("error", ...args);
log.success = (...args) => log("success", ...args);
log.debug = (...args) => log("debug", ...args);

module.exports = { log };
