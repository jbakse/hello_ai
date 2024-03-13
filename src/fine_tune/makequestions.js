#!/usr/bin/env -S deno run --allow-env --allow-read --allow-net
import dedent from "npm:dedent@1.5.1";

import { gpt, initOpenAI } from "../shared/openai.ts";

await initOpenAI(false);

/// read input from stdin

if (Deno.isatty(Deno.stdin.rid)) {
  console.error("This program requires input from stdin.\n");
  explainUsage();
}
const pipeInput = await readStdin();

/// Use GPT to generate QA pairs

const trainingExample = {
  qaPairs: [{
    question: "Who is Zagdez?",
    answer: "She was a goblin pirate queen that the party killed.",
  }, {
    question: "What is the name of the riverboat junk salesman?",
    answer: "Duffle.",
  }],
};

const messages = [
  {
    role: "system",
    content: dedent`
        You are a tool that prepares content for LLM fine-tuning. Given the user input, generate 30 question-and-answer pairs in an array using this JSON format: ${
      JSON.stringify(trainingExample, null, 2)
    }

    Both the questions and answers should be short and to the point.
    `,
  },
  {
    role: "user",
    content: pipeInput,
  },
];

const response = await gpt({
  messages,
  model: "3.5-turbo",
  max_tokens: 4096,
  response_format: { type: "json_object" },
});

/// Validate Response

const responseString = response.content.trim();
const responseData = tryJSONParse(responseString);
if (
  !responseData ||
  !responseData.qaPairs ||
  !Array.isArray(responseData.qaPairs)
) {
  console.error(`Error parsing qaPairs: "${responseString}"`);
  Deno.exit(1);
}

/// Formate the QA Pairs as training data, output one per line

function formatQAPair(qaPair) {
  const systemPrompt =
    "You are a dungeon master. You answer questions about the game world clearly, correctly, concisely.";

  return `{"messages": [{"role": "system", "content": "${systemPrompt}"}, {"role": "user", "content": "${qaPair.question}"}, {"role": "assistant", "content": "${qaPair.answer}"}]}`;
}

for (const qaPairs of responseData.qaPairs) {
  console.log(formatQAPair(qaPairs));
}

/// Utility Functions

/**
 * Tries to parse a JSON string into an object.
 *
 * @param {string} str - The JSON string to parse.
 * @returns {object|null} - The parsed object, or null if parsing fails.
 */
function tryJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch (_e) {
    return null;
  }
}

/**
 * Reads the full contents of the standard input (stdin)
 * and returns it as a string.
 *
 * @returns {Promise<string>}
 * A promise that resolves to the contents of stdin as a string.
 */
async function readStdin() {
  const decoder = new TextDecoder();
  const chunks = [];

  for await (const chunk of Deno.stdin.readable) {
    chunks.push(decoder.decode(chunk));
  }

  return chunks.join("");
}

function explainUsage() {
  console.error("Usage: cat somefile.txt | ./makequestions.js");
  Deno.exit(1);
}
