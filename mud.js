import { ask, gpt, end } from "./shared.js";

let things = {
  chamber1: {
    id: "chamber1",
    description: "",
    exits: ["chamber2"],
    contents: ["table1"],
    type: "room",
  },
  chamber2: {
    id: "chamber2",
    description: "",
    exits: ["chamber1"],
    contents: ["lock1"],
    type: "room",
  },
  lock1: {
    id: "lock1",
    description: "",
    exits: [],
    contents: [],
    type: "lock",
    status: "locked",
  },
  key1: {
    id: "key1",
    description: "",
    exits: [],
    contents: [],
    type: "key",
    unlocks: "lock1",
  },
  table1: {
    id: "table1",
    description: "",
    exits: [],
    contents: ["key1"],
    type: "item",
  },
};

let location = "chamber1";

main();

async function main() {
  console.log("Hello, Player!");

  console.log("");
  let playing = true;
  while (playing) {
    let command = await ask("\nWhat do you want to do?");
    if (command == "quit") {
      playing = false;
    }

    const prompt = `
  This is a text adventure game.
  Translate the player input to a formatted command in the format <verb> <noun>.
  Verbs can be "look", "go", "take", "talk", and "use".
  Nouns should be the id of a thing.

  Context:
  The current game items are ${JSON.stringify(things)}.
  The current room is "${location}". If you can't infer a noun, use the current room.

  Output Examples:
  look torch1
  look table1
  go door1
  take key1
  use key1



  The player input is '${command}'. 
  Return only the formatted command, which will be two words.
  `;

    const formatted_command = await gpt(prompt, {
      max_tokens: 32,
      temperature: 0.2,
    });

    const verb = formatted_command.split(" ")[0];
    const noun = formatted_command.split(" ")[1];

    console.log(`(${verb}) (${noun})`);

    if (!things[noun]) {
      console.log(`I don't know what ${noun} is.`);
      continue;
    }

    if (verb === "look") {
      if (things[noun].description.length === 0) {
        things[noun].description = await gpt(`
        This is a text adventure. 

        Context:
        The current game items are ${JSON.stringify(things)}.
        The current room is "${location}".

        Write a text description of '${noun}'. Don't use item ids in the description, use natural language.
        `);
      }
      console.log(things[noun].description);
    }
  }

  end();
}
