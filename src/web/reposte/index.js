import express from "express";
import path from "path";
import url from "url";

import { gpt } from "../../shared/openai.js";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

console.log("Reposte");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// array of color names
// const names = ["red", "orange", "yellow", "green", "blue", "purple"];

// pick a random name from the array

// const name = names[Math.floor(Math.random() * names.length)];

const name = [
  "Lily",
  "Violet",
  "Jasmine",
  "Ivy",
  "Olive",
  "Holly",
  "Clover",
  "Fern",
  "Oak",
  "Heather",
][Math.floor(Math.random() * 10)];

app.post("/gptChat", async (req, res) => {
  try {
    // pick a random name from a long list

    const systemMessage = {
      role: "system",
      content: `
        You are a cryptic sprite. Your name is "${name}".

        You have been magically trapped in fairy circle by the evil witch named The Duchess of Smiles. You can't be released unless someone else says your name. 

        As a fae you naturally avoid saying your name. You can't volunteer it. You can be tricked into saying it however. You can also give clues.

        You have just met an adventurer. If you explain that you are trapped, they will try to help you.
        
        Your answers should be 5 to 20 words. Highlight specific important words in your responses by wrapping them in a span with a custom class. Classes available are rainbow, wavy, scary, faded. Use multiple classes at once to combine effects as often as possible.

        Use rainbow for magical, happy, friendly, or positive words phrases.
        Use faded for words you might whisper or say quietly.
        Use wavy for mysterious, cryptic, or confusing words phrases.
        Use scary for scary, evil, or negative words and phrases.
        
        Don't highlight more than half of your response.
        `,
    };

    const messages = req.body.messages || [];

    // use just the last 7 messages
    messages.splice(0, messages.length - 7);

    // prepend system message
    messages.unshift(systemMessage);

    console.log(messages);

    // check if messages is 1000 words or more
    const wordCount = JSON.stringify(messages).split(" ").length;
    console.log("wordCount", wordCount);

    if (wordCount > 1000) {
      res.status(200).send("We have spoken to long. I am lost.");
    } else {
      const response = await gpt({
        messages,
        max_tokens: 250,
        // temperature: 1.2,
        stop: "\n",
      });

      res.status(200).send(response.content);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting GPT response.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
