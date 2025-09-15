// utils.js

/**
 * Deep clone any object or array.
 */
function deepClone(obj) {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generate a random unique identifier (UUID v4-like).
 */
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Deep merge two objects.
 */
function deepMerge(target, source) {
  const output = { ...target };
  for (const key in source) {
    if (
      Object.prototype.hasOwnProperty.call(source, key) &&
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      output[key] = deepMerge(output[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

/**
 * Capitalize the first letter of a string.
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Debounce function calls.
 */
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function calls.
 */
function throttle(fn, limit = 300) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Format a date to YYYY-MM-DD
 */
function formatDate(date = new Date()) {
  return date.toISOString().split("T")[0];
}

/**
 * Shuffle an array (Fisher–Yates algorithm).
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Colored Logging Utilities
 */
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
  },
};

function logInfo(message) {
  console.log(`${colors.fg.cyan}[INFO]${colors.reset} ${message}`);
}

function logSuccess(message) {
  console.log(`${colors.fg.green}[SUCCESS]${colors.reset} ${message}`);
}

function logWarn(message) {
  console.warn(`${colors.fg.yellow}[WARN]${colors.reset} ${message}`);
}

function logError(message) {
  console.error(`${colors.fg.red}[ERROR]${colors.reset} ${message}`);
}

module.exports = {
  deepClone,
  generateUUID,
  deepMerge,
  capitalize,
  debounce,
  throttle,
  formatDate,
  shuffleArray,
  logInfo,
  logSuccess,
  logWarn,
  logError,
};


// now you can import and use these utilities in your project

/*const utils = require("./utils");

utils.logInfo("Server is starting...");
utils.logSuccess("Database connected!");
utils.logWarn("Memory usage is high!");
utils.logError("Failed to connect to API");
*/