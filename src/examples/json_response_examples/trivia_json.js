/**
 * Trivia 2
 *
 * This example expands triva.js with UX/UI improvements and additional
 * features including a difficulty setting. It also uses the GPT API
 * response_format option to request structured responses.
 */
// deno-lint-ignore-file no-await-in-loop

import figlet from "npm:figlet@1.6.0";
import dedent from "npm:dedent@1.5.1";
import boxen from "npm:boxen@7.1.1";
import {
  Input,
  Select,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";
import { promptGPT } from "../../shared/openai.ts";
import { say } from "../../shared/cli.ts";

// Configuration constants
const CONFIG = {
  QUESTIONS_PER_GAME: 4,
  MAX_RETRIES: 3,
  DIFFICULTIES: {
    easy: {
      description:
        "Difficulty: easy. Generate questions for a kindergarten student.",
      temperature: 0.3,
    },
    medium: {
      description:
        "Difficulty: medium. Generate questions for high school student.",
      temperature: 0.4,
    },
    hard: {
      description:
        "Difficulty: hard. Generate questions for a college student.",
      temperature: 0.5,
    },
    expert: {
      description: "Difficulty: expert. Generate questions for domain expert.",
      temperature: 0.6,
    },
  },
};

/// print banner
console.log(colors.cyan(figlet.textSync("Trivia 2", "Big")));

/// start the game
await main();

/**
 * Main game loop.
 * @returns {Promise<void>}
 */
async function main() {
  while (true) {
    const choice = await Select.prompt({
      message: "Would you like to play or read the instructions?",
      options: ["play", "instructions", "exit"],
    });

    switch (choice) {
      case "play":
        await playRound();
        break;
      case "instructions":
        await showInstructions();
        break;
      case "exit":
        Deno.exit(0);
        break;
    }
  }
}

/**
 * Shows the instructions for the game.
 */
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

  say();
  say(
    boxen(copy, {
      title: "Instructions",
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round",
    }),
  );
  say();
}

/**
 * Prompts the user for topic and difficulty, generates and asks questions,
 * then shows the results.
 * @returns {Promise<void>}
 */
async function playRound() {
  try {
    // collect settings
    say();

    const topic = await Input.prompt({
      message: "Choose your topic:",
      suggestions: ["science", "history", "literature", "dungeons and dragons"],
      validate: (value) => {
        if (value.trim().length === 0) return "Topic cannot be empty";
        return true;
      },
    });

    const difficulty = await Select.prompt({
      message: "Choose your difficulty:",
      options: Object.keys(CONFIG.DIFFICULTIES),
    });

    // play the game
    const questions = await getQuestions(topic, difficulty);
    if (questions.length === 0) {
      throw new Error("Failed to generate questions. Please try again.");
    }

    const score = await askQuestions(questions);

    // show the results
    say();
    say(
      boxen(
        `You got ${score} out of ${questions.length} correct!${
          score === questions.length ? "\n🎉 Perfect score!" : ""
        }`,
        {
          padding: 1,
          borderColor: "cyan",
          borderStyle: "round",
        },
      ),
    );
    say();
  } catch (error) {
    say(colors.red(`Error during game: ${error.message}`));
  }
}

/**
 * Takes an array of questions and asks them one by one
 * @param {string[]} questions - Array of question strings
 * @returns {Promise<number>} The number of correct answers
 */
async function askQuestions(questions) {
  let score = 0;
  for (const [index, question] of questions.entries()) {
    say();
    say(
      colors.gray(`Question ${index + 1} of ${questions.length}`),
    );
    const isCorrect = await askQuestion(question);
    if (isCorrect) score++;
  }
  return score;
}

/**
 * Takes a question, asks for a response, and evaluates it using GPT
 * @param {string} question - The trivia question to ask
 * @returns {Promise<boolean>} Whether the answer was correct
 */
async function askQuestion(question) {
  // prompt for answer
  const answer = await Input.prompt({
    message: question,
  });

  // ask GPT for evaluation
  const prompt = dedent`
    The question was '${question}'.
    The provided answer was '${answer}'.
    Was the answer correct? Be an easy grader. Accept answers that are close enough. Allow misspellings.
    Also provide a response. If the answer was correct respond with a encouraging message and expand on the answer with more information.
    If the answer was incorrect, say "no" and provide the correct answer and explain why the answer was incorrect in an encouraging way.
    Keep the response brief, one or two sentences.

    Respond with json with this format:
    {
      isCorrect: true,
      response: "the correct answer"
    }
  `;
  const response = await promptGPT(prompt, {
    max_tokens: 128,
    temperature: 0.1,
    response_format: { type: "json_object" },
  }, {
    loadingMessage: "Evaluating your answer...",
    successMessage: false,
  });
  const responseData = tryJSONParse(response);

  // handle error
  if (!responseData) {
    say(`Error parsing response: "${response}"`);
    return false;
  }

  // show the result
  say();
  if (responseData.isCorrect) {
    say(colors.green("Correct!"));
  } else {
    say(colors.red("Incorrect!"));
  }
  say(responseData.response);

  // return the evaluation for scoring
  return responseData.isCorrect;
}

/**
 * Uses the GPT API to generate questions for a given topic and difficulty
 * @param {string} topic - The topic for questions
 * @param {string} difficulty - The difficulty level (easy, medium, hard, expert)
 * @returns {Promise<string[]>} Array of questions
 */
async function getQuestions(topic, difficulty) {
  let retries = 0;
  while (retries < CONFIG.MAX_RETRIES) {
    try {
      const difficultyConfig = CONFIG.DIFFICULTIES[difficulty];
      const prompt = dedent`
        Generate ${CONFIG.QUESTIONS_PER_GAME} questions for a trivia game. Do not provide answers.
        The topic is ${topic}.
        ${difficultyConfig.description}

        Provide the questions as a json array of strings like this:
        {
            questions: ["question 1", "question 2", "question 3", "question 4"]
        }
      `;

      const response = await promptGPT(prompt, {
        max_tokens: 2048,
        temperature: difficultyConfig.temperature,
        response_format: { type: "json_object" },
      }, {
        loadingMessage: "Generating questions...",
        successMessage: "Questions generated!",
      });

      const responseData = tryJSONParse(response);

      if (!responseData?.questions?.length) {
        throw new Error("Invalid response format from GPT");
      }

      return responseData.questions;
    } catch (error) {
      retries++;
      if (retries === CONFIG.MAX_RETRIES) {
        say(
          colors.red(
            `Failed to generate questions after ${CONFIG.MAX_RETRIES} attempts`,
          ),
        );
        return [];
      }
      say(
        colors.yellow(
          `Retrying question generation (attempt ${
            retries + 1
          }/${CONFIG.MAX_RETRIES})...`,
        ),
      );
    }
  }
  return [];
}

/**
 * Safely parse JSON with error logging
 * @param {string} str - The string to parse as JSON
 * @returns {object|null} Parsed JSON object or null if parsing fails
 */
function tryJSONParse(str) {
  try {
    const parsed = JSON.parse(str);
    if (!parsed || typeof parsed !== "object") {
      say(colors.yellow("Warning: Parsed JSON is not an object"));
      return null;
    }
    return parsed;
  } catch (error) {
    say(colors.red(`JSON Parse Error: ${error.message}`));
    return null;
  }
}
