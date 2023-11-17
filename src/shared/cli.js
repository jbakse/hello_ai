import util from "util";
import wrapAnsi from "wrap-ansi";

import * as readline from "readline/promises";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export async function ask(prompt = "\n> ") {
  return await rl.question(prompt);
}

export function end() {
  rl.close();
}

export function say(text, wrap = 80) {
  console.log(wrapAnsi(text, wrap));
}

export function inspect(obj) {
  console.log(
    util.inspect(obj, {
      showHidden: true,
      depth: null,
      colors: true,
      compact: true,
    }),
  );
}
