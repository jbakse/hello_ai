import { Chalk } from "npm:chalk@5";
const chalk = new Chalk({ level: 1 });
import figlet from "npm:figlet@1.6.0";
import dedent from "npm:dedent@1.5.1";
import boxen from "npm:boxen@7.1.1";
import { gptPrompt } from "../shared/openai.js";
import { topics } from "./trivia_topics.js";

import {
  Input,
  Select,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";

console.clear();

const banner = figlet.textSync("Trivia 2", "Big");
console.log(chalk.cyan(banner));

async function main() {
  console.log("\n");
  const choice = await Select.prompt({
    message: "Would you like to play or read the instructions?",
    options: ["play", "instructions", "exit"],
  });

  switch (choice) {
    case "play":
      await playGame();
      break;
    case "instructions":
      await showInstructions();
      break;
    case "exit":
      Deno.exit(0);
      break;
  }
}

function showInstructions() {
  const copy = dedent`
  In trivia 2, YOU choose what kind of questions to answer!
  When prompted for a topic, enter ANY topic you can imagine.
  
  Examples:

  - "History"
  - "Science"
  - "18th century literature"
  - "Dungeons and Dragons"

  Good Luck!
  `;

  console.log("\n");
  console.log(
    boxen(copy, {
      title: "Instructions",
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round",
    }),
  );
}

async function playGame() {
  // collect settings
  console.log("\n");

  let topic = await Input.prompt({
    message: "Choose your topic:",
    suggestions: topics,
  });

  const difficulty = await Select.prompt({
    message: "Choose your difficulty:",
    options: ["easy", "medium", "hard", "expert"],
  });

  // play the game
  const questions = await getQuestions(topic, difficulty);
  const score = await askQuestions(questions);

  // show the results
  console.log("\n");
  const resultMessage = `You got ${score} out of ${questions.length} correct!`;
  console.log(
    boxen(resultMessage, {
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round",
    }),
  );
}

async function askQuestions(questions) {
  let score = 0;
  for (const [index, question] of questions.entries()) {
    console.log("\n");
    console.log(chalk.gray(`Question ${index + 1} of ${questions.length}`));
    const answer = await Input.prompt({
      message: question,
    });

    const response = await gptPrompt(
      `
        The question was '${question}'.
        The provided answer was '${answer}'.
        Was the answer correct?
        Be an easy grader. Accept answers that are close enough. Allow misspellings.
        Also provide a response. If the answer was correct respond with a encouraging message and expand on the answer with more information.
        If the answer was incorrect, say "no" and provide the correct answer.
        Keep the response brief, one or two setences.

        respond with json with this format:
        {
          correct: true,
          response: "the correct answer"
        }
        `,
      {
        max_tokens: 128,
        temperature: 0.1,
        response_format: { type: "json_object" },
      },
    );

    try {
      const responseData = JSON.parse(response);
      if (responseData.correct) score++;
      console.log(
        responseData.correct
          ? chalk.green("Correct!")
          : chalk.red("Incorrect!"),
      );
      console.log(responseData.response);
    } catch (_e) {
      console.log(`Error parsing response: "${response}"`);
    }
  }
  return score;
}
async function getQuestions(topic, difficulty) {
  const difficultyPrompts = {
    easy: "Difficulty: easy. Generate questions for a kindergarten student.",
    medium: "Difficulty: medium. Generate questions for high school student.",
    hard: "Difficulty: hard. Generate questions for a college student.",
    expert: "Difficulty: expert. Generate questions for domain expert.",
  };
  const prompt = dedent`
    Generate 4 questions for a triva game. Do not provide answers.
    
    provide the questions as a json array of strings like this:
    {
        questions: ["question 1", "question 2", "question 3", "question 4"]
    }

    Include only the array, start with [ and end with ].

    The topic is ${topic}.
    ${difficultyPrompts[difficulty]}
  `;

  const response = await gptPrompt(prompt, {
    max_tokens: 2048,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(response)?.questions ?? [];
  } catch (_e) {
    console.log(`Error parsing questions: "${response}"`);
    return [];
  }
}

while (true) {
  await main();
}
