import * as secrets from "../../secrets.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: secrets.apiKey,
});

async function main() {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 500,

    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Provide a comma separated list of tags for this image.",
          },
          {
            type: "image_url",
            image_url: {
              url: "https://avatars.githubusercontent.com/u/959425?s=400&u=fc061fc5665d8578d902482d4e62eff468315e40&v=4",
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices[0]);
}
main();
