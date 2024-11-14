/**
 * This is the most basic, non-interactive example of sending a prompt to
 * Dall•e and showing the results.
 */

import { say } from "../../shared/cli.ts";
import { promptDalle } from "../../shared/openai.ts";
import { LogLevel, setLogLevel } from "../../shared/logger.ts";
setLogLevel(LogLevel.Debug);

// sent prompt to gpt and relay response
const response = await promptDalle(
  `A cartoon of an gnome in a pointed hat sanding in the woods.
    Bright cheery colors.`,
);

// response is an object with the following properties:
// response.revised_prompt: the expanded prompt that was actually used
// resonse.url: the URL of image generated

say("");
say("URL");
say(response.url);
