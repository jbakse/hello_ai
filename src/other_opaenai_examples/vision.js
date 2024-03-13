import OpenAI from "npm:openai@4";

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const env = await load({ envPath: ".env" });

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
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
            // text: "Provide a comma separated list of tags for this image.",
            // text: "What does this say? Respond just with the text.",
            text: "Write an image prompt from this image.",
          },
          {
            type: "image_url",
            image_url: {
              // url: "https://placekitten.com/g/512/512",
              url:
                "https://cdn.britannica.com/02/216702-050-914C6006/Rosie-the-Riveter-We-Can-Do-It-poster-J-Howard-Miller-circa-1942-1943-World-War-II.jpg?w=300",
            },
          },
        ],
      },
    ],
  });

  console.log(response.choices[0], { colors: true });
  console.log(response.choices[0].message.content);
}
main();
