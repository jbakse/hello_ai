/**
 * Sends an image to GPT and receives a structured JSON response with
 * 'subject' keywords, 'colors', and a 'mood' string.
 */

import { say } from "../../shared/cli.ts";
import { gpt } from "../../shared/openai.ts";

async function main() {
  const pathname = new URL("./data/shelf_sm.png", import.meta.url).pathname;
  const dataURL = await imageToDataURL(pathname);

  const response = await gpt({
    model: "gpt-4o-mini",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              `Analyze the image and provide structured data. The description should be detailed for use as an image prompt.
              
              An example:
              {
                description: "An overhead photograph of an artistic workspace featuring a blank sketchbook surrounded by colorful art supplies and two decorative cupcakes. The composition has vibrant elements that encourage creativity and inspiration.",
                subjects: [
                  "sketchbook",
                  "cupcakes",
                  "markers",
                  "paintbrushes",
                  "sharpener",
                  "washi tape",
                  "eraser"
                ],
                materials: [ "paper", "plastic", "ceramic" ],
                background: "wooden table",
                mood: "creative",
                colors: [ "pink", "white", "blue", "brown", "yellow" ]
              }
              
              `,
          },

          {
            type: "image_url",
            image_url: {
              "url": dataURL,
            },
          },
        ],
      },
    ],
    "response_format": {
      "type": "json_schema",
      "json_schema": {
        "name": "image_analysis",
        "schema": {
          "type": "object",
          "properties": {
            "description": {
              "type": "string",
            },
            "subjects": {
              "type": "array",
              "items": { "type": "string" },
            },
            "materials": {
              "type": "array",
              "items": { "type": "string" },
            },
            "background": {
              "type": "string",
            },
            "mood": {
              "type": "string",
            },
            "colors": {
              "type": "array",
              "items": { "type": "string" },
            },
          },
          "required": [
            "subjects",
            "colors",
            "mood",
            "background",
            "description",
            "materials",
          ],
          "additionalProperties": false,
        },
        "strict": true,
      },
    },
  });

  console.log(response.parsed);
}

main();

/// library functions

import { extname } from "https://deno.land/std@0.211.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.224.0/media_types/mod.ts";
import { encodeBase64 } from "https://deno.land/std@0.211.0/encoding/base64.ts";

// Convert image to data URL
async function imageToDataURL(path) {
  const data = await Deno.readFile(path);
  const mimeType = contentType(extname(path)) || "application/octet-stream";
  const base64Data = encodeBase64(data);
  return `data:${mimeType};base64,${base64Data}`;
}
