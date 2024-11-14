/**
 * trivia.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */
import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";
import { LogLevel, setLogLevel } from "../../shared/logger.ts";

// hide DEBUG and INFO logs
setLogLevel(LogLevel.LOG);

async function main() {
  // greet the player, ask for a topic
  say("Hello, Player!");
  const topic = await ask("What do you want to be quized on?");

  // generate questions
  // note: this would be a good place to use "structure responses" which we'll
  // talk about later in the course
  const questionsString = await promptGPT(
    `Generate 4 questions for a trivia game. Do not provide answers.
     Provide the questions as a javascript array of strings like this:
     ["question 1", "question 2", "question 3", "question 4"]
     Include only the array, start with [ and end with ].
     The topic is ${topic}.
    `,
    { max_tokens: 1024, temperature: .3 },
  );

  // gpt returns a string, we need to parse it to get a usable array
  let questions = [];
  try {
    questions = JSON.parse(questionsString);
  } catch (_e) {
    say(`Error parsing questions string: "${questionsString}"`);
    return;
  }

  // output blank line
  say("");

  // loop through each question
  for (const q of questions) {
    // ask the user for an answer
    const a = await ask(q);

    // ask gpt to evaluate the answer
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

    // report the response
    say(response);
    say("");
  }
}

main();

/**
Notes:

UX/UI 2
Multiple questions are generated and asked.
- score keeping
- clearer formatting
- visual feedback on correct/incorrect answers
- difficulty setting
- instructions

AI Tech Use 2
The basics do work! But it output format fails to parse sometimes.
- tone, length of questions and feedback
- tuning evaluation criteria (allow close, etc)
- generating structured output for reliable parsing of questions and feedback

Javascript 2
Most important features are working, but sometimes bug out.
- work with structured data
- error handling
- comments

Concept 2
Arguably "LLM+", you can still get pretty much the same with an LLM.
- Better UX/UI will help with the "+" part.
- good time for user testing.


*/
