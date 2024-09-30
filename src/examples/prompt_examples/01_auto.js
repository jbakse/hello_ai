/**
 * This is the most basic, non-interactive example of sending a prompt to
 * GPT and showing the results.
 */

import { say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";
import { LogLevel, setLogLevel } from "../../shared/logger.ts";
setLogLevel(LogLevel.Debug);

// sent prompt to gpt and relay response
const response = await promptGPT("Just say 'yes'", { max_tokens: 5 });
say(`GPT Response: ${response}`);
