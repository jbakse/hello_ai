// this is a pretty simple logging utility
// - provides "pretty" logs at 5 levels: debug, info, log, warn, error
// - can filter logs below a set level
// - logs include the calling site

import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

// The log levels, in order of severity
export enum LogLevel {
  DEBUG = 5,
  INFO = 4,
  LOG = 3,
  WARN = 2,
  ERROR = 1,
}

/**
 * Sets the log level.
 *
 * @param level - The log level to set. Use the enum, e.g. LogLevel.DEBUG.
 */
export const setLogLevel = (level: LogLevel) => {
  logLevel = level;
};

/**
 * debug(), info(), log(), warn(), and error() are the logging functions.
 *
 * They take a string or object to log, filter logs below the set level, and
 * output a pretty formatted log message.
 *
 * @param msg - The message to be logged.
 */
export const debug = (...msgs: unknown[]) =>
  _log(5, "bgBlue", "debug", ...msgs);
export const info = (...msgs: unknown[]) => _log(4, "bgBlue", "info ", ...msgs);
export const log = (...msgs: unknown[]) => _log(3, "bgWhite", "log  ", ...msgs);
export const warn = (...msgs: unknown[]) =>
  _log(2, "bgYellow", "warn ", ...msgs);
export const error = (...msgs: unknown[]) => _log(1, "bgRed", "error", ...msgs);

// PRIVATE
// _log() is the internal logging function used by debug, info, etc.
type Color = "bgWhite" | "bgBlue" | "bgYellow" | "bgRed";
function _log(level: number, color: Color, label: string, ...msgs: unknown[]) {
  // filter logs below the set level
  if (level > logLevel) return;

  // blank line
  console.log();

  // log the calling site
  console.log(colors.gray(formatCaller()));

  // log the [level] tag and each message
  msgs.forEach((msg) => {
    console.log(colors[color](label), msg);
  });
}

// PRIVATE
// parses the calling site from the stack trace
function formatCaller() {
  // get string describing the stack
  const stack = new Error().stack || "";

  // look at the 4th line which should be the location that debug/log/etc was
  // called from
  const lines = stack.split("\n");
  const callingLine = lines[4]; // find grand caller

  // use regex to parse out the data
  const match = callingLine.match(/at (\S*?\s)?\(?(.*?:.*?):(.*?):(.*?)\)?$/);

  // if we can't parse the line, return an empty string
  if (!match || match?.length < 5) return "";

  // if we can parse the line, return a formatted string
  const functionName = match[1] ? match[1].trim() + "()" : "";
  const filePath = match[2];
  const lineNumber = match[3];
  const fileName = filePath.split("/").pop();
  return `${fileName}:${lineNumber} ${functionName}`;
}

// set the default log level
let logLevel = LogLevel.LOG;
