// This example prompts the user for a word, then fetches a definition
// from dictionaryapi.dev.
// dictionaryapi.dev is a free API that doesn't require an API key.

// Uses the ?. and ?? operators, which you might want to read up on.

// Optional Chainging
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

// Nullish Coallescing
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing

// import libraries

import { ask, say } from "../shared/cli.ts";

// welcome message
say(`Welcome to Word Smith!`);

// prompt the user for a word
const word = await ask("Enter your word");

// fetch the data
const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
const response = await fetch(url);
const data = await response.json();
const definition = data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ??
  "unknown";

// report the data
say(definition);
