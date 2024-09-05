import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
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
export function say(text: string, wrap = 80): void {
  console.log(wrapAnsi(text, wrap));
}

/**
 * Inspects an object and logs its structure to the console.
 * @param obj - The object to inspect.
 */
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
