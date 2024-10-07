/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */

// imports for defining response schema

// used for pretty prompting
import { Input } from "https://deno.land/x/cliffy@v1.0.0-rc.4/prompt/input.ts";

// used for pretty output
import boxen from "npm:boxen@latest";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/colors.ts";

// shared utilities
import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";
import { LogLevel, setLogLevel } from "../../shared/logger.ts";
// import * as log from "../../shared/logger.ts";

// set min level to show DEBUG < INFO < LOG < WARN < ERROR
setLogLevel(LogLevel.LOG);

async function generateQuestions(topic) {
  // schema for { questions: ["xyz", "xyz"] }

  // zod version
  // const Questions = z.object({
  //   questions: z.array(z.string()),
  // });

  // json version
  const question_schema = {
    name: "questions",
    schema: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
    },
  };

  const response = await promptGPT(
    `Generate 4 questions for a triva game. Do not provide answers. The topic is ${topic}.`,
    {
      max_tokens: 1024,
      temperature: .3,
      response_format: {
        "type": "json_schema",
        "json_schema": question_schema,
      },
    },
    {
      showStats: false,
      loadingMessage: "Generating questions...",
      successMessage: "Questions generated.",
    },
  );

  return response.questions;
}

async function evaluateAnswer(question, answer) {
  // schema for { isCorrect: true, comment: "xyz" }

  // zod version
  // const Evaluation = z.object({
  //   isCorrect: z.boolean(),
  //   comment: z.string(),
  // });

  // json version
  const evaluation_schema = {
    name: "evaluation",
    schema: {
      type: "object",
      properties: {
        isCorrect: {
          type: "boolean",
        },
        comment: {
          type: "string",
        },
      },
      required: ["isCorrect", "comment"],
    },
  };

  const response = await promptGPT(
    `The question was '${question}'.
    The provided answer was '${answer}'.
    Was the answer correct?
    Be an easy grader. Accept answers that are close enough.
    If the answer is incorrect, provide a comment that explains the correct answer in less than 20 words.
    `,
    {
      max_tokens: 128,
      temperature: 0.1,
      response_format: {
        "type": "json_schema",
        "json_schema": evaluation_schema,
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
  console.clear();
  console.log(
    boxen("Welcome to Trivia!", {
      borderColor: "blue",

      borderStyle: "round",
      padding: 1,
    }),
  );

  // user configuration
  const topic = await Input.prompt({
    message: "What do you want to be quized on?",
    suggestions: ["history", "science", "literature", "art", "music", "sports"],
  });

  // generate quiz
  const questions = await generateQuestions(topic);
  say("");

  // game loop
  let score = 0;
  for (const [i, question] of questions.entries()) {
    const questionNumber = colors.blue(
      `Question ${i + 1} of ${questions.length}`,
    );
    const answer = await ask(`${questionNumber} ${question}`);
    const evaluation = await evaluateAnswer(question, answer);
    if (evaluation.isCorrect) {
      say(colors.green("Correct!"));
      score++;
    } else {
      say(colors.red("Incorrect!"));
    }
    say(evaluation.comment);
    say("");
  }

  // show final score
  console.log(
    boxen(`You got ${score} out of ${questions.length} questions correct.`, {
      borderColor: "blue",
      title: score >= 3 ? "Congratulations!" : "Final Score",
      borderStyle: "round",
      padding: 1,
    }),
  );
}

main();
