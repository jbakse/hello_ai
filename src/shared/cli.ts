import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/input.ts";
import wrapAnsi from "npm:wrap-ansi@9";

/**
 * Prompts the user with a message and returns their input as a string.
 * @param message - The message to display to the user.
 * @returns The user's input as a string.
 */
export async function ask(message = ""): Promise<string> {
  return await Input.prompt(message);
}

/**
 * Outputs the given text to the console, wrapped to the specified width.
 * @param text - The text to output.
 * @param wrap - The column width to wrap the text at.
 */
export function say(text: string, wrap?: number): void {
  wrap = wrap ?? Math.min(Deno.consoleSize().columns, 80);
  console.log(wrapAnsi(text, wrap));
}

/**
 * Logs an object structure and values to the console.
 * @param obj - The object to inspect.
 */
export function inspect(obj: unknown): void {
  console.log(
    Deno.inspect(obj, {
      showHidden: true,
      depth: undefined,
      colors: true,
      compact: false,
    }),
  );
}
