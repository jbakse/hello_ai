import { ask, gpt, end } from "./shared.js";

main();

async function main() {
  console.log("Hello, Player!");

  let context = [];
  let playing = true;
  const location = "woods";
  const player = {};
  player.name = await ask("What is your name?");
  player.class = await ask("What is your class?");

  console.log("");

  while (playing) {
    let command = await ask("What do you want to do?");
    if (command == "quit") {
      playing = false;
    }

    let prompt = `
  This is a text adventure game.
  The player is a ${player.class} named ${player.name}.
  The current setting is ${location}.
 
  Recently: ${context.slice(-3).join(" ")}

  Respond in second person.
  Be breif, and avoid narating actions not taken by the player via commands.
  When describing locations mention places the player might go.

  

  The player command is '${command}'. 
  `;

    let response = await gpt(prompt, { max_tokens: 128, temperature: 0.5 });
    context.push(response);
    console.log(`\n${response}\n`);
  }

  end();
}
