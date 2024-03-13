import { ask, say } from "../shared/cli.ts";
import { gptPrompt } from "../shared/openai.ts";

const artJsonTemplate = `
{
    "title": "The Mona Lisa",
    "artist": "Leonardo da Vinci",
    "year": 1506,
    "medium": "Oil on poplar",
    "description": "The Mona Lisa is a half-length portrait painting by the Italian Renaissance artist Leonardo da Vinci that has been described as 'the best known, the most visited, the most written about, the most sung about, the most parodied work of art in the world'.",
    "mainColors": [
      "brown",
      "green",
      "blue",
      "yellow"
    ]
  }`;

const title = await ask("What is the title of the artwork? ");

const prompt =
  `Respond with JSON describing ${title}. Return only the json, starting with {. Use this format: ${artJsonTemplate}`;

const jsonResponse = await gptPrompt(prompt, {
  temperature: 0.3,
  max_tokens: 512,
});

say(jsonResponse);

try {
  const data = JSON.parse(jsonResponse);
  const artist = data.artist;
  const year = data.year;
  say(`The artist is ${artist} and the year is ${year}`);
} catch (e) {
  console.log("the json did not parse");
}
