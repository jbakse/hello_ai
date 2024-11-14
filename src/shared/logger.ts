// this is a pretty simple logging utility
// - provides "pretty" logs at 5 levels: debug, info, log, warn, error
// - can filter logs below a set level
// - logs include the calling site

import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

// The log levels, in order of severity
export enum LogLevel {
  ALL = 5,
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
export const setLogLevel = (level: LogLevel): void => {
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
export const debug = (...msgs: unknown[]): void =>
  _log(5, "bgBlue", "white", "debug", ...msgs);
export const info = (...msgs: unknown[]): void =>
  _log(4, "bgBlue", "white", "info ", ...msgs);
export const log = (...msgs: unknown[]): void =>
  _log(3, "bgWhite", "black", "log  ", ...msgs);
export const warn = (...msgs: unknown[]): void =>
  _log(2, "bgYellow", "black", "warn ", ...msgs);
export const error = (...msgs: unknown[]): void =>
  _log(1, "bgRed", "white", "error", ...msgs);

// PRIVATE
// _log() is the internal logging function used by debug, info, etc.
type BackgroundColor = "bgWhite" | "bgBlue" | "bgYellow" | "bgRed";
type ForegroundColor = "white" | "black";
function _log(
  level: number,
  bgColor: BackgroundColor,
  fgColor: ForegroundColor,
  label: string,
  ...msgs: unknown[]
): void {
  // filter logs below the set level
  if (level > logLevel) return;

  // blank line
  // console.log();

  // get the calling site
  const caller = formatCaller();

  // log the [level] tag and each message
  // msgs.forEach((msg) => {
  console.log(colors[bgColor][fgColor](label), ...msgs, colors.gray(caller));
  // });
}

// PRIVATE
// parses the calling site from the stack trace
function formatCaller(): string {
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
let logLevel = LogLevel.INFO;
