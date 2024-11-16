/**
 * This is the most basic, non-interactive example of sending a prompt to
 * GPT and showing the results.
 */

import { say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";

const response = await promptGPT("Just say 'yes'", { max_tokens: 5 });
say(`GPT Response: ${response}`);
