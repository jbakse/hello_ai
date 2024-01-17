import wrapAnsi from "npm:wrap-ansi@9";

import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";

export function ask(message = "\n> ") {
  return (prompt(message) || "").trim();
}

export function say(text, wrap = 80) {
  console.log(wrapAnsi(text, wrap));
}

export function inspect(obj) {
  console.log(
    Deno.inspect(obj, {
      showHidden: true,
      depth: null,
      colors: true,
      compact: true,
    }),
  );
}
