import OpenAI from "npm:openai@4";

import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";
const env = await load({ envPath: ".env" });

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

async function main() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 500,

    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            // text: "Provide a comma separated list of tags for this image.",
            // text: "What does this say? Respond just with the text.",
            text:
              "Write an image prompt from this image. Include explicit description of the position, style, and text of words in the image.",
          },
          {
            type: "image_url",
            image_url: {
              // url: "https://placekitten.com/g/512/512",
              url:
                //"https://cdn.britannica.com/02/216702-050-914C6006/Rosie-the-Riveter-We-Can-Do-It-poster-J-Howard-Miller-circa-1942-1943-World-War-II.jpg?w=300",
                "https://penji.co/wp-content/uploads/2019/09/Star_Wars_Episode_IV_A_New_Hope-iconic-movie-posters.jpg",
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
