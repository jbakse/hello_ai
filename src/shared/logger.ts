// quick stub of a logging framework

import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

type Color = "bgWhite" | "bgBlue" | "bgYellow" | "bgRed";
export enum LogLevel {
  DEBUG = 4,
  INFO = 3,
  WARN = 2,
  ERROR = 1,
}

let logLevel = LogLevel.WARN;

export const setLogLevel = (level: LogLevel) => {
  logLevel = level;
};

export const debug = (msg: unknown) => log(4, "bgBlue", "debug", msg);
export const info = (msg: unknown) => log(3, "bgBlue", "info ", msg);
export const warn = (msg: unknown) => log(2, "bgYellow", "warn ", msg);
export const error = (msg: unknown) => log(1, "bgRed", "error", msg);

function log(level: number, color: Color, label: string, msg: unknown) {
  if (level > logLevel) return;
  console.log(colors.gray(formatCaller()));

  if (typeof msg === "string") {
    console.log(colors[color](label), msg);
  } else {
    console.log(colors[color](label));
    console.log(msg);
  }
  // formatCaller();
}

function formatCaller() {
  const stack = new Error().stack || "";

  const lines = stack.split("\n");
  const callingLine = lines[4]; // find grand caller
  const match = callingLine.match(/at (\S+) \((.*?):(\d+):\d+\)/);
  if (!match || match?.length < 4) return "";

  const functionName = match[1];
  const filePath = match[2];
  const lineNumber = match[3];
  const fileName = filePath.split("/").pop();

  return `${fileName}:${lineNumber} ${functionName}()`;
}

// function logStack(stack = "") {
//   const lines = stack.split("\n");

//   const functionNames = lines
//     .map((line) => {
//       const match = line.match(/at (\S+)/);
//       const fullName = match?.[1] ?? "";
//       return fullName.split(".").pop();
//     })
//     .filter((name) => name) // Remove empty strings
//     .slice(1, -1) // Remove the first and last lines
//     .reverse();
//   console.log(colors.gray(functionNames.join(" » ")));
// }
