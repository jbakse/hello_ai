import util from "util";
import * as secrets from "../../secrets.js";
import OpenAI from "openai";

import { say, ask, end } from "../shared/cli.js";

const openai = new OpenAI({
  apiKey: secrets.apiKey,
});

async function main() {
  say("Welcome to Kobolds & Console Logs!\n");
  say("This demo is expensive to run.");
  const cont = await ask("Continue? (y/n) ");
  if (cont !== "y") process.exit();

  const prompt = await ask("What do you want to know? ");

  const assistant = await openai.beta.assistants.retrieve(
    "asst_AKlivaymeflPIsBcLB3tOs5e",
  );

  //   console.log(assistant);

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: prompt,
  });

  const run_base = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
  });

  while (true) {
    const run = await openai.beta.threads.runs.retrieve(thread.id, run_base.id);
    if (run.status === "completed") {
      break;
    }
    // console.log("waiting...");
    process.stdout.write(".");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  console.log("");

  const messages = await openai.beta.threads.messages.list(thread.id);
  //   console.log(util.inspect(messages.body.data, false, null, true));

  const filtered = messages.body.data.filter((message) => {
    // console.log(
    //   "message",
    //   message.content[0],
    //   message.content[0]?.type,
    //   message.content[0]?.type === "text",
    // );
    return message.content[0]?.type === "text";
  });
  //   console.log(filtered);
  const mapped = filtered.map((message) => message.content[0].text.value);

  //   console.log("mapped!");
  console.log(mapped[0]);

  end();
}

main();
