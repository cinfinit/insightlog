const logCache = new Map();

function getLogKey(level, context, args) {
  return `${level}|${context.file}|${context.line}|${args.join("|")}`;
}

function trackAndGetRepeatCount(level, context, args) {
  const key = getLogKey(level, context, args);
  const prev = logCache.get(key) || 0;
  const next = prev + 1;
  logCache.set(key, next);
  return next;
}

module.exports = { trackAndGetRepeatCount };
