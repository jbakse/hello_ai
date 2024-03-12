/**
 * Triva 2
 *
 * This example expands triva.js with UX/UI improvements and additional
 * features including a diffuculty setting. It also uses the GPT API
 * response_format option to request structured responses.
 */

// import and configure dependencies

import figlet from "npm:figlet@1.6.0";
import dedent from "npm:dedent@1.5.1";
import boxen from "npm:boxen@7.1.1";
import wrapAnsi from "npm:wrap-ansi@9";
import {
  Input,
  Select,
} from "https://deno.land/x/cliffy@v1.0.0-rc.3/prompt/mod.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.3/ansi/colors.ts";

import { gptPrompt, initOpenAI } from "../shared/openai.ts";

// init openai quietly
await initOpenAI(false);

// print banner
console.clear();
console.log(colors.cyan(figlet.textSync("Trivia 2", "Big")));

// main loop
while (true) {
  await main();
}

async function main() {
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

  print();
  print(
    boxen(copy, {
      title: "Instructions",
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round",
    }),
  );
  print();
}

// prompts the user for topic and difficulty
// generates and asks questions
// shows the results
async function playGame() {
  // collect settings
  print();

  const topic = await Input.prompt({
    message: "Choose your topic:",
    suggestions: ["science", "history", "literature", "dungeons and dragons"],
  });

  const difficulty = await Select.prompt({
    message: "Choose your difficulty:",
    options: ["easy", "medium", "hard", "expert"],
  });

  // play the game
  const questions = await getQuestions(topic, difficulty);
  const score = await askQuestions(questions);

  // show the results
  print();
  print(
    boxen(`You got ${score} out of ${questions.length} correct!`, {
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round",
    }),
  );
  print();
}

// takes an array of questions and asks them one by one
// returns the number of correct answers
async function askQuestions(questions) {
  let score = 0;
  for (const [index, question] of questions.entries()) {
    print();
    print(
      colors.gray(`Question ${index + 1} of ${questions.length}`),
    );
    const isCorrect = await askQuestion(question);
    if (isCorrect) score++;
  }
  return score;
}

// takes a question and asks for a response
// uses the GPT API to evaluate the response
// returns true if the response was correct
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
  const response = await gptPrompt(prompt, {
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
    console.error(`Error parsing response: "${response}"`);
    return false;
  }

  // show the result
  print();
  if (responseData.isCorrect) {
    print(colors.green("Correct!"));
  } else {
    print(colors.red("Incorrect!"));
  }
  print(responseData.response);

  // return the evaluation for scoring
  return responseData.isCorrect;
}

// uses the GPT API to generate questions for a given topic and difficulty
async function getQuestions(topic, difficulty) {
  // ask GPT for questions
  const difficultyPrompts = {
    easy: "Difficulty: easy. Generate questions for a kindergarten student.",
    medium: "Difficulty: medium. Generate questions for high school student.",
    hard: "Difficulty: hard. Generate questions for a college student.",
    expert: "Difficulty: expert. Generate questions for domain expert.",
  };
  const prompt = dedent`
    Generate 4 questions for a triva game. Do not provide answers.
    The topic is ${topic}.
    ${difficultyPrompts[difficulty]}

    Provide the questions as a json array of strings like this:
    {
        questions: ["question 1", "question 2", "question 3", "question 4"]
    }
  `;

  const response = await gptPrompt(prompt, {
    max_tokens: 2048,
    temperature: 0.3,
    response_format: { type: "json_object" },
  }, {
    loadingMessage: "Generating questions...",
    successMessage: "Questions generated!",
  });

  const responseData = tryJSONParse(response);

  // handle error
  if (!responseData) {
    console.error(`Error parsing questions: "${response}"`);
    return [];
  }

  // respond with the questions or empty array if questions are missing
  return responseData?.questions ?? [];
}

// log text, wrapping at 80 characters
function print(text = "", wrap = 80) {
  console.log(wrapAnsi(text, wrap));
}

// try to parse JSON, return null if it fails
function tryJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch (_e) {
    return null;
  }
}
