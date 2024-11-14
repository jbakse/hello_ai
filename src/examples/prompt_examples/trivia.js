/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */
// deno-lint-ignore-file no-await-in-loop

import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";

main();

async function main() {
  say("Hello, Player!");

  const topic = await ask("What do you want to be quized on?");

  const questionsString = await promptGPT(
    `
    Generate 4 questions for a triva game. Do not provide answers.
    The topic is ${topic}.
    provide the questions as a javascript array of strings like this:
    ["question 1", "question 2", "question 3", "question 4"]

    Include only the array, start with [ and end with ].
    `,
    { max_tokens: 1024, temperature: 0.3 },
  );

  let questions = [];
  try {
    questions = JSON.parse(questionsString);
  } catch (_e) {
    say(`Error parsing questions string: "${questionsString}"`);

    return;
  }

  say("");

  for (const q of questions) {
    const a = await ask(q);
    const response = await promptGPT(
      `
    The question was '${q}'.
    The provided answer was '${a}'.
    Was the answer correct?
    Be an easy grader. Accept answers that are close enough. Allow misspellings.
    Answer yes or no. If no, provide the correct answer.
    `,
      { max_tokens: 64, temperature: 0.1 },
    );
    say(response);
    say("");
  }
}
