/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */
import boxen from "npm:boxen@latest";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/colors.ts";

import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";
import { LogLevel, setLogLevel } from "../../shared/logger.ts";
import * as log from "../../shared/logger.ts";

// hide DEBUG and INFO logs
setLogLevel(LogLevel.LOG);

async function generateQuestions(topic) {
  // schema for
  // { questions: ["question 1", "question 2", "question 3", "question 4"] }

  const questionSchema = {
    "name": "questions",
    "schema": {
      "type": "object",
      "properties": {
        "questions": {
          "type": "array",
          "items": {
            "type": "string",
          },
        },
      },
      "required": [
        "questions",
      ],
    },
  };

  const response = await promptGPT(
    `Generate 4 questions for a triva game. Do not provide answers.
    The topic is ${topic}.
    `,
    {
      max_tokens: 1024,
      temperature: 0.3,
      response_format: {
        "type": "json_schema",
        "json_schema": questionSchema,
      },
    },
    {
      showStats: false,
      loadingMessage: "Generating questions...",
      successMessage: "Questions generated.",
    },
  );

  //log.log("response", response);

  return response.questions;
}

async function evaluateAnswer(question, answer) {
  const evaluationSchema = {
    "name": "evaluation",
    "schema": {
      "type": "object",
      "properties": {
        "isCorrect": {
          "type": "boolean",
        },
        "comment": {
          "type": "string",
        },
      },
      "required": [
        "isCorrect",
        "comment",
      ],
    },
  };

  const response = await promptGPT(
    `The question was '${question}'.
The provided answer was '${answer}'.
Was the answer correct?
Be an easy grader. Accept answers that are close enough. Allow misspellings.
If the answer was not correct, include a brief comment to help the player understand why. Comments should be 15 words or less!
`,
    {
      max_tokens: 128,
      temperature: 0.1,
      response_format: {
        "type": "json_schema",
        "json_schema": evaluationSchema,
      },
    },
    {
      showStats: false,
      loadingMessage: "Evaluating...",
      successMessage: "",
    },
  );

  return response;
}

async function main() {
  // greet the player
  console.log(
    boxen("Welcome to Trivia!", {
      borderColor: "blue",

      borderStyle: "round",
      padding: 1,
    }),
  );

  // user configuration
  const topic = await ask("What do you want to be quized on?");

  // generate quiz
  const questions = await generateQuestions(topic);
  log.info("questions", questions);
  say("");

  // game loop
  for (const [i, question] of questions.entries()) {
    const questionNumber = colors.blue(
      `Question ${i + 1} of ${questions.length}`,
    );
    const answer = await ask(
      `${questionNumber} ${question}`,
    );
    const evaluation = await evaluateAnswer(question, answer);
    if (evaluation.isCorrect) {
      say(colors.green("Correct!"));
    } else {
      say(colors.red("Incorrect!"));
    }
    say(evaluation.comment);
    say("");
  }
}

main();
