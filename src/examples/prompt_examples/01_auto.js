/**
 * This is the most basic, non-interactive example of sending a prompt to
 * GPT and showing the results.
 */

import { say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";

// report some information that that may be useful for debugging initial setup
import * as path from "https://deno.land/std@0.214.0/path/mod.ts";
console.log("cwd:", Deno.cwd());
console.log("script:", path.dirname(path.fromFileUrl(import.meta.url)));

// sent prompt to gpt and relay response
const response = await promptGPT("Just say 'yes'");
say(`GPT Response: ${response}`);
