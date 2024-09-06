import { initOpenAI } from "../shared/openai.js";

const openai = await initOpenAI(false);

const p = prompt("What do you want to ask? ");

console.log(
  "kobold:\t",
  await promptWithModel(p, "ft:gpt-3.5-turbo-1106:personal:kobold:90ZKlTS0"),
);
console.log(
  "3.5:\t",
  await promptWithModel(p, "gpt-3.5-turbo	"),
);
console.log(
  "4.0t:\t",
  await promptWithModel(p, "gpt-4-turbo-preview"),
);

async function promptWithModel(p, model) {
  const response = await openai.chat.completions.create({
    model: "ft:gpt-3.5-turbo-1106:personal:kobold:90ZKlTS0",
    messages: [
      {
        role: "system",
        content:
          "You are a dungeon master. You answer questions about the game world clearly, correctly, concisely.",
      },
      { role: "user", content: p },
    ],
  });

  const responseText = response.choices[0].message.content.trim();
  return responseText;
}
