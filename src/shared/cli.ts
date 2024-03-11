import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import wrapAnsi from "npm:wrap-ansi@9";

export async function ask(message = ""): Promise<string> {
  return await Input.prompt(message);
}

export function say(text: string, wrap = 80): void {
  console.log(wrapAnsi(text, wrap));
}

export function inspect(obj: unknown): void {
  console.log(
    Deno.inspect(obj, {
      showHidden: true,
      depth: undefined,
      colors: true,
      compact: true,
    }),
  );
}
