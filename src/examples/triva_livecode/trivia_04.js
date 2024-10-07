/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 */

import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { zodResponseFormat } from "https://deno.land/x/openai@v4.67.2/helpers/zod.ts";

import boxen from "npm:boxen@latest";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/colors.ts";

import { ask, say } from "../../shared/cli.ts";
import { promptGPT } from "../../shared/openai.ts";
import { LogLevel, setLogLevel } from "../../shared/logger.ts";
import * as log from "../../shared/logger.ts";

// set min level to show DEBUG < INFO < LOG < WARN < ERROR
setLogLevel(LogLevel.LOG);

async function generateQuestions(topic) {
  const Questions = z.object({
    questions: z.array(z.string()),
  });

  const response = await promptGPT(
    `Generate 4 questions for a triva game. Do not provide answers. The topic is ${topic}.`,
    {
      max_tokens: 1024,
      temperature: 0.3,
      response_format: zodResponseFormat(Questions, "questions"),
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
  const Evaluation = z.object({
    isCorrect: z.boolean(),
    comment: z.string(),
  });

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
      response_format: zodResponseFormat(Evaluation, "evaluation"),
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
  // Hide the cursor
  
  console.clear();

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
  say("");

  // game loop
  for (const [i, question] of questions.entries()) {
    const questionNumber = colors.blue(
      `Question ${i + 1} of ${questions.length}`,
    );
    const answer = await ask(`${questionNumber} ${question}`);
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
