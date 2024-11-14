/**
 * This example answers questions about cats. It checks if the question is
 * about cats before answering.
 */

// deno-lint-ignore-file no-await-in-loop

import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";

console.log("Exit with ctrl-c");

// keep repeating until the user exits

while (true) {
  const userQuestion = await ask("What do you want to ask? ");

  // reject question if it is not about cats

  if (!await isAboutCats(userQuestion)) {
    say("");
    say("I'm sorry, I can only answer questions about cats.");
    continue; // go to top of loop
  }

  // answer the question

  const answer = await promptGPT(
    `Answer the following question breifly. Constrain your answer to the subject of cats. Be concise, answer in a single phrase or sentence. ${userQuestion}`,
    {
      temperature: 0.8,
    },
  );
  say("");
  say(answer);
}

// is about cats asks the LLM to determine if the question is about cats
async function isAboutCats(userQuestion) {
  const result = await promptGPT(
    `Is the following question related to cats? Answer with "Yes" or "No" only. If the subject is unclear or unspecified answer "Yes". ${userQuestion}`,
    {
      temperature: .0,
    },
  );

  // remove leading or trailing whitespace and convert to lowercase
  // returns true iff the result is then "yes"
  return result.trim().toLowerCase() === "yes";
}
