// This example prompts the user for a word, then fetches a definition
// from dictionaryapi.dev.
// dictionaryapi.dev is a free API that doesn't require an API key.

// Uses the ?. and ?? operators, which you might want to read up on.

// Optional Chainging
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

// Nullish Coallescing
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing

// import libraries
import { Chalk } from "npm:chalk@5";
const chalk = new Chalk({ level: 1 });
import { input, select } from "npm:@inquirer/prompts@4";

// welcome message
console.log(chalk.blue(`\n\nWelcome to Word Smith!`));

// prompt the user for a word
const word = await input({ message: "Enter your word" });

// fetch the data
const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
const response = await fetch(url);
const data = await response.json();
const definition = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ??
  "unknown";

// report the data
// console.log(chalk.gray(JSON.stringify(data, null, 2)));
console.log(chalk.blue(definition));

// collect feedback
console.log("\n");
const feedback = await select({
  message: "Happy?",
  choices: [{
    name: "yes",
    value: true,
    description: "that definition was great",
  }, {
    name: "no",
    value: false,
    description: "i didn't like it",
  }],
});

console.log(chalk.blue(feedback ? "Great!" : "Whatever."));

Deno.exit(0);
