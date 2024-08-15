/**
 * This is a basic example of sending a prompt to GPT and showing the results.
 */

import { ask, say } from "../../shared/cli.ts";
import { gptPrompt, initOpenAI } from "../../shared/openai.ts";

main();

async function main() {
  initOpenAI();

  while (true) {
    const userQuestion = await ask("What do you want to ask? ");

    if (await isOnTopic(userQuestion)) {
      const result = await gptPrompt(
        `Answer the following question breifly. Constrain your answer to the subject of cats. Be concise, answer in a single phrase or sentence. ${userQuestion}`,
        {
          temperature: 0.8,
        },
      );

      say("");
      say(result);
    } else {
      say("I'm sorry, I can only answer questions about cats.");
    }
  }
}

async function isOnTopic(userQuestion) {
  const result = await gptPrompt(
    `Is the following question related to cats? Answer with "Yes" or "No" only. If the subject is unclear or unspecified answer "Yes". ${userQuestion}`,
    {
      temperature: .0,
    },
  );
  return result.toLowerCase() === "yes";
}
