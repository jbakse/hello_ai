/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */
import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";

const topic = await ask("What do you want to be quized on?");

const question = await promptGPT(
  `Generate a question for a triva game. The topic is ${topic}.`,
  { max_tokens: 1024, temperature: 0.3 },
);

say(question);

const answer = await ask("What is the answer?");

// ask gpt to evaluate the answer
const response = await promptGPT(
  `The question was '${question}'. The provided answer was '${answer}'. Was the answer correct?`,
);

say(response);

/**
Notes:

UX/UI 1
You can read a question, answer it, and then get feedback on your answer.
- multiple questions
- score keeping
- clearer formatting
- visual feedback on correct/incorrect answers
- difficulty setting
- instructions

AI Tech Use 1
The basics do work!
- tone, length of questions and feedback
- tuning evaluation criteria (allow close, etc)
- generating structured output for reliable parsing of questions and feedback

Javascript 1
It runs.
- many features need to be added
- error handling
- comments

Concept 1
The very basic idea has been shown to be viable.
- refinement of the idea depends on building more features and testing them


*/
