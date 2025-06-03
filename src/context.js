function getContext() {
    const stack = new Error().stack?.split("\n") || [];
  
    // Skip the first line ("Error")
    const frames = stack.slice(1);
  
    // Skip known internal frames (insightLog internals, logger wrappers)
    const callerFrame = frames.find((line) => {
      return (
        !line.includes("insightLog.js") &&
        !line.includes("getContext") &&
        !line.includes("logger") &&
        !line.includes("node_modules") &&
        !line.includes("at log ") && // ⛔ skip log()
        !line.includes("at Object.log ") && // ⛔ skip log.info etc.
        line.includes(".js")
      );
    });
  
    if (!callerFrame)
      return { file: "unknown", line: "?", functionName: "unknown" };
  
    // Match: at functionName (filePath:line:col)
    const matchWithFunc = callerFrame.match(/\s+at\s+(.*?)\s+\((.*):(\d+):\d+\)/);
    const matchWithoutFunc = callerFrame.match(/\s+at\s+(.*):(\d+):\d+/);
  
    if (matchWithFunc) {
      const [, functionName, filePath, line] = matchWithFunc;
      return {
        functionName: cleanFunctionName(functionName),
        file: filePath.split("/").pop(),
        line,
      };
    }
  
    if (matchWithoutFunc) {
      const [, filePath, line] = matchWithoutFunc;
      return {
        functionName: "anonymous",
        file: filePath.split("/").pop(),
        line,
      };
    }
  
    return { file: "unknown", line: "?", functionName: "unknown" };
  }
  
  function cleanFunctionName(fn) {
    if (!fn) return "anonymous";
    return fn
      .replace(/Object\./, "")
      .replace(/\[as .*?\]/, "")
      .replace(/^new /, "")
      .trim();
  }
  
  module.exports = { getContext };
  