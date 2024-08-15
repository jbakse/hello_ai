/**
 * This is a basic example of sending a prompt to GPT and showing the results.
 */

import { ask, say } from "../../shared/cli.ts";
import { gpt, initOpenAI } from "../../shared/openai.ts";

main();

async function main() {
  initOpenAI();

  say("Hello, GPT!");

  const prompt = "An extreemly dangerous bodyguard to the king.";

  const result = await gpt({
    messages: [{ role: "user", content: prompt }],
    temperature: .8,
    max_tokens: 512,
    model: "gpt-4o-mini",

    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "character_profile",
        "schema": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
            },
            "title": {
              "type": "string",
            },
            "race": {
              "type": "string",
            },
            "class": {
              "type": "string",
            },
            "alignment": {
              "type": "string",
            },
          },
          "required": ["name", "title", "race", "class", "alignment"],
          "additionalProperties": false,
        },
        "strict": true,
      },
    },
  });

  say("");
  say("result.content");
  say(result.content);

  say("");
  say("result.parsed");
  say(JSON.stringify(result.parsed, null, 2));

  say("");
  const character = result.parsed;
  say(`Name: ${character.name}`);
  say(`Title: ${character.title}`);
  say(`Race: ${character.race}`);
  say(`Class: ${character.class}`);
  say(`Alignment: ${character.alignment}`);
}
